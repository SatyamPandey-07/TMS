'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, UserIcon, CurrencyRupeeIcon, ClockIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Booking = {
  _id: string;
  turfId: {
    name: string;
    location: string;
  };
  slotId: {
    date: string;
    startHour: string;
    endHour: string;
  };
  userId: {
    name: string;
    email: string;
  };
  paymentreceived: string;
  status: string;
  createdAt: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'upcoming' | 'past'>('upcoming');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/fetch-booking');
        const data = await response.json();
        
        if (data.bookings) {
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on current time and selected filter
  useEffect(() => {
    const currentDateTime = new Date();
    
    const filtered = bookings.filter(booking => {
      // Parse the booking date and time
      const bookingDate = booking.slotId.date;
      const endHour = parseInt(booking.slotId.endHour);
      const bookingDateTime = new Date(bookingDate);
      bookingDateTime.setHours(endHour, 0, 0, 0);
      
      if (filterType === 'upcoming') {
        return bookingDateTime >= currentDateTime;
      } else {
        return bookingDateTime < currentDateTime;
      }
    });

    setFilteredBookings(filtered);
  }, [bookings, filterType]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleFilterChange = (type: 'upcoming' | 'past') => {
    setFilterType(type);
    setDropdownOpen(false);
  };

  return (
    <DashboardLayout type="owner">
      <div className="space-y-6 theme-transition">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 dark:from-blue-400 dark:to-red-400 bg-clip-text text-transparent">
              Bookings Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor and manage all turf bookings
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              <span className="capitalize">{filterType} Bookings</span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10"
              >
                <div className="py-1">
                  <button
                    onClick={() => handleFilterChange('upcoming')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      filterType === 'upcoming' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Upcoming Bookings
                  </button>
                  <button
                    onClick={() => handleFilterChange('past')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      filterType === 'past' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Past Bookings
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="p-6 shadow-girly dark:shadow-manly">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-pink-600 dark:text-blue-400">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filterType === 'upcoming' ? 'Upcoming' : 'Past'} Bookings
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {filteredBookings.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  ₹{bookings.reduce((sum, b) => sum + parseFloat(b.paymentreceived || '0'), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <CurrencyRupeeIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unique Customers</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {new Set(bookings.map(b => b.userId.email)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-6 shadow-girly dark:shadow-manly hover:shadow-lg transition-all duration-300 sparkle dark:glow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {booking.turfId.name}
                      </h3>
                      <Badge className={`${getStatusColor(booking.status)} text-white`}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                        <p className="font-medium text-gray-900 dark:text-white">{booking.userId.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.userId.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(booking.slotId.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.slotId.startHour} - {booking.slotId.endHour}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
                        <p className="font-medium text-green-600 dark:text-green-400">
                          ₹{booking.paymentreceived}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredBookings.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-400 dark:from-blue-400 dark:to-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No {filterType} bookings
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filterType === 'upcoming' 
                ? "No upcoming bookings found. New bookings will appear here."
                : "No past bookings found. Completed bookings will appear here."
              }
            </p>
          </motion.div>
        )}

        {/* Click outside to close dropdown */}
        {dropdownOpen && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setDropdownOpen(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
