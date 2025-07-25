'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Trophy,
  Search,
  ArrowRight,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

type Booking = {
  _id: string;
  turfId: {
    _id: string;
    name: string;
    location: string;
  };
  slotId: {
    date: string;
    startHour: string;
    endHour: string;
  };
  paymentreceived: string;
  status: string;
  createdAt: string;
}

type Turf = {
  _id: string;
  name: string;
  location: string;
  price: number;
  sport: string;
  rating?: number;
  image?: string;
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [turfs, setTurfs] = useState<Turf[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    totalSpent: 0
  })

  useEffect(() => {
    if (!session?.user) return

    const fetchData = async () => {
      try {
        setLoading(true)

        const bookingRes = await fetch('/api/fetch-booking-user')
        const bookingData = await bookingRes.json()
        console.log('Bookings:', bookingData)

        if (bookingData?.bookings?.length) {
          setBookings(bookingData.bookings)

          const totalSpent = bookingData.bookings.reduce(
            (sum: number, booking: Booking) =>
              sum + parseFloat(booking.paymentreceived || '0'),
            0
          )

          setStats({
            gamesPlayed: bookingData.bookings.length,
            totalSpent
          })
        }

        const turfRes = await fetch('/api/all-turf')
        const turfData = await turfRes.json()
        console.log('Turfs:', turfData)

        if (turfData?.turfs?.length) {
          setTurfs(turfData.turfs.slice(0, 4))
        }

      } catch (error) {
        console.error('Dashboard error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  const today = new Date()
  const upcomingBookings = bookings.filter(booking =>
  booking.slotId && booking.slotId.date && new Date(booking.slotId.date) >= today
).slice(0, 3)


  const recentActivity = bookings
  .filter(booking => booking.slotId && booking.slotId.date) // Add filter first
  .sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  .slice(0, 5)
  .map(booking => ({
    id: booking._id,
    message: `Booked ${booking.turfId?.name || 'Turf'} for ${new Date(booking.slotId.date).toLocaleDateString()}`,
    time: new Date(booking.createdAt).toLocaleDateString()
  }))


  if (loading) {
    return (
      <DashboardLayout type="user">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout type="user">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >

        {/* Welcome Section */}
        <motion.div variants={fadeInUp} className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white p-8 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {session?.user?.name || 'Player'}! 👋</h1>
              <p className="text-lg opacity-90">Ready for your next game?</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
                <div className="text-sm opacity-75">Games Played</div>
              </div>
              
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Mobile */}
        <motion.div variants={fadeInUp} className="md:hidden grid grid-cols-2 gap-4">
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.gamesPlayed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Games Played</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">₹{stats.totalSpent}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Upcoming Bookings */}
            <motion.div variants={fadeInUp}>
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Upcoming Bookings
                    </h2>
                    <Link href="/bookings">
                      <Button variant="outline" size="sm">
                        View All
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No upcoming bookings</p>
                        <Link href="/explore">
                          <Button>Book a Turf</Button>
                        </Link>
                      </div>
                    ) : (
                      upcomingBookings.map(booking => (
                        <div key={booking._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{booking.turfId.name}</h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(booking.slotId.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {booking.slotId.startHour} - {booking.slotId.endHour}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {booking.turfId.location}
                                </div>
                              </div>
                            </div>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recommended Turfs */}
            <motion.div variants={fadeInUp}>
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Recommended Turfs
                    </h2>
                    <Link href="/explore">
                      <Button variant="outline" size="sm">
                        Explore All
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {turfs.length === 0 ? (
                      <div className="col-span-2 text-center py-8">
                        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No turfs available</p>
                      </div>
                    ) : (
                      turfs.map((turf) => (
                        <div key={turf._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow">
                          <div className="aspect-video bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mb-3 flex items-center justify-center">
                             <img
                                src={turf.imageUrl}
                                alt={turf.name}
                                className={`object-cover group-hover:scale-105 transition-transform duration-300`}
                              />
                          </div>
                          <h3 className="font-semibold mb-1">{turf.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <MapPin className="w-4 h-4" />
                            {turf.location}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-green-600">₹{turf.priceBase}</div>
                          </div>
                          <Link href={`/dashboard/user/turfs/${turf._id}`}>
                            <Button className="w-full mt-3" size="sm">
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div variants={fadeInUp}>
              <Card>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                  <Link href="/explore">
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="w-4 h-4 mr-2" />
                      Find Turfs
                    </Button>
                  </Link>
                  <Link href="/bookings">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      My Bookings
                    </Button>
                  </Link>
                  <Link href="/tournaments">
                    <Button variant="outline" className="w-full justify-start">
                      <Trophy className="w-4 h-4 mr-2" />
                      Tournaments
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={fadeInUp}>
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {recentActivity.length === 0 ? (
                      <p className="text-gray-500 text-sm">No recent activity</p>
                    ) : (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="flex gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
