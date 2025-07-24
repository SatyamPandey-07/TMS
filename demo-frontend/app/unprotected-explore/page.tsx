'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Search,
  MapPin,
  Clock,
  Grid,
  List,
  SlidersHorizontal,
  Navigation
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// --------------------
// Types
// --------------------

interface Turf {
  _id: string
  name: string
  location: string
  imageUrl: string
  priceBase: number
  pinlocation: {
    lat: number
    lng: number
  }
  distanceInKm?: string
}

interface TurfAPIResponse {
  turfs: Turf[]
}

interface UserLocation {
  lat: number
  lng: number
}

// --------------------

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function ExplorePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [allTurfs, setAllTurfs] = useState<Turf[]>([])
  const [filteredTurfs, setFilteredTurfs] = useState<Turf[]>([])
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location', error)
        }
      )
    }
  }, [])

  useEffect(() => {
    async function fetchTurfs() {
      try {
        const res = await fetch('/api/all-turf')
        if (!res.ok) throw new Error('Failed to fetch')
        const data: TurfAPIResponse = await res.json()
        console.log(data);
      
        setAllTurfs(data.turfs)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTurfs()
  }, [])

  useEffect(() => {
    if (!allTurfs) return

    let results = allTurfs

    if (searchQuery) {
      results = results.filter(turf =>
        turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        turf.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Calculate distances for all turfs if user location is available
    if (userLocation) {
      results = results.map((turf) => {
        const lat = turf.pinlocation?.lat
        const lng = turf.pinlocation?.lng
        if (lat && lng) {
          const distance = getDistanceFromLatLonInKm(
            userLocation.lat,
            userLocation.lng,
            lat,
            lng
          )
          return { ...turf, distanceInKm: distance.toFixed(2) }
        }
        return turf
      })
    }

    // Apply distance filter only if selected
    if (distanceFilter && userLocation) {
      results = results.filter(turf => 
        turf.distanceInKm && parseFloat(turf.distanceInKm) <= distanceFilter
      )
    }

    setFilteredTurfs(results)
  }, [searchQuery, allTurfs, userLocation, distanceFilter])

  const handleDistanceFilter = (distance: number | null) => {
    setDistanceFilter(distance)
    setDropdownOpen(false)
  }

  const handleBookingClick = (turfId: string) => {
    if (session) {
      // User is logged in, redirect to booking page
      router.push(`/dashboard/user/turfs/${turfId}`)
    } else {
      // User is not logged in, redirect to login page
      router.push('/auth/signin')
    }
  }

  const handleLoginRedirect = () => {
    router.push('/auth/signin')
  }

  const handleDashboardRedirect = () => {
    if (session?.user?.role === 'owner') {
      router.push('/dashboard/owner')
    } else {
      router.push('/dashboard/user')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header/Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg"></div>
              <Link href="/">
              <span className="text-xl font-bold text-gray-900 dark:text-white">TurfBooking</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Welcome, {session.user?.name}
                  </span>
                  <Button onClick={handleDashboardRedirect} variant="outline" size="sm">
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button onClick={handleLoginRedirect} variant="outline" size="sm">
                    Sign In
                  </Button>
                
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Explore Turfs Near You
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover and book the perfect turf for your next game
          </p>
          {!session && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <Clock className="w-4 h-4 inline mr-2" />
                Sign in to book turfs and manage your reservations
              </p>
            </div>
          )}
        </motion.div>

        {/* Search & Filters */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-8">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search turfs by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading turfs...
          </div>
        ) : (
          <>
            {/* Result Count & Filters */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="flex items-center justify-between mb-6"
            >
              <p className="text-gray-600 dark:text-gray-300">
                Found {filteredTurfs.length} turfs
              </p>
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {distanceFilter ? `Within ${distanceFilter} km` : 'Distance Filter'}
                </Button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleDistanceFilter(null)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          distanceFilter === null 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        All Turfs
                      </button>
                      <button
                        onClick={() => handleDistanceFilter(10)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          distanceFilter === 10 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Within 10 km
                      </button>
                      <button
                        onClick={() => handleDistanceFilter(20)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          distanceFilter === 20 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Within 20 km
                      </button>
                      <button
                        onClick={() => handleDistanceFilter(50)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          distanceFilter === 50 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Within 50 km
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Turfs List */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
              }
            >
              {filteredTurfs.map((turf) => (
                <motion.div
                  key={turf._id}
                  variants={fadeInUp}
                  className={`group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-80' : ''}`}>
                    <img
                      src={turf.imageUrl}
                      alt={turf.name}
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                        viewMode === 'list' ? 'w-full h-full' : 'w-full h-64'
                      }`}
                    />
                    {!session && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          Login to Book
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                      {turf.name}
                    </h3>

                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{turf.location}</span>
                      <span className="mx-2">•</span>
                      <Navigation className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {turf.distanceInKm ? `${turf.distanceInKm} km` : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div>
                        <span className="text-2xl font-bold text-green-600">₹{turf.priceBase}</span>
                        <span className="text-gray-500 text-sm">/hour</span>
                      </div>
                      <Button 
                        variant="gradient" 
                        className="group"
                        onClick={() => handleBookingClick(turf._id)}
                      >
                        {session ? 'Book Now' : 'Sign In to Book'}
                        <Clock className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredTurfs.length === 0 && !loading && (
              <motion.div
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🏟️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No turfs found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Try adjusting your search criteria or distance filter
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('')
                    setDistanceFilter(null)
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}

            {/* Click outside to close dropdown */}
            {dropdownOpen && (
              <div 
                className="fixed inset-0 z-0" 
                onClick={() => setDropdownOpen(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
