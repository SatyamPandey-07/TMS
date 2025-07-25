'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Building, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Star, 
  MapPin, 
  Clock,
  Plus,
  BarChart3,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const turfs = [
    {
      id: 1,
      name: "Elite Sports Complex",
      location: "Mumbai, Maharashtra", 
      bookings: 45,
      revenue: "₹89,500",
      rating: 4.8,
      status: "active"
    },
    {
      id: 2,
      name: "Champions Cricket Ground",
      location: "Pune, Maharashtra",
      bookings: 32,
      revenue: "₹64,000", 
      rating: 4.6,
      status: "active"
    },
    {
      id: 3,
      name: "Green Valley Football Turf",
      location: "Bangalore, Karnataka",
      bookings: 28,
      revenue: "₹56,000",
      rating: 4.9,
      status: "maintenance"
    }
  ];

  const recentBookings = [
    {
      id: 1,
      turf: "Elite Sports Complex",
      customer: "Rajesh Kumar",
      date: "Jan 25, 2025",
      time: "7:00 PM - 9:00 PM",
      amount: "₹2,000",
      status: "confirmed"
    },
    {
      id: 2,
      turf: "Champions Cricket Ground", 
      customer: "Priya Sharma",
      date: "Jan 25, 2025",
      time: "5:00 PM - 7:00 PM",
      amount: "₹1,800",
      status: "pending"
    },
    {
      id: 3,
      turf: "Green Valley Football Turf",
      customer: "Amit Patel",
      date: "Jan 24, 2025",
      time: "6:00 PM - 8:00 PM", 
      amount: "₹2,200",
      status: "completed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">⚽</span>
              </div>
              <span className="text-xl font-bold">TurfBooking</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome back, Satyam!</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">S</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
              <p className="text-xl opacity-90">Manage your turfs and track performance</p>
            </div>
            <Link 
              href="/dashboard/owner/add-turf"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Turf
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-green-500 text-sm font-medium">+2 this month</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">3</div>
            <div className="text-gray-600">Total Turfs</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-500 text-sm font-medium">+15 this week</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">105</div>
            <div className="text-gray-600">Total Bookings</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-green-500 text-sm font-medium">+₹25K this month</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">₹2,09,500</div>
            <div className="text-gray-600">Total Revenue</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-green-500 text-sm font-medium">+0.2 this month</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">4.8</div>
            <div className="text-gray-600">Average Rating</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 rounded-lg p-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('turfs')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'turfs' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            My Turfs
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'bookings' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Bookings
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Revenue Analytics</h2>
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-gray-600">Revenue chart would be displayed here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div>
                          <h3 className="font-semibold">{booking.customer}</h3>
                          <p className="text-sm text-gray-600">{booking.turf} • {booking.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{booking.amount}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'turfs' && (
              <div className="space-y-6">
                {turfs.map((turf) => (
                  <div key={turf.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{turf.name}</h3>
                        <div className="flex items-center gap-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{turf.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{turf.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(turf.status)}`}>
                          {turf.status}
                        </span>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{turf.bookings}</div>
                        <div className="text-sm text-gray-600">This Month</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">{turf.revenue}</div>
                        <div className="text-sm text-gray-600">Revenue</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 flex items-center justify-center">
                        <div className="flex gap-2">
                          <button className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6">All Bookings</h2>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{booking.customer}</h3>
                          <p className="text-sm text-gray-600">{booking.turf}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                        <div className="font-semibold text-green-600">{booking.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href="/dashboard/owner/add-turf"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Turf
                </Link>
                <Link 
                  href="/dashboard/owner/slots"
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Manage Slots
                </Link>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Occupancy Rate</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Customer Satisfaction</span>
                  <span className="font-semibold">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Boost Your Business</h3>
              <p className="text-purple-100 mb-4">Upgrade to premium for advanced analytics</p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
