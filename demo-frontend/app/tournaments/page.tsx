'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trophy, Calendar, Users, MapPin, Clock, Star } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function TournamentsPage() {
  const tournaments = [
    {
      id: 1,
      name: "Mumbai Football Championship 2025",
      sport: "Football",
      date: "Jan 25-27, 2025",
      location: "Green Valley Turf, Mumbai",
      participants: 24,
      maxParticipants: 32,
      prize: "₹50,000",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop",
      status: "Accepting Registrations"
    },
    {
      id: 2,
      name: "Delhi Cricket League",
      sport: "Cricket",
      date: "Feb 10-15, 2025",
      location: "Champions Ground, Delhi",
      participants: 16,
      maxParticipants: 20,
      prize: "₹75,000",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=200&fit=crop",
      status: "Registration Closing Soon"
    }
  ];

  return (
    <DashboardLayout type="user">
      <div className="p-6">
        {/* Hero */}
        <div className="mb-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-6 text-blue-600" />
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Sports Tournaments
          </h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join exciting tournaments, compete with the best, and win amazing prizes!
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Host Your Tournament
          </button>
        </div>

        {/* Tournaments Grid */}
        <div>
          Under construction
        </div>
        </div>
    </DashboardLayout>
  );
}
