'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  CameraIcon,
  PencilIcon,
  TrophyIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  FireIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';

interface UserStats {
  totalBookings: number;
  gamesPlayed: number;
  totalSpent: number;
  favoriteSpot: string;
  joinDate: string;
  achievements: string[];
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'game' | 'review';
  title: string;
  description: string;
  date: string;
  turf: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '/api/placeholder/150/150'
  });

  const [stats, setStats] = useState<UserStats>({
    totalBookings: 0,
    gamesPlayed: 0,
    totalSpent: 0,
    favoriteSpot: '',
    joinDate: '',
    achievements: []
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  // Load user info from session first, then fetch additional data
  useEffect(() => {
    if (status === 'loading') return; // Still loading session
    
    if (session?.user) {
      // Set user info from session immediately
      setUserInfo({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '', // Will be fetched from API
        avatar: '/api/placeholder/150/150'
      });
    }
  }, [session, status]);

  // Fetch user profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          
          // Update user info with data from API, but keep session data as primary source
          setUserInfo(prev => ({
            ...prev,
            name: session.user.name || prev.name,
            email: session.user.email || prev.email,
            phone: data.user.phone || prev.phone,
            avatar: '/api/placeholder/150/150'
          }));
          
          setStats(data.stats);
          setRecentActivities(data.recentActivities);
        } else {
          console.error('Failed to fetch profile data');
          // If API fails, still show session data
          setUserInfo(prev => ({
            ...prev,
            name: session.user.name || prev.name,
            email: session.user.email || prev.email,
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // If API fails, still show session data
        setUserInfo(prev => ({
          ...prev,
          name: session.user.name || prev.name,
          email: session.user.email || prev.email,
        }));
      } finally {
        setLoading(false);
      }
    };

    if (session?.user && status === 'authenticated') {
      fetchProfile();
    }
  }, [session, status]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CalendarIcon className="w-5 h-5 text-blue-500" />;
      case 'game':
        return <TrophyIcon className="w-5 h-5 text-green-500" />;
      case 'review':
        return <StarIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleSave = async () => {
    if (!userInfo.name.trim()) {
      alert('Name is required');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userInfo.name.trim(),
          phone: userInfo.phone.trim()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(prev => ({
          ...prev,
          name: data.user.name,
          phone: data.user.phone
        }));
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout type="user">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return (
      <DashboardLayout type="user">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="user">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-girly dark:shadow-manly">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-manly">
              My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-girly">
              Manage your account information and preferences
            </p>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative">
              
                </div>
                
                <div className="mt-4 text-center lg:text-left">
                  
                
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-manly">
                    Profile Information
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="sparkle dark:glow"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : isEditing ? (
                      'Save Changes'
                    ) : (
                      <>
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <UserIcon className="w-4 h-4" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userInfo.name}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium">{userInfo.name || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <EnvelopeIcon className="w-4 h-4" />
                        Email
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">{userInfo.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <PhoneIcon className="w-4 h-4" />
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={userInfo.phone}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium">{userInfo.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
        </motion.div>
      </div>
    </DashboardLayout>
  );
}