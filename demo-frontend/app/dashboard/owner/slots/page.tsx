'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import dayjs from 'dayjs';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Filter, 
  Search, 
  Trash2, 
  Users, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Zap,
  Edit,
  Eye,
  ArrowLeft
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Turf {
  _id: string;
  name: string;
  location: string;
  sport?: string;
  pricePerHour?: number;
  priceBase?: number;
  openHour: number;
  closeHour: number;
  lunchBreak: {
    from: number;
    to: number;
  };
}

interface Slot {
  _id: string;
  turfId: string;
  date: string;
  timeSlot: string;
  startHour: number;
  endHour: number;
  isBooked: boolean;
  booked: boolean;
  bookedBy?: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ManageSlotsPage() {
  const router = useRouter();
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [selectedTurf, setSelectedTurf] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [creatingSlots, setCreatingSlots] = useState(false);

  // Slot generation form state
  const [date, setDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [turfDetails, setTurfDetails] = useState<Turf | null>(null);

  // Slot filter state
  const [filterType, setFilterType] = useState<'all' | 'today' | 'tomorrow' | 'custom'>('all');
  const [customFilterDate, setCustomFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await axios.get('/api/fetch-turf');
        setTurfs(res.data.turfs);
      } catch (err) {
        setError('Failed to fetch turfs');
      }
    };
    fetchTurfs();
  }, []);

  useEffect(() => {
    if (selectedTurf) {
      fetchSlots();
      // Find and set turf details for validation
      const turf = turfs.find((t) => t._id === selectedTurf);
      setTurfDetails(turf || null);
      setError('');
      setSuccess('');
      // Reset filters on turf change
      setFilterType('all');
      setCustomFilterDate('');
    }
  }, [selectedTurf, turfs]);

  const fetchSlots = async () => {
    if (!selectedTurf) return;
    setLoadingSlots(true);
    try {
      const res = await axios.get(`/api/slots/bookings?turfId=${selectedTurf}`);
      setSlots(res.data.slots || []);
    } catch (err) {
      setError('Failed to fetch slots');
    }
    setLoadingSlots(false);
  };

  const generateSlots = async () => {
    if (!selectedTurf || !date || !fromTime || !toTime) {
      setError('Please fill all fields');
      return;
    }

    const fromNum = parseInt(fromTime);
    const toNum = parseInt(toTime);

    if (fromNum >= toNum) {
      setError('From time must be less than to time');
      return;
    }

    if (!turfDetails) {
      setError('Turf details not found');
      return;
    }

    if (fromNum < turfDetails.openHour || toNum > turfDetails.closeHour) {
      setError(`Slots must be within turf open hours (${turfDetails.openHour} - ${turfDetails.closeHour}).`);
      return;
    }

    setCreatingSlots(true);
    setError('');

    try {
      const res = await axios.post(`/api/slots/${selectedTurf}`, {
        date,
        fromTime: fromNum,
        toTime: toNum,
      });
      setSuccess('Slots generated successfully!');
      fetchSlots(); // Refresh slots
      // Reset form
      setDate('');
      setFromTime('');
      setToTime('');
      
      
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to generate slots');
    }
    setCreatingSlots(false);
  };

  const deleteSlot = async (slotId: string) => {
    try {
      await axios.delete(`/api/slots/delete/${slotId}`);
      setSuccess('Slot deleted successfully!');
      fetchSlots(); // Refresh slots
    } catch (err) {
      setError('Failed to delete slot');
    }
  };

  // Filter slots based on selected filter type
  const filteredSlots = useMemo(() => {
    let filtered = slots;

    // Apply date filter
    switch (filterType) {
      case 'today':
        filtered = filtered.filter(slot => 
          dayjs(slot.date).isSame(dayjs(), 'day')
        );
        break;
      case 'tomorrow':
        filtered = filtered.filter(slot => 
          dayjs(slot.date).isSame(dayjs().add(1, 'day'), 'day')
        );
        break;
      case 'custom':
        if (customFilterDate) {
          filtered = filtered.filter(slot => 
            dayjs(slot.date).isSame(dayjs(customFilterDate), 'day')
          );
        }
        break;
      default:
        break;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(slot => 
        slot.timeSlot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (slot.bookedBy && slot.bookedBy.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [slots, filterType, customFilterDate, searchTerm]);

  const getSlotStatusColor = (slot: Slot) => {
    if (slot.isBooked || slot.booked) return 'bg-red-100 border-red-300 text-red-700';
    return 'bg-green-100 border-green-300 text-green-700';
  };

  const getSlotStatusIcon = (slot: Slot) => {
    if (slot.isBooked || slot.booked) return <XCircle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <DashboardLayout type="owner">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Manage Slots
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Generate and manage time slots for your turfs
          </p>
        </motion.div>

        {/* Turf Selection */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-8"
        >
          <Card className="p-6 bg-white/95 dark:bg-gray-800/95">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Select Turf
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {turfs.map((turf) => (
                <motion.div
                  key={turf._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTurf === turf._id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTurf(turf._id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {turf.name}
                    </h3>
                    {selectedTurf === turf._id && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {turf.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{turf.sport || "Sports"}</Badge>
                    <span className="text-sm font-medium text-green-600">
                      ₹{turf.priceBase || turf.pricePerHour}/hr
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {selectedTurf && (
          <>
            {/* Slot Generation Form */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="mb-8"
            >
              <Card className="p-6 bg-white/95 dark:bg-gray-800/95">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Generate New Slots
                </h2>
                
                {/* Success/Error Messages */}
                {error && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {success}
                    </div>
                    <span className="text-sm opacity-75">Redirecting to dashboard...</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      From Time
                    </label>
                    <Input
                      type="number"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      min={turfDetails?.openHour || 6}
                      max={turfDetails?.closeHour || 23}
                      placeholder={`From (e.g. ${turfDetails?.openHour || 9})`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      To Time
                    </label>
                    <Input
                      type="number"
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                      min={turfDetails?.openHour || 6}
                      max={turfDetails?.closeHour || 23}
                      placeholder={`To (e.g. ${turfDetails?.closeHour || 18})`}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={generateSlots}
                      disabled={creatingSlots}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {creatingSlots ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Generate Slots
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {turfDetails && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Turf Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Open Hours:</span>
                        <span className="ml-2 font-medium">{turfDetails.openHour}:00 - {turfDetails.closeHour}:00</span>
                      </div>
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Lunch Break:</span>
                        <span className="ml-2 font-medium">{turfDetails.lunchBreak.from}:00 - {turfDetails.lunchBreak.to}:00</span>
                      </div>
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Price:</span>
                        <span className="ml-2 font-medium">₹{turfDetails.pricePerHour}/hour</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="mb-6"
            >
              <Card className="p-6 ">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    <Button
                    variant={filterType === 'today' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('today')}
                  >
                    Today
                  </Button>

                  <Button
                    variant={filterType === 'tomorrow' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('tomorrow')}
                  >
                    Tomorrow
                  </Button>

                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('all')}
                  >
                    All Slots
                  </Button>

                  <Button
                    variant={filterType === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('custom')}
                  >
                    Custom Date
                  </Button>

                    {filterType === 'custom' && (
                      <Input
                        type="date"
                        value={customFilterDate}
                        onChange={(e) => setCustomFilterDate(e.target.value)}
                        className="w-auto"
                      />
                    )}
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search slots..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Slots Display */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              {loadingSlots ? (
                <Card className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Loading slots...</p>
                </Card>
              ) : filteredSlots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredSlots.map((slot) => (
                    <motion.div
                      key={slot._id}
                      variants={fadeInUp}
                      className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${getSlotStatusColor(slot)}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {getSlotStatusIcon(slot)}
                          <span className="ml-2 font-medium">
                            {slot.isBooked || slot.booked ? 'Booked' : 'Available'}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSlot(slot._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {dayjs(slot.date).format('MMM DD, YYYY')}
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          {slot.timeSlot || `${slot.startHour}:00 - ${slot.endHour}:00`}
                        </div>
                        {slot.bookedBy && (
                          <div className="flex items-center text-sm">
                            <Users className="w-4 h-4 mr-2" />
                            {slot.bookedBy}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No slots found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-6">
                    {slots.length === 0 
                      ? "Generate your first slots to get started"
                      : "Try adjusting your filters"
                    }
                  </p>
                  {slots.length > 0 && (
                    <Button
                      onClick={() => {
                        setFilterType('all');
                        setCustomFilterDate('');
                        setSearchTerm('');
                      }}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  )}
                </Card>
              )}
            </motion.div>
          </>
        )}

        {!selectedTurf && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <Card className="p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Select a turf to get started
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Choose a turf from above to manage its slots
              </p>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}