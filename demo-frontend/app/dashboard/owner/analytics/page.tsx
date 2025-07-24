'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CurrencyRupeeIcon, 
  UserGroupIcon, 
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    growthRate: 0,
    popularHours: [],
    monthlyData: []
  });
  const [timeRange, setTimeRange] = useState('7d');

  const mockChartData = [
    { day: 'Mon', bookings: 12, revenue: 6000 },
    { day: 'Tue', bookings: 8, revenue: 4000 },
    { day: 'Wed', bookings: 15, revenue: 7500 },
    { day: 'Thu', bookings: 10, revenue: 5000 },
    { day: 'Fri', bookings: 20, revenue: 10000 },
    { day: 'Sat', bookings: 25, revenue: 12500 },
    { day: 'Sun', bookings: 18, revenue: 9000 }
  ];

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
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your business performance and insights
            </p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? 'btn-girly dark:btn-manly' : ''}
              >
                {range}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                <CurrencyRupeeIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹54,000</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <span className="text-xs text-green-500 font-medium">+12% from last period</span>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">108</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
            <span className="text-xs text-green-500 font-medium">+8% from last period</span>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">89</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Unique Customers</p>
            <span className="text-xs text-red-500 font-medium">-3% from last period</span>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">85%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Occupancy Rate</p>
            <span className="text-xs text-green-500 font-medium">+5% from last period</span>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Revenue Chart */}
          <Card className="p-6 shadow-girly dark:shadow-manly">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue Trend
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockChartData.map((item, index) => (
                <div key={item.day} className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.revenue / 12500) * 100}%` }}
                    transition={{ delay: 0.1 * index, duration: 0.8 }}
                    className="w-full bg-gradient-to-t from-pink-400 to-purple-500 dark:from-blue-400 dark:to-red-500 rounded-t-lg mb-2 min-h-[20px]"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{item.day}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Bookings Chart */}
          <Card className="p-6 shadow-girly dark:shadow-manly">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Booking Trend
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockChartData.map((item, index) => (
                <div key={item.day} className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.bookings / 25) * 100}%` }}
                    transition={{ delay: 0.1 * index, duration: 0.8 }}
                    className="w-full bg-gradient-to-t from-green-400 to-blue-500 dark:from-cyan-400 dark:to-blue-600 rounded-t-lg mb-2 min-h-[20px]"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{item.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Popular Hours & Top Turfs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Popular Hours */}
          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Peak Hours
            </h3>
            <div className="space-y-3">
              {[
                { time: '6:00 PM - 8:00 PM', bookings: 45, percentage: 85 },
                { time: '8:00 PM - 10:00 PM', bookings: 38, percentage: 72 },
                { time: '4:00 PM - 6:00 PM', bookings: 32, percentage: 60 },
                { time: '10:00 AM - 12:00 PM', bookings: 28, percentage: 52 },
                { time: '2:00 PM - 4:00 PM', bookings: 25, percentage: 47 }
              ].map((slot, index) => (
                <div key={slot.time} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{slot.time}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{slot.bookings} bookings</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${slot.percentage}%` }}
                      transition={{ delay: 0.1 * index, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-pink-400 to-purple-500 dark:from-blue-400 dark:to-red-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Performing Turfs */}
          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Performing Turfs
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Champions Arena', revenue: 15000, bookings: 25, growth: 12 },
                { name: 'Victory Ground', revenue: 12000, bookings: 20, growth: 8 },
                { name: 'Elite Sports Club', revenue: 10000, bookings: 18, growth: -2 },
                { name: 'Pro Turf Center', revenue: 8500, bookings: 15, growth: 15 }
              ].map((turf, index) => (
                <motion.div
                  key={turf.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{turf.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ₹{turf.revenue.toLocaleString()} • {turf.bookings} bookings
                    </p>
                  </div>
                  <div className={`text-sm font-medium ${
                    turf.growth > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {turf.growth > 0 ? '+' : ''}{turf.growth}%
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
