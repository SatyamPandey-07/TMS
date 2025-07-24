'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, PhoneIcon, CalendarIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockCustomers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    totalBookings: 15,
    totalSpent: 12500,
    lastBooking: '2024-01-20',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=random'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 87654 32109',
    totalBookings: 22,
    totalSpent: 18900,
    lastBooking: '2024-01-19',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=random'
  },
  {
    id: 3,
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    phone: '+91 76543 21098',
    totalBookings: 8,
    totalSpent: 6400,
    lastBooking: '2024-01-15',
    status: 'inactive',
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Singh&background=random'
  }
];

export default function CustomersPage() {
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 dark:from-blue-400 dark:to-red-400 bg-clip-text text-transparent text-girly dark:text-manly">
              Customer Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your customer relationships and insights
            </p>
          </div>
        </motion.div>

        {/* Customer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
                <p className="text-2xl font-bold text-pink-600 dark:text-blue-400">{mockCustomers.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 dark:from-blue-400 dark:to-red-400 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Customers</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {mockCustomers.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 dark:from-green-400 dark:to-cyan-400 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Bookings</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {Math.round(mockCustomers.reduce((sum, c) => sum + c.totalBookings, 0) / mockCustomers.length)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 dark:from-yellow-400 dark:to-red-400 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ₹{mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-400 dark:to-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">₹</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Customer List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {mockCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.01 }}
              className="group"
            >
              <Card className="p-6 shadow-girly dark:shadow-manly hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 sparkle dark:glow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative"
                    >
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-16 h-16 rounded-full shadow-lg border-4 border-pink-200 dark:border-blue-600"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        customer.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </motion.div>

                    {/* Customer Info */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white text-girly dark:text-manly">
                        {customer.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <EnvelopeIcon className="w-4 h-4 mr-1" />
                          {customer.email}
                        </div>
                        <div className="flex items-center">
                          <PhoneIcon className="w-4 h-4 mr-1" />
                          {customer.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-pink-600 dark:text-blue-400">
                        {customer.totalBookings}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Bookings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ₹{customer.totalSpent.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(customer.lastBooking).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last Booking</p>
                    </div>
                    <Badge className={`${
                      customer.status === 'active' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gray-500 hover:bg-gray-600'
                    } text-white`}>
                      {customer.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Fun Demo Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-blue-600 dark:via-red-600 dark:to-black text-white font-bold rounded-2xl dark:rounded-none shadow-xl hover:shadow-2xl transition-all duration-300 text-girly dark:text-manly sparkle dark:glow"
          >
            ✨ Experience the Magic ✨
          </motion.button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
