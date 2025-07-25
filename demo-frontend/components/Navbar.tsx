'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle'

import { useSession, signOut } from 'next-auth/react'
import { 
  User, 
  LogOut, 
  Settings, 
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

  return (
    <header className={`bg-background/90 backdrop-blur-sm border-b border-border sticky top-0 z-50 transition-colors duration-500 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">TurfChale</h1>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors duration-500">
              Explore
            </Link>
            <Link href="/tournaments" className="text-muted-foreground hover:text-primary transition-colors duration-500">
              Tournaments
            </Link>
            <Link href="/bookings" className="text-muted-foreground hover:text-primary transition-colors duration-500">
              Bookings
            </Link>
            {session && (
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors duration-500">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {session ? (
              <div className="relative">
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors duration-500"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        {session?.user?.name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {session?.user?.role || 'User'}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-1 transition-colors duration-500"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-card-foreground hover:bg-muted transition-colors duration-500"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-card-foreground hover:bg-muted transition-colors duration-500"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      
                      <hr className="my-1 border-border" />
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 px-4 py-2 text-destructive hover:bg-destructive/10 w-full text-left transition-colors duration-500"
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
    </header>
  )
}