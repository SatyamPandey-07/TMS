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
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

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
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [allTurfs, setAllTurfs] = useState<Turf[]>([])
  const [filteredTurfs, setFilteredTurfs] = useState<Turf[]>([])
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

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

    if (userLocation) {
      results = results
        .map((turf) => {
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
        .filter(turf => turf.distanceInKm && parseFloat(turf.distanceInKm) <= 10)
    }

    setFilteredTurfs(results)
  }, [searchQuery, allTurfs, userLocation])

  return (
    <DashboardLayout type="user">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Explore Turfs Near You
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover and book the perfect turf for your next game
          </p>
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
          <div className="text-center py-16 text-gray-500">Loading turfs...</div>
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
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                More Filters
              </Button>
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
                      <Link href={`/dashboard/user/turfs/${turf._id}`}>
                        <Button variant="gradient" className="group">
                          Book Now
                          <Clock className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
