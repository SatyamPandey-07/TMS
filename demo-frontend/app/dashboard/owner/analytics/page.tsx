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
  CalendarIcon,
  EyeIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface WeeklyData {
  week: string;
  weekLabel: string;
  revenue: number;
  bookings: number;
}

interface AnalyticsData {
  weeklyData: WeeklyData[];
  totalRevenue: number;
  totalBookings: number;
  projectedIncome: number;
  growthRate: number;
  monthlyComparison: MonthlyData[];
  peakDays: DayData[];
}

interface MonthlyData {
  month: string;
  revenue: number;
  bookings: number;
}

interface DayData {
  day: string;
  bookings: number;
  revenue: number;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    weeklyData: [],
    totalRevenue: 0,
    totalBookings: 0,
    projectedIncome: 0,
    growthRate: 0,
    monthlyComparison: [],
    peakDays: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/analytics');
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate additional metrics
  const averageWeeklyRevenue = analyticsData.weeklyData.length > 0 
    ? analyticsData.totalRevenue / analyticsData.weeklyData.length 
    : 0;

  const averageBookingsPerWeek = analyticsData.weeklyData.length > 0 
    ? analyticsData.totalBookings / analyticsData.weeklyData.length 
    : 0;

  // Prepare projection data
  const projectionData = [...analyticsData.weeklyData];
  if (projectionData.length > 0) {
    const lastWeek = projectionData[projectionData.length - 1];
    const avgGrowth = analyticsData.growthRate / 100;
    
    // Add 4 future weeks
    for (let i = 1; i <= 4; i++) {
      const nextWeekDate = new Date(lastWeek.week);
      nextWeekDate.setDate(nextWeekDate.getDate() + (7 * i));
      
      const projectedRevenue = lastWeek.revenue * Math.pow(1 + avgGrowth, i);
      const projectedBookings = Math.round(lastWeek.bookings * Math.pow(1 + avgGrowth * 0.8, i));
      
      projectionData.push({
        week: nextWeekDate.toISOString().split('T')[0],
        weekLabel: `Week ${i} (Projected)`,
        revenue: Math.max(0, projectedRevenue),
        bookings: Math.max(0, projectedBookings)
      });
    }
  }

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  if (isLoading) {
    return (
      <DashboardLayout type="owner">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout type="owner">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={fetchAnalyticsData}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="owner">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your business performance and projections</p>
          </div>
          <Button onClick={fetchAnalyticsData} variant="outline">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{analyticsData.totalRevenue.toLocaleString()}</p>
                </div>
                <CurrencyRupeeIcon className="w-8 h-8 text-purple-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100">Total Bookings</p>
                  <p className="text-2xl font-bold">{analyticsData.totalBookings}</p>
                </div>
                <UserGroupIcon className="w-8 h-8 text-cyan-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100">Growth Rate</p>
                  <p className="text-2xl font-bold flex items-center">
                    {analyticsData.growthRate > 0 ? (
                      <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-5 h-5 mr-1" />
                    )}
                    {Math.abs(analyticsData.growthRate).toFixed(1)}%
                  </p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-emerald-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100">Projected Income (4 weeks)</p>
                  <p className="text-2xl font-bold">₹{analyticsData.projectedIncome.toLocaleString()}</p>
                </div>
                <EyeIcon className="w-8 h-8 text-amber-200" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Weekly Revenue Trend & Projection
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="weekLabel" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `₹${value.toLocaleString()}`,
                      name === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Weekly Bookings Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Weekly Bookings & Projection
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="weekLabel" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [value, 'Bookings']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="bookings" 
                    fill="#06b6d4"
                    name="Bookings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Comparison and Peak Days */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Monthly Performance
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                  <Bar dataKey="bookings" fill="#f59e0b" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Peak Days Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Peak Performance Days
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analyticsData.peakDays}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ day, percent }: any) => `${day} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {analyticsData.peakDays.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Average Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg Weekly Revenue</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₹{averageWeeklyRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg Weekly Bookings</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {averageBookingsPerWeek.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Revenue per Booking</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₹{analyticsData.totalBookings > 0 ? (analyticsData.totalRevenue / analyticsData.totalBookings).toFixed(0) : 0}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Performance Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {analyticsData.growthRate > 0 ? (
                      <>📈 Your business is growing at {analyticsData.growthRate.toFixed(1)}% week-over-week</>
                    ) : analyticsData.growthRate < 0 ? (
                      <>📉 Revenue declined by {Math.abs(analyticsData.growthRate).toFixed(1)}% this week</>
                    ) : (
                      <>📊 Revenue remained stable this week</>
                    )}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    💡 Based on current trends, you could earn ₹{analyticsData.projectedIncome.toLocaleString()} in the next 4 weeks
                  </p>
                </div>
                {analyticsData.peakDays.length > 0 && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      🎯 Your peak day is {analyticsData.peakDays[0].day} with ₹{analyticsData.peakDays[0].revenue.toLocaleString()} revenue
                    </p>
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