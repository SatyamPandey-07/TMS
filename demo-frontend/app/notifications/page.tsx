'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BellIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'reminder' | 'promotion';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your booking for Elite Sports Arena on Dec 25, 2024 has been confirmed.',
      time: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Successful',
      message: 'Payment of ₹1,500 has been processed successfully for your booking.',
      time: '3 hours ago',
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Upcoming Game',
      message: 'You have a game scheduled tomorrow at 6:00 PM. Don\'t forget!',
      time: '1 day ago',
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'promotion',
      title: 'Weekend Special Offer',
      message: 'Get 20% off on weekend bookings. Use code WEEKEND20.',
      time: '2 days ago',
      read: true,
      priority: 'low'
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CalendarIcon className="w-6 h-6 text-green-500" />;
      case 'payment':
        return <CheckCircleIcon className="w-6 h-6 text-blue-500" />;
      case 'reminder':
        return <ClockIcon className="w-6 h-6 text-orange-500" />;
      case 'promotion':
        return <InformationCircleIcon className="w-6 h-6 text-purple-500" />;
      default:
        return <BellIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Low</Badge>;
      default:
        return null;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout type="user">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-girly dark:shadow-manly">
              <BellIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-manly">
                Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-girly">
                Stay updated with your latest activities
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button 
              onClick={markAllAsRead}
              className="sparkle dark:glow"
            >
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-6 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                !notification.read 
                  ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-girly dark:shadow-manly sparkle dark:glow' 
                  : 'hover:shadow-girly dark:hover:shadow-manly'
              }`}
              onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-manly">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 font-girly">
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(notification.priority)}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <BellIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              You&apos;ll see your latest updates and announcements here
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
