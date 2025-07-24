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
        <div className="grid lg:grid-cols-2 gap-8">
            {tournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={tournament.image}
                    alt={tournament.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {tournament.sport}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3">{tournament.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{tournament.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{tournament.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{tournament.participants}/{tournament.maxParticipants} participants</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Prize Pool</span>
                      <div className="text-2xl font-bold text-green-600">{tournament.prize}</div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Status</span>
                      <div className="text-sm font-medium text-blue-600">{tournament.status}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Register Now
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
