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
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-green-400 to-blue-500 text-white">
                      {userInfo.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 shadow-lg"
                  >
                    <CameraIcon className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="mt-4 text-center lg:text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <FireIcon className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Member since {stats.joinDate}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {stats.achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="p-6 text-center shadow-girly dark:shadow-manly sparkle dark:glow">
            <TrophyIcon className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.gamesPlayed}</h3>
            <p className="text-gray-600 dark:text-gray-400">Games Played</p>
          </Card>

          <Card className="p-6 text-center shadow-girly dark:shadow-manly sparkle dark:glow">
            <CalendarIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</h3>
            <p className="text-gray-600 dark:text-gray-400">Total Bookings</p>
          </Card>

          <Card className="p-6 text-center shadow-girly dark:shadow-manly sparkle dark:glow">
            <span className="text-2xl font-bold text-green-500 block mb-1">₹</span>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSpent.toLocaleString()}</h3>
            <p className="text-gray-600 dark:text-gray-400">Total Spent</p>
          </Card>

          <Card className="p-6 text-center shadow-girly dark:shadow-manly sparkle dark:glow">
            <MapPinIcon className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{stats.favoriteSpot}</h3>
            <p className="text-gray-600 dark:text-gray-400">Favorite Spot</p>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 font-manly">
              Recent Activity
            </h2>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {activity.date}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
