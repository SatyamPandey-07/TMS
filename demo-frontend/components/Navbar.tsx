'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { useSession, signOut } from 'next-auth/react'
import { 
  User, 
  LogOut, 
  Settings, 
  Bell,
  ChevronDown
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface NavbarProps {
  showAuthButtons?: boolean
  className?: string
}

export default function Navbar({ showAuthButtons = true, className = '' }: NavbarProps) {
  const { data: session } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  // Check if user is admin
  const isAdmin = session?.user?.role?.toLowerCase() === 'admin'

  return (
    <header className={`bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">TurfChalo</h1>
          </Link>
          
          {/* Navigation Links */}
          

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
           
            
            {session ? (
              <div className="relative">
                {/* Notifications */}
                

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {session.user?.role || 'User'}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                    >
                      {/* Profile Link - Only show if user is NOT admin */}
                      {!isAdmin && (
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                      )}
                      
                      {/* Uncomment if you want to add settings */}
                      {/* <Link
                        href="/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link> */}
                      
                      {/* Only show divider if Profile link is visible */}
                      {!isAdmin && <hr className="my-1 border-gray-200 dark:border-gray-600" />}
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              showAuthButtons && (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white">
                      Get Started
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Optional for future enhancement */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95">
        <nav className="px-4 py-2 space-y-1">
          <Link href="/explore" className="block px-3 py-2 text-gray-600 dark:text-gray-300">
            Explore
          </Link>
          <Link href="/tournaments" className="block px-3 py-2 text-gray-600 dark:text-gray-300">
            Tournaments
          </Link>
          <Link href="/bookings" className="block px-3 py-2 text-gray-600 dark:text-gray-300">
            Bookings
          </Link>
          {session && (
            <Link href="/dashboard" className="block px-3 py-2 text-gray-600 dark:text-gray-300">
              Dashboard
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
