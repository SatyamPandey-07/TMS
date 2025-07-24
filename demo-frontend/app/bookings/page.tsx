'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, Clock, CheckCircle, X, RefreshCw, Star, Download, Send } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import Chatbot from '@/components/Chatbot';
import ReviewModal from '@/components/ReviewModal';
import { useReview } from '@/hooks/useReview';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [reviewStatuses, setReviewStatuses] = useState<Record<string, any>>({});
  
  const { 
    checkReviewStatus
  } = useReview();

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
      _id: "668190a034c4c28e75c81780",
      turf: "Elite Sports Complex",
      turfId: "668190a034c4c28e75c81781",
      date: "Jul 20, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Powai, Mumbai",
      amount: "₹2,500",
      status: "completed"
    },
    {
      id: 4,
      _id: "668190a034c4c28e75c81782",
      turf: "Royal Tennis Courts",
      turfId: "668190a034c4c28e75c81783",
      date: "Jul 15, 2025",
      time: "5:00 PM - 6:00 PM",
      location: "Juhu, Mumbai",
      amount: "₹1,200",
      status: "completed"
    }
  ];

  // Load review statuses when component mounts or when past bookings are shown
  useEffect(() => {
    if (activeTab === 'past') {
      pastBookings.forEach(async (booking) => {
        try {
          const status = await checkReviewStatus(booking._id);
          setReviewStatuses(prev => ({
            ...prev,
            [booking._id]: status
          }));
        } catch (error) {
          // If API fails, just log error and continue - review button will still show
          console.error('Error checking review status:', error);
        }
      });
    }
  }, [activeTab]);

  const handleWriteReview = (booking: any) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handleDownloadReceipt = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/receipts/download?bookingId=${bookingId}`);
      if (!response.ok) throw new Error('Failed to download receipt');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  const handleResendReceipt = async (bookingId: string) => {
    try {
      const response = await fetch('/api/receipts/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });
      
      if (!response.ok) throw new Error('Failed to resend receipt');
      
      // Show success message (you can use a toast notification here)
      alert('Receipt sent to your email successfully!');
    } catch (error) {
      console.error('Error resending receipt:', error);
      alert('Failed to send receipt. Please try again.');
    }
  };

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
            {pastBookings.map((booking) => {
              const bookingReviewStatus = reviewStatuses[booking._id];
              const hasReview = bookingReviewStatus?.hasReview || false;

              return (
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
                      
                      {/* Show existing review if available */}
                      {hasReview && bookingReviewStatus.review && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium text-sm">Your Review:</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < bookingReviewStatus.review.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{bookingReviewStatus.review.comment}</p>
                        </div>
                      )}
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
                    
                    {/* Always show Write Review button for completed bookings */}
                    {booking.status === 'completed' && (
                      <>
                        {hasReview ? (
                          <button 
                            className="flex-1 bg-green-100 text-green-600 py-2 px-4 rounded-lg cursor-not-allowed opacity-75 flex items-center justify-center gap-2"
                            disabled
                            title="Review already submitted"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Review Submitted
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleWriteReview(booking)}
                            className="flex-1 bg-yellow-100 text-yellow-700 py-2 px-4 rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center gap-2"
                            title="Write a review for this booking"
                          >
                            <Star className="w-4 h-4" />
                            Write Review
                          </button>
                        )}
                      </>
                    )}
                    
                    {/* Receipt Actions */}
                    <button 
                      onClick={() => handleDownloadReceipt(booking._id)}
                      className="bg-green-100 text-green-600 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                      title="Download Receipt"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => handleResendReceipt(booking._id)}
                      className="bg-blue-100 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                      title="Resend Receipt"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
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

      {/* Review Modal */}
      {selectedBooking && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedBooking(null);
          }}
          booking={{
            id: selectedBooking._id,
            turf: selectedBooking.turf,
            date: selectedBooking.date,
            time: selectedBooking.time,
            location: selectedBooking.location
          }}
          onReviewSubmitted={async () => {
            // Refresh review status for this booking
            const updatedStatus = await checkReviewStatus(selectedBooking._id);
            setReviewStatuses(prev => ({
              ...prev,
              [selectedBooking._id]: updatedStatus
            }));
            setIsReviewModalOpen(false);
            setSelectedBooking(null);
          }}
        />
      )}

      {/* Chatbot */}
      <Chatbot />
    </DashboardLayout>
  );
}
