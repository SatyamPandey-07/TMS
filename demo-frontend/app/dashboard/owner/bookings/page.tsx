'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, UserIcon, CurrencyRupeeIcon, ClockIcon, ChevronDownIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Booking = {
  _id: string;
  turfId: {
    name: string;
    location: string;
    priceBase?: string;
  } | null;
  slotId: {
    date: string;
    startHour: string;
    endHour: string;
  } | null;
  userId: {
    name: string;
    email: string;
  } | null;
  paymentreceived: string;
  isPaymentReceived: boolean;
  status: string;
  createdAt: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Cancellation modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [submittingCancel, setSubmittingCancel] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/fetch-booking');
        const data = await response.json();
        console.log('Raw booking data:', data);
        
        if (data.bookings) {
          // Filter out bookings with missing critical data
          const validBookings = data.bookings.filter(booking => 
            booking && 
            booking.slotId && 
            booking.slotId.date && 
            booking.turfId && 
            booking.userId
          );
          
          setBookings(validBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on isPaymentReceived
  useEffect(() => {
    const filtered = bookings.filter(booking => {
      if (activeTab === 'open') {
        return !booking.isPaymentReceived;
      } else {
        return booking.isPaymentReceived;
      }
    });

    setFilteredBookings(filtered);
  }, [bookings, activeTab]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleTabChange = (tab: 'open' | 'closed') => {
    setActiveTab(tab);
    setDropdownOpen(false);
  };

  // Function to close booking
  const handleCloseBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/close-booking/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPaymentReceived: true }),
      });

      if (response.ok) {
        // Update local state
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, isPaymentReceived: true }
            : booking
        ));
        alert('Booking closed successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to close booking'}`);
      }
    } catch (error) {
      console.error('Error closing booking:', error);
      alert('Error closing booking. Please try again.');
    }
  };

  // Function to open cancel modal
  const handleCancelBookingClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
    setCancellationReason('');
  };

  // Function to submit cancellation with reason
  const handleSubmitCancellation = async () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }

    setSubmittingCancel(true);

    try {
      const response = await fetch(`/api/cancel-booking/${selectedBookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cancellationReason: cancellationReason.trim() 
        }),
      });

      if (response.ok) {
        // Remove booking from local state
        setBookings(prev => prev.filter(booking => booking._id !== selectedBookingId));
        alert('Booking cancelled successfully!');
        setShowCancelModal(false);
        setCancellationReason('');
        setSelectedBookingId('');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to cancel booking'}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking. Please try again.');
    } finally {
      setSubmittingCancel(false);
    }
  };

  // Function to close cancel modal
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancellationReason('');
    setSelectedBookingId('');
  };

  // Calculate total revenue with safety checks
  const calculateTotalRevenue = () => {
    const openBookingsRevenue = bookings
      .filter(b => !b.isPaymentReceived && b.paymentreceived)
      .reduce((sum, b) => sum + parseFloat(b.paymentreceived || '0'), 0);
    
    const closedBookingsRevenue = bookings
      .filter(b => b.isPaymentReceived && b.turfId?.priceBase)
      .reduce((sum, b) => sum + parseFloat(b.turfId.priceBase || '0'), 0);
    
    return openBookingsRevenue + closedBookingsRevenue;
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

          {/* Tab Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              <span className="capitalize">{activeTab} Bookings</span>
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
                    onClick={() => handleTabChange('open')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      activeTab === 'open' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Open Bookings
                  </button>
                  <button
                    onClick={() => handleTabChange('closed')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      activeTab === 'closed' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Closed Bookings
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
                  {activeTab === 'open' ? 'Open' : 'Closed'} Bookings
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
                  ₹{calculateTotalRevenue()}
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
                  {new Set(bookings.filter(b => b.userId?.email).map(b => b.userId.email)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading bookings...</span>
          </div>
        ) : (
          /* Bookings List */
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
                          {booking.turfId?.name || 'Unknown Turf'}
                        </h3>
                        <Badge className={`${getStatusColor(booking.status)} text-white`}>
                          {booking.status}
                        </Badge>
                        <Badge className={`${booking.isPaymentReceived ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                          {booking.isPaymentReceived ? 'Closed' : 'Open'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                          <p className="font-medium text-gray-900 dark:text-white">{booking.userId?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{booking.userId?.email || 'No email'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {booking.slotId?.date ? new Date(booking.slotId.date).toLocaleDateString() : 'Invalid Date'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.slotId?.startHour || 'N/A'} - {booking.slotId?.endHour || 'N/A'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
                          <p className="font-medium text-green-600 dark:text-green-400">
                            ₹{booking.isPaymentReceived ? (booking.turfId?.priceBase || '0') : booking.paymentreceived}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Invalid Date'}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons Section - Only show for open bookings */}
                      {!booking.isPaymentReceived && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <button
                            onClick={() => handleCancelBookingClick(booking._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                            title="Cancel Booking"
                          >
                            <TrashIcon className="w-4 h-4" />
                            Cancel Booking
                          </button>
                          
                          <button
                            onClick={() => handleCloseBooking(booking._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                            title="Close Booking"
                          >
                            <XMarkIcon className="w-4 h-4" />
                            Close Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

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
              No {activeTab} bookings
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'open' 
                ? "No open bookings found. New bookings will appear here."
                : "No closed bookings found. Completed bookings will appear here."
              }
            </p>
          </motion.div>
        )}

        {/* Cancellation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Cancel Booking
                </h3>
                <button
                  onClick={handleCloseCancelModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please provide a reason for cancelling this booking:
              </p>
              
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows={4}
                maxLength={500}
              />
              
              <div className="text-right text-sm text-gray-500 dark:text-gray-400 mb-4">
                {cancellationReason.length}/500 characters
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCloseCancelModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  disabled={submittingCancel}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitCancellation}
                  disabled={submittingCancel || !cancellationReason.trim()}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  {submittingCancel ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Cancelling...
                    </>
                  ) : (
                    'Confirm Cancellation'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
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
