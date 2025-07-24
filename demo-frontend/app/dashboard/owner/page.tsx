'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, PlusCircle, Users, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Booking = {
  _id: string;
  turfId: {
    _id: string;
    name: string;
    location: string;
  } | null;
  slotId: {
    date: string;
    startHour: string;
    endHour: string;
  } | null;
  paymentreceived: string;
  status: string;
  createdAt: string;
  userId: {
    name: string;
    email: string;
  } | null;
};

type Turf = {
  _id: string;
  name: string;
  location: string;
  price: number;
  sport: string;
  description: string;
  createdAt: string;
};

export default function OwnerDashboardPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeTurfs: 0,
    todayBookings: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch owner's turfs
        const turfRes = await fetch('/api/fetch-turf');
        const turfData = await turfRes.json();
        
        if (turfData.turfs) {
          setTurfs(turfData.turfs);
        }

        // Fetch owner's bookings
        const bookingRes = await fetch('/api/fetch-booking');
        const bookingData = await bookingRes.json();
        
        if (bookingData.bookings) {
          // Filter out bookings with null slotId or turfId
          const validBookings = bookingData.bookings.filter((booking: Booking) => 
            booking.slotId && booking.turfId
          );
          
          setBookings(validBookings);
          
          // Calculate stats
          const totalRevenue = validBookings.reduce((sum: number, booking: Booking) => 
            sum + parseFloat(booking.paymentreceived || '0'), 0
          );
          
          const today = new Date().toDateString();
          const todayBookings = validBookings.filter((booking: Booking) => 
            new Date(booking.createdAt).toDateString() === today
          ).length;
          
          setStats({
            totalRevenue,
            totalBookings: validBookings.length,
            activeTurfs: turfData.turfs?.length || 0,
            todayBookings
          });
        }
        
      } catch (error) {
        console.error('Error fetching owner dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  console.log(bookings);

  // Get upcoming bookings (future dates) with null checks
  const upcomingBookings = bookings
    .filter(booking => 
      booking.slotId && 
      booking.slotId.date && 
      new Date(booking.slotId.date) >= new Date()
    )
    .sort((a, b) => {
      if (!a.slotId?.date || !b.slotId?.date) return 0;
      return new Date(a.slotId.date).getTime() - new Date(b.slotId.date).getTime();
    })
    .slice(0, 5);

  if (loading) {
    return (
      <DashboardLayout type="owner">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="owner">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white py-12 rounded-xl mb-8"
      >
        <div className="px-6">
          <h1 className="text-3xl font-bold mb-2">Welcome, {session?.user?.name || 'Turf Manager'} 👋</h1>
          <p className="opacity-90">Manage your turfs, view bookings and track your business growth.</p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Turfs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeTurfs}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today&apos;s Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayBookings}</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Bookings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Upcoming Bookings
                  </h2>
                  <Link href="/dashboard/owner/bookings">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
                
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No upcoming bookings</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingBookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {booking.turfId?.name || 'Unknown Turf'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Customer: {booking.userId?.name || 'N/A'}
                            </p>
                          </div>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {booking.slotId?.date ? new Date(booking.slotId.date).toLocaleDateString() : 'No date'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.slotId?.startHour || 'N/A'} - {booking.slotId?.endHour || 'N/A'}
                          </div>
                          <div className="ml-auto font-semibold text-green-600">₹{booking.paymentreceived || '0'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right: Turfs and Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/dashboard/owner/add-turf">
                    <Button className="w-full justify-start">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add New Turf
                    </Button>
                  </Link>
                  <Link href="/dashboard/owner/slots">
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      Manage Slots
                    </Button>
                  </Link>
                  <Link href="/dashboard/owner/analytics">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Your Turfs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Turfs</h2>
                  <Link href="/dashboard/owner/add-turf">
                    <Button size="sm" variant="outline">
                      <PlusCircle className="w-4 h-4 mr-1" /> Add Turf
                    </Button>
                  </Link>
                </div>
                
                {turfs.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No turfs added yet</p>
                    <Link href="/dashboard/owner/add-turf">
                      <Button>Add Your First Turf</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {turfs.map((turf) => (
                      <Link key={turf._id} href={`/dashboard/owner/turfs/${turf._id}`}>
                        <div className="block border border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{turf.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 mt-1">
                                <MapPin className="w-4 h-4" /> {turf.location}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {turf.sport} • ₹{turf.price}/hour
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-600">Active</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(turf.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
