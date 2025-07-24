'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { 
  Home, 
  Search, 
  Calendar, 
  User, 
  Trophy, 
  Settings, 
  LogOut,
  Plus,
  BarChart3,
  Clock,
  Users,
  MapPin,
  Star,
  CreditCard,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle'

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  badge?: string
}

interface SidebarProps {
  type: 'user' | 'owner'
}

const userMenuItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Explore Turfs', href: '/explore', icon: Search },
  { name: 'My Bookings', href: '/bookings', icon: Calendar },
  { name: 'Tournaments', href: '/tournaments', icon: Trophy },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Notifications', href: '/notifications', icon: Bell, badge: '3' },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const ownerMenuItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard/owner', icon: Home },
  { name: 'My Turfs', href: '/dashboard/owner/turfs', icon: MapPin },
  { name: 'Add New Turf', href: '/dashboard/owner/add-turf', icon: Plus },
  { name: 'Manage Slots', href: '/dashboard/owner/slots', icon: Clock },
  { name: 'Bookings', href: '/dashboard/owner/bookings', icon: Calendar },
  { name: 'Analytics', href: '/dashboard/owner/analytics', icon: BarChart3 },
  { name: 'Reviews', href: '/dashboard/owner/reviews', icon: Star },
  { name: 'Payments', href: '/dashboard/owner/payments', icon: CreditCard },
  { name: 'Customers', href: '/dashboard/owner/customers', icon: Users },
  { name: 'Settings', href: '/dashboard/owner/settings', icon: Settings },
]

export default function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname()
  const menuItems = type === 'user' ? userMenuItems : ownerMenuItems

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl z-30 transition-colors duration-200"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">TurfMaster</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{type} Panel</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`} />
                    <span className="font-medium flex-1">{item.name}</span>
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </motion.div>
  )
}
