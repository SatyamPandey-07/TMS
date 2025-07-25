'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CogIcon, 
  UserIcon, 
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  GlobeAltIcon,
  EyeIcon,
  EyeSlashIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingReminders: true,
    promotionalEmails: false,
    twoFactorAuth: false,
    profileVisibility: 'public',
    autoBookingConfirm: true,
    darkMode: false,
    language: 'english'
  });

  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const settingSections = [
    {
      id: 'notifications',
      title: 'Notification Preferences',
      icon: <BellIcon className="w-6 h-6 text-blue-500" />,
      settings: [
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive booking confirmations and updates via email',
          type: 'toggle'
        },
        {
          key: 'smsNotifications',
          label: 'SMS Notifications',
          description: 'Get text messages for important updates',
          type: 'toggle'
        },
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive browser notifications',
          type: 'toggle'
        },
        {
          key: 'bookingReminders',
          label: 'Booking Reminders',
          description: 'Get reminded about upcoming bookings',
          type: 'toggle'
        },
        {
          key: 'promotionalEmails',
          label: 'Promotional Emails',
          description: 'Receive offers and promotional content',
          type: 'toggle'
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <ShieldCheckIcon className="w-6 h-6 text-green-500" />,
      settings: [
        {
          key: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'toggle'
        },
        {
          key: 'profileVisibility',
          label: 'Profile Visibility',
          description: 'Control who can see your profile information',
          type: 'select',
          options: [
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
            { value: 'friends', label: 'Friends Only' }
          ]
        }
      ]
    },
    {
      id: 'preferences',
      title: 'App Preferences',
      icon: <CogIcon className="w-6 h-6 text-purple-500" />,
      settings: [
        {
          key: 'autoBookingConfirm',
          label: 'Auto-confirm Bookings',
          description: 'Automatically confirm bookings when payment is successful',
          type: 'toggle'
        },
        {
          key: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          options: [
            { value: 'english', label: 'English' },
            { value: 'hindi', label: 'हिंदी' },
            { value: 'marathi', label: 'मराठी' }
          ]
        }
      ]
    }
  ];

  return (
    <DashboardLayout type="user">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-girly dark:shadow-manly">
            <CogIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-manly">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-girly">
              Customize your TurfMaster experience
            </p>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <UserIcon className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-manly">
                  Personal Information
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPersonalInfo(!showPersonalInfo)}
                className="sparkle dark:glow"
              >
                {showPersonalInfo ? <EyeSlashIcon className="w-4 h-4 mr-2" /> : <EyeIcon className="w-4 h-4 mr-2" />}
                {showPersonalInfo ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {showPersonalInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue="+91 9876543210"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    defaultValue="Mumbai, Maharashtra"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIndex * 0.1 }}
          >
            <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
              <div className="flex items-center gap-3 mb-6">
                {section.icon}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-manly">
                  {section.title}
                </h2>
              </div>
              
              <div className="space-y-4">
                {section.settings.map((setting, index) => (
                  <motion.div
                    key={setting.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {setting.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {setting.description}
                      </p>
                    </div>
                    
                    <div className="ml-4">
                      {setting.type === 'toggle' ? (
                        <Switch
                          checked={settings[setting.key as keyof typeof settings] as boolean}
                          onCheckedChange={(checked: boolean) => handleSettingChange(setting.key, checked)}
                        />
                      ) : setting.type === 'select' ? (
                        <select
                          value={settings[setting.key as keyof typeof settings] as string}
                          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
                        >
                          {setting.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Save Changes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end gap-4"
        >
          <Button variant="outline">
            Reset to Default
          </Button>
          <Button className="sparkle dark:glow">
            Save Changes
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
