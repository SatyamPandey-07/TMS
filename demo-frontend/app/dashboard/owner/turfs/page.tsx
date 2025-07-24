'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type Turf = {
  _id: string;
  name: string;
  location: string;
  priceBase: number;
  imageUrl: string;
  openHour: number;
  closeHour: number;
  slotDuration: number;
  status: 'active' | 'inactive';
  totalBookings?: number;
  createdAt: string;
};

export default function MyTurfsPage() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await fetch('/api/fetch-turf');
        const data = await response.json();
        
        if (data.turfs) {
          setTurfs(data.turfs);
        }
      } catch (error) {
        console.error('Error fetching turfs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  const handleDeleteTurf = async (turfId: string) => {
  if (!confirm('Are you sure you want to delete this turf?')) return;

  try {
    const response = await fetch(`/api/delete-turf?id=${turfId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Failed to delete turf:', result.error);
      alert(result.error || 'Failed to delete turf.');
      return;
    }

    // Refresh list after deletion
    setTurfs(prev => prev.filter(turf => turf._id !== turfId));
  } catch (error) {
    console.error('Error deleting turf:', error);
    alert('Error deleting turf.');
  }
};

  if (loading) {
    return (
      <DashboardLayout type="owner">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              My Turfs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor all your turfs
            </p>
          </div>
          <Link href="/dashboard/owner/add-turf">
            <Button className="btn-girly dark:btn-manly sparkle dark:glow">
              <MapPinIcon className="w-4 h-4 mr-2" />
              Add New Turf
            </Button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="p-6 shadow-girly dark:shadow-manly theme-transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Turfs</p>
                <p className="text-2xl font-bold text-pink-600 dark:text-blue-400">{turfs.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 dark:from-blue-400 dark:to-red-400 rounded-full flex items-center justify-center">
                <MapPinIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly theme-transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Turfs</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {turfs.filter(t => t.status !== 'inactive').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 dark:from-green-400 dark:to-cyan-400 rounded-full flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly theme-transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Price</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  ₹{turfs.length > 0 ? Math.round(turfs.reduce((sum, t) => sum + t.priceBase, 0) / turfs.length) : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 dark:from-yellow-400 dark:to-red-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">₹</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-girly dark:shadow-manly theme-transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {turfs.reduce((sum, t) => sum + (t.totalBookings || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-400 dark:to-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">#</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Turfs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {turfs.map((turf, index) => (
            <motion.div
              key={turf._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="overflow-hidden shadow-girly dark:shadow-manly hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 sparkle dark:glow">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={turf.imageUrl || '/placeholder-turf.jpg'}
                    alt={turf.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={`${turf.status === 'active' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {turf.status || 'active'}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-girly dark:text-manly">
                    {turf.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {turf.location}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Price:</span>
                      <span className="font-semibold text-pink-600 dark:text-blue-400 ml-2">₹{turf.priceBase}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400 ml-2">{turf.slotDuration}min</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Hours: {turf.openHour}:00 - {turf.closeHour}:00
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDeleteTurf(turf._id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {turfs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-400 dark:from-blue-400 dark:to-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPinIcon className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No turfs yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by adding your first turf to begin accepting bookings
            </p>
            <Link href="/dashboard/owner/add-turf">
              <Button className="btn-girly dark:btn-manly sparkle dark:glow">
                <MapPinIcon className="w-4 h-4 mr-2" />
                Add Your First Turf
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
