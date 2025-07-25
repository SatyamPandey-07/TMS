'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon, 
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  turfName: string;
  amount: number;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
  transactionId: string;
  slotDetails: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

interface PaymentStats {
  totalRevenue: number;
  monthlyGrowth: number;
  totalTransactions: number;
  successRate: number;
  pendingAmount: number;
  refundedAmount: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    monthlyGrowth: 0,
    totalTransactions: 0,
    successRate: 0,
    pendingAmount: 0,
    refundedAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Sample data - replace with actual API call
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const samplePayments: Payment[] = [
          {
            id: '1',
            bookingId: 'BK001',
            customerName: 'Rahul Sharma',
            customerEmail: 'rahul@example.com',
            turfName: 'Elite Sports Arena',
            amount: 2500,
            date: '2024-07-23',
            time: '14:30',
            status: 'completed',
            paymentMethod: 'upi',
            transactionId: 'TXN12345',
            slotDetails: {
              date: '2024-07-25',
              startTime: '18:00',
              endTime: '19:00'
            }
          },
          {
            id: '2',
            bookingId: 'BK002',
            customerName: 'Priya Patel',
            customerEmail: 'priya@example.com',
            turfName: 'Champions Ground',
            amount: 1800,
            date: '2024-07-23',
            time: '10:15',
            status: 'pending',
            paymentMethod: 'card',
            transactionId: 'TXN12346',
            slotDetails: {
              date: '2024-07-24',
              startTime: '16:00',
              endTime: '17:00'
            }
          },
          {
            id: '3',
            bookingId: 'BK003',
            customerName: 'Amit Kumar',
            customerEmail: 'amit@example.com',
            turfName: 'Sports Paradise',
            amount: 3200,
            date: '2024-07-22',
            time: '09:45',
            status: 'completed',
            paymentMethod: 'netbanking',
            transactionId: 'TXN12347',
            slotDetails: {
              date: '2024-07-26',
              startTime: '20:00',
              endTime: '21:00'
            }
          },
          {
            id: '4',
            bookingId: 'BK004',
            customerName: 'Sneha Reddy',
            customerEmail: 'sneha@example.com',
            turfName: 'Elite Sports Arena',
            amount: 2200,
            date: '2024-07-21',
            time: '16:20',
            status: 'refunded',
            paymentMethod: 'wallet',
            transactionId: 'TXN12348',
            slotDetails: {
              date: '2024-07-23',
              startTime: '15:00',
              endTime: '16:00'
            }
          },
          {
            id: '5',
            bookingId: 'BK005',
            customerName: 'Vikash Singh',
            customerEmail: 'vikash@example.com',
            turfName: 'Champions Ground',
            amount: 1500,
            date: '2024-07-21',
            time: '11:30',
            status: 'failed',
            paymentMethod: 'card',
            transactionId: 'TXN12349',
            slotDetails: {
              date: '2024-07-22',
              startTime: '19:00',
              endTime: '20:00'
            }
          }
        ];

        const sampleStats: PaymentStats = {
          totalRevenue: 89500,
          monthlyGrowth: 12.5,
          totalTransactions: 147,
          successRate: 94.2,
          pendingAmount: 5400,
          refundedAmount: 3200
        };

        setPayments(samplePayments);
        setStats(sampleStats);
        setLoading(false);
      }, 1000);
    };

    fetchPayments();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Refunded</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCardIcon className="w-4 h-4" />;
      case 'upi':
        return <BanknotesIcon className="w-4 h-4" />;
      case 'netbanking':
        return <BanknotesIcon className="w-4 h-4" />;
      case 'wallet':
        return <BanknotesIcon className="w-4 h-4" />;
      default:
        return <CreditCardIcon className="w-4 h-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.turfName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout type="owner">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="owner">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-girly dark:shadow-manly">
            <CreditCardIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-manly">
              Payments & Revenue
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-girly">
              Track all transactions and revenue analytics
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <BanknotesIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <span className="text-xs text-green-500 font-medium">+{stats.monthlyGrowth}% this month</span>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.successRate}%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
            <span className="text-xs text-gray-500">of {stats.totalTransactions} transactions</span>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.pendingAmount.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Amount</p>
            <span className="text-xs text-yellow-500 font-medium">Requires attention</span>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by customer, turf, or transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>

                <Button variant="outline" className="sparkle dark:glow">
                  <FunnelIcon className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-manly">
                Recent Transactions
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Turf
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPayments.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.customerName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {payment.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {payment.turfName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.slotDetails.date} • {payment.slotDetails.startTime}-{payment.slotDetails.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{payment.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span className="text-sm text-gray-900 dark:text-white capitalize">
                            {payment.paymentMethod}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {payment.date}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="outline" size="sm" className="mr-2">
                          View
                        </Button>
                        {payment.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            Refund
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
