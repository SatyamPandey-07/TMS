'use client'

import { ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from './Navbar'

interface DashboardLayoutProps {
  children: ReactNode
  type: 'user' | 'owner'
}

export default function DashboardLayout({ children, type }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <Sidebar type={type} />
      
      <main className="ml-72 min-h-screen transition-all duration-200">
        <Navbar showAuthButtons={false} />
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
