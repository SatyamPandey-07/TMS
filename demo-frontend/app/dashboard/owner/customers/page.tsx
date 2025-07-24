'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, PhoneIcon, CalendarIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockCustomers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    totalBookings: 15,
    totalSpent: 12500,
    lastBooking: '2024-01-20',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=random'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 87654 32109',
    totalBookings: 22,
    totalSpent: 18900,
    lastBooking: '2024-01-19',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=random'
  },
  {
    id: 3,
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    phone: '+91 76543 21098',
    totalBookings: 8,
    totalSpent: 6400,
    lastBooking: '2024-01-15',
    status: 'inactive',
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Singh&background=random'
  }
];

export default function CustomersPage() {
  return (
    <DashboardLayout type="owner">
      <div>
        Under Construction
      </div>
    </DashboardLayout>
  );
}
