'use client'

import { ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

interface DashboardLayoutProps {
  children: ReactNode
  type: 'user' | 'owner'
}

export default function DashboardLayout({ children, type }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar showAuthButtons={false} />
      <Sidebar type={type} />
      <main className="ml-72 min-h-screen pt-16">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
