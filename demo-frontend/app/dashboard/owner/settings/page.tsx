'use client';

import React, { useState, useEffect } from 'react';
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
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  KeyIcon,
  BanknotesIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface OwnerSettings {
  // Business Information
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  panNumber: string;
  
  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  bookingAlerts: boolean;
  paymentAlerts: boolean;
  reviewNotifications: boolean;
  
  // Business Settings
  autoAcceptBookings: boolean;
  allowCancellations: boolean;
  cancellationWindow: number; // hours
  requireAdvancePayment: boolean;
  advancePaymentPercentage: number;
  
  // Privacy & Security
  twoFactorAuth: boolean;
  businessListingVisible: boolean;
  showContactInfo: boolean;
  allowDirectMessages: boolean;
  
  // Financial Settings
  paymentMethods: {
    card: boolean;
    upi: boolean;
    netbanking: boolean;
    wallet: boolean;
  };
  taxSettings: {
    includeTax: boolean;
    taxPercentage: number;
  };
}

export default function OwnerSettingsPage() {
  const [settings, setSettings] = useState<OwnerSettings>({
    businessName: 'Elite Sports Management',
    ownerName: 'John Doe',
    email: 'john.doe@elitesports.com',
    phone: '+91 9876543210',
    address: 'Sector 15, Noida, Uttar Pradesh, 201301',
    gstin: '09ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    bookingAlerts: true,
    paymentAlerts: true,
    reviewNotifications: true,
    
    autoAcceptBookings: false,
    allowCancellations: true,
    cancellationWindow: 24,
    requireAdvancePayment: true,
    advancePaymentPercentage: 50,
    
    twoFactorAuth: false,
    businessListingVisible: true,
    showContactInfo: true,
    allowDirectMessages: true,
    
    paymentMethods: {
      card: true,
      upi: true,
      netbanking: true,
      wallet: false
    },
    taxSettings: {
      includeTax: true,
      taxPercentage: 18
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('business');
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSettingChange = (section: string, key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: typeof prev[section as keyof OwnerSettings] === 'object' && section !== 'businessName'
        ? { ...prev[section as keyof OwnerSettings] as Record<string, unknown>, [key]: value }
        : section === key ? value : { ...prev, [key]: value }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      // Show success message
    }, 1000);
  };

  const tabs = [
    { id: 'business', label: 'Business Info', icon: BuildingOfficeIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'booking', label: 'Booking Rules', icon: CalendarIcon },
    { id: 'payments', label: 'Payments', icon: CreditCardIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon }
  ];

  return (
    <DashboardLayout type="owner">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-girly dark:shadow-manly">
              <CogIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-manly">
                Business Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-girly">
                Manage your business preferences and configurations
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="sparkle dark:glow"
            >
              {isEditing ? 'Cancel' : 'Edit Settings'}
            </Button>
            {isEditing && (
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="sparkle dark:glow"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-2 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Business Information Tab */}
          {activeTab === 'business' && (
            <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-manly">
                  Business Information
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                >
                  {showSensitiveInfo ? <EyeSlashIcon className="w-4 h-4 mr-2" /> : <EyeIcon className="w-4 h-4 mr-2" />}
                  {showSensitiveInfo ? 'Hide' : 'Show'} Sensitive Data
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <BuildingOfficeIcon className="w-4 h-4" />
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) => handleSettingChange('', 'businessName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <UserIcon className="w-4 h-4" />
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={settings.ownerName}
                    onChange={(e) => handleSettingChange('', 'ownerName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <EnvelopeIcon className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('', 'email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <PhoneIcon className="w-4 h-4" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleSettingChange('', 'phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPinIcon className="w-4 h-4" />
                    Business Address
                  </label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => handleSettingChange('', 'address', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  />
                </div>

                {showSensitiveInfo && (
                  <>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <KeyIcon className="w-4 h-4" />
                        GSTIN
                      </label>
                      <input
                        type="text"
                        value={settings.gstin}
                        onChange={(e) => handleSettingChange('', 'gstin', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <KeyIcon className="w-4 h-4" />
                        PAN Number
                      </label>
                      <input
                        type="text"
                        value={settings.panNumber}
                        onChange={(e) => handleSettingChange('', 'panNumber', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 font-manly">
                Notification Preferences
              </h2>
              
              <div className="space-y-6">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Get text messages for important updates' },
                  { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser and app notifications' },
                  { key: 'bookingAlerts', label: 'Booking Alerts', description: 'Get notified when someone books your turf' },
                  { key: 'paymentAlerts', label: 'Payment Alerts', description: 'Notifications for payment received' },
                  { key: 'reviewNotifications', label: 'Review Notifications', description: 'Get notified about new reviews' }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {setting.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      checked={settings[setting.key as keyof OwnerSettings] as boolean}
                      onCheckedChange={(checked: boolean) => handleSettingChange('', setting.key, checked)}
                      disabled={!isEditing}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Booking Rules Tab */}
          {activeTab === 'booking' && (
            <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 font-manly">
                Booking Rules & Policies
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Auto-Accept Bookings
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Automatically accept all booking requests
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoAcceptBookings}
                    onCheckedChange={(checked: boolean) => handleSettingChange('', 'autoAcceptBookings', checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Allow Cancellations
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Let customers cancel their bookings
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowCancellations}
                    onCheckedChange={(checked: boolean) => handleSettingChange('', 'allowCancellations', checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="py-3 border-b border-gray-100 dark:border-gray-700">
                  <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                    Cancellation Window (Hours)
                  </label>
                  <input
                    type="number"
                    value={settings.cancellationWindow}
                    onChange={(e) => handleSettingChange('', 'cancellationWindow', parseInt(e.target.value))}
                    disabled={!isEditing || !settings.allowCancellations}
                    min="1"
                    max="168"
                    className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Hours before booking time when cancellation is allowed
                  </p>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Require Advance Payment
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Require partial payment at booking time
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireAdvancePayment}
                    onCheckedChange={(checked: boolean) => handleSettingChange('', 'requireAdvancePayment', checked)}
                    disabled={!isEditing}
                  />
                </div>

                {settings.requireAdvancePayment && (
                  <div className="py-3">
                    <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                      Advance Payment Percentage
                    </label>
                    <input
                      type="number"
                      value={settings.advancePaymentPercentage}
                      onChange={(e) => handleSettingChange('', 'advancePaymentPercentage', parseInt(e.target.value))}
                      disabled={!isEditing}
                      min="10"
                      max="100"
                      className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">%</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Payment Settings Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 font-manly">
                  Payment Methods
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(settings.paymentMethods).map(([method, enabled]) => (
                    <div key={method} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCardIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {method}
                        </span>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked: boolean) => handleSettingChange('paymentMethods', method, checked)}
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 font-manly">
                  Tax Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Include Tax in Pricing
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Show tax-inclusive prices to customers
                      </p>
                    </div>
                    <Switch
                      checked={settings.taxSettings.includeTax}
                      onCheckedChange={(checked: boolean) => handleSettingChange('taxSettings', 'includeTax', checked)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                      Tax Percentage
                    </label>
                    <input
                      type="number"
                      value={settings.taxSettings.taxPercentage}
                      onChange={(e) => handleSettingChange('taxSettings', 'taxPercentage', parseFloat(e.target.value))}
                      disabled={!isEditing}
                      min="0"
                      max="50"
                      step="0.1"
                      className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">%</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 font-manly">
                Security & Privacy
              </h2>
              
              <div className="space-y-6">
                {[
                  { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Add extra security to your account' },
                  { key: 'businessListingVisible', label: 'Business Listing Visible', description: 'Show your business in public listings' },
                  { key: 'showContactInfo', label: 'Show Contact Information', description: 'Display contact details to customers' },
                  { key: 'allowDirectMessages', label: 'Allow Direct Messages', description: 'Let customers send you direct messages' }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {setting.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      checked={settings[setting.key as keyof OwnerSettings] as boolean}
                      onCheckedChange={(checked: boolean) => handleSettingChange('', setting.key, checked)}
                      disabled={!isEditing}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
