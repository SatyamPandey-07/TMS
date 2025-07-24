'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, Clock, CheckCircle, X, RefreshCw } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface Booking {
  _id: string;
  turfId: {
    name: string;
    location: string;
    pricebase?: string;
  };
  slotId: {
    date: string;
    startHour: string;
    endHour: string;
  };
  status: string;
  paymentreceived?: number;
  paymentremain?: number;
  isPaymentReceived: boolean; // Added this field
  createdAt?: string;
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open'); // Changed from 'upcoming' | 'past'
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/fetch-booking-user');
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on isPaymentReceived instead of date
  const openBookings = bookings.filter((booking) => {
    return !booking.isPaymentReceived;
  });

  const closedBookings = bookings.filter((booking) => {
    return booking.isPaymentReceived;
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

  const renderBookingCard = (booking: Booking, isClosed: boolean) => { // Changed from isPast
    const dateStr = new Date(booking.slotId.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    
    const timeStr = `${booking.slotId.startHour} - ${booking.slotId.endHour}`;
    
    // Show different amounts based on booking status
    const amount = isClosed 
      ? (booking.turfId.pricebase ? `₹${booking.turfId.pricebase}` : '—')
      : (booking.paymentreceived != null ? `₹${booking.paymentreceived}` : '—');

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
            {/* Added status badge for open/closed */}
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
            <>
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Book Again
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Write Review
              </button>
              <button className="bg-green-100 text-green-600 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors">
                Download Receipt
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleCancelBooking(booking._id)}
                className="bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
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

        {/* Tabs - Changed from Upcoming/Past to Open/Closed */}
        <div className="flex gap-1 bg-gray-200 rounded-lg p-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('open')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'open' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Open Bookings
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'closed' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Closed Bookings
          </button>
        </div>

        {/* Bookings Content */}
        {loading ? (
          <div className="text-center text-gray-500">Loading bookings...</div>
        ) : activeTab === 'open' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {openBookings.length > 0 ? (
              openBookings.map((booking) => renderBookingCard(booking, false))
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
              closedBookings.map((booking) => renderBookingCard(booking, true))
            ) : (
              <div className="text-center py-12 text-gray-500">No Closed Bookings</div>
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
