'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, Clock, CheckCircle, X, RefreshCw } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingBookings = [
    {
      id: 1,
      turf: "Green Valley Football Turf",
      date: "Jul 28, 2025",
      time: "7:00 PM - 9:00 PM",
      location: "Andheri West, Mumbai",
      amount: "₹2,000",
      status: "confirmed"
    },
    {
      id: 2,
      turf: "Champions Cricket Ground",
      date: "Jul 30, 2025",
      time: "9:00 AM - 11:00 AM",
      location: "Bandra East, Mumbai",
      amount: "₹1,800",
      status: "pending"
    }
  ];

  const pastBookings = [
    {
      id: 3,
      turf: "Elite Sports Complex",
      date: "Jul 20, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Powai, Mumbai",
      amount: "₹2,500",
      status: "completed"
    },
    {
      id: 4,
      turf: "Royal Tennis Courts",
      date: "Jul 15, 2025",
      time: "5:00 PM - 6:00 PM",
      location: "Juhu, Mumbai",
      amount: "₹1,200",
      status: "completed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout type="user">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">My Bookings</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Manage all your turf reservations</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 rounded-lg p-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'upcoming' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'past' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Past
          </button>
        </div>

        {/* Upcoming Bookings */}
        {activeTab === 'upcoming' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Bookings</h3>
                <p className="text-gray-500 mb-6">Ready to book your next game?</p>
                <Link href="/explore" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Explore Turfs
                </Link>
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{booking.turf}</h3>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-2">{booking.amount}</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Confirm Booking
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Reschedule
                    </button>
                    <button className="bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2">
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Past Bookings */}
        {activeTab === 'past' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {pastBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{booking.turf}</h3>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-600 mb-2">{booking.amount}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Book Again
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    Write Review
                  </button>
                  <button className="bg-green-100 text-green-600 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors">
                    Download Receipt
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready for Your Next Game?</h2>
          <p className="text-lg opacity-90 mb-6">Discover amazing turfs near you and book instantly</p>
          <div className="flex gap-4 justify-center">
            <Link href="/explore" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Explore Turfs
            </Link>
            <Link href="/tournaments" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Join Tournament
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
