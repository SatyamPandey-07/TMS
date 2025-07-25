'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, Clock, CheckCircle, X, RefreshCw, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Error Boundary Component
class BookingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Booking card error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-bold">Error Loading Booking</h3>
              <p className="text-sm">Something went wrong with this booking card.</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface Booking {
  _id: string;
  turfId: {
    _id: string,
    name: string;
    location: string;
    pricebase?: string;
  } | null;
  slotId: {
    date: string;
    startHour: string;
    endHour: string;
  } | null;
  status: string;
  paymentreceived?: number;
  paymentremain?: number;
  isPaymentReceived: boolean;
  createdAt?: string;
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/fetch-booking-user');
        const data = await res.json();
        
        console.log('Raw booking data:', data.bookings);
        
        // Filter out bookings with invalid slot data
        const validBookings = (data.bookings || []).filter(booking => {
          const isValid = booking.slotId && 
                          booking.slotId.date && 
                          booking.turfId &&
                          booking.turfId.name;
          
          if (!isValid) {
            console.warn('Invalid booking filtered out:', booking._id, {
              hasSlotId: !!booking.slotId,
              hasDate: booking.slotId?.date,
              hasTurfId: !!booking.turfId,
              hasTurfName: booking.turfId?.name
            });
          }
          
          return isValid;
        });
        
        console.log(`Filtered ${data.bookings?.length || 0} bookings to ${validBookings.length} valid bookings`);
        setBookings(validBookings);
        
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on isPaymentReceived with additional safety checks
  const openBookings = bookings.filter((booking) => {
    return booking.slotId && booking.turfId && !booking.isPaymentReceived;
  });

  const closedBookings = bookings.filter((booking) => {
    return booking.slotId && booking.turfId && booking.isPaymentReceived;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/cancel-booking-user/${bookingId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
        alert('Booking cancelled successfully');
      } else {
        alert(data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while cancelling booking.');
    }
  };

  const handleBookAgain = async (bookingId: string) => {
    const booking = bookings.find(b => b._id === bookingId);

    if (!booking || !booking.turfId) {
      console.error('Booking or turf not found');
      alert('Unable to book again - booking information is incomplete');
      return;
    }
    
    const turfId = booking.turfId._id;
    router.push(`/dashboard/user/turfs/${turfId}`);
  };

  const renderBookingCard = (booking: Booking, isClosed: boolean) => {
    // Safety checks - this should not happen due to filtering, but extra safety
    if (!booking.slotId || !booking.slotId.date || !booking.turfId) {
      return (
        <div key={booking._id} className="bg-yellow-50 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center gap-3 text-yellow-700">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h3 className="text-xl font-bold mb-2">
                {booking.turfId?.name || 'Unknown Turf'}
              </h3>
              <p className="text-sm">Incomplete booking data - Missing slot or turf information</p>
              <div className="mt-3">
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Safe date parsing with fallback
    let dateStr = 'Invalid Date';
    try {
      const date = new Date(booking.slotId.date);
      if (!isNaN(date.getTime())) {
        dateStr = date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch (error) {
      console.error('Date parsing error for booking:', booking._id, error);
    }
    
    const timeStr = `${booking.slotId.startHour || 'N/A'} - ${booking.slotId.endHour || 'N/A'}`;
    
    // Show different amounts based on booking status
    const amount = isClosed 
      ? (booking.turfId.pricebase ? `₹${booking.turfId.pricebase}` : '—')
      : (booking.paymentreceived != null ? `₹${booking.paymentreceived}` : '—');

    return (
      <div key={booking._id} className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${isClosed ? 'border-gray-300' : 'border-blue-500'}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{booking.turfId.name}</h3>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{timeStr}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{booking.turfId.location}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-2xl font-bold ${isClosed ? 'text-gray-600' : 'text-green-600'} mb-2`}>{amount}</div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
            <div className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isClosed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {isClosed ? 'Closed' : 'Open'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {isClosed ? (
            <Button 
              onClick={() => handleBookAgain(booking._id)} 
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book Again
            </Button>
          ) : (
            <button
              onClick={() => handleCancelBooking(booking._id)}
              className="bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout type="user">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">My Bookings</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Manage all your turf reservations</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
              <button 
                onClick={() => window.location.reload()} 
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 rounded-lg p-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('open')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'open' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Open Bookings ({openBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'closed' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Closed Bookings ({closedBookings.length})
          </button>
        </div>

        {/* Bookings Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading bookings...</span>
          </div>
        ) : activeTab === 'open' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {openBookings.length > 0 ? (
              openBookings.map((booking) => (
                <BookingErrorBoundary key={booking._id}>
                  {renderBookingCard(booking, false)}
                </BookingErrorBoundary>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Open Bookings</h3>
                <p className="text-gray-500 mb-6">Ready to book your next game?</p>
                <Link href="/explore" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Explore Turfs
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {closedBookings.length > 0 ? (
              closedBookings.map((booking) => (
                <BookingErrorBoundary key={booking._id}>
                  {renderBookingCard(booking, true)}
                </BookingErrorBoundary>
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Closed Bookings</h3>
                <p className="text-gray-500">Your completed bookings will appear here</p>
              </div>
            )}
          </motion.div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready for Your Next Game?</h2>
          <p className="text-lg opacity-90 mb-6">Discover amazing turfs near you and book instantly</p>
          <div className="flex gap-4 justify-center">
            <Link href="/explore" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Explore Turfs
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
