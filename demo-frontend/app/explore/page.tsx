'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Filter, 
  Grid, 
  List,
  SlidersHorizontal,
  Heart,
  Navigation,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

// Mock data for turfs
const mockTurfs = [
  {
    id: 1,
    name: "Green Valley Football Ground",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600",
    rating: 4.8,
    reviews: 124,
    price: 1200,
    location: "Sector 15, Noida",
    distance: "2.3 km",
    sports: ["Football", "Cricket"],
    amenities: ["Parking", "Changing Room", "Refreshments", "Floodlights"],
    availability: "Available",
    isPopular: true
  },
  {
    id: 2,
    name: "Elite Sports Complex",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600",
    rating: 4.9,
    reviews: 89,
    price: 1500,
    location: "Golf Course Road, Gurgaon",
    distance: "4.1 km", 
    sports: ["Football", "Basketball", "Tennis"],
    amenities: ["Premium Locker", "Cafe", "Parking", "AC Waiting Area"],
    availability: "Available",
    isPopular: false
  },
  {
    id: 3,
    name: "Urban Sports Arena",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600",
    rating: 4.6,
    reviews: 67,
    price: 1000,
    location: "Connaught Place, Delhi",
    distance: "1.8 km",
    sports: ["Cricket", "Badminton"],
    amenities: ["Equipment Rental", "Parking", "Washroom"],
    availability: "Booking Fast",
    isPopular: false
  },
  {
    id: 4,
    name: "Champions League Ground",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600",
    rating: 4.7,
    reviews: 156,
    price: 1800,
    location: "Cyber City, Gurgaon",
    distance: "5.2 km",
    sports: ["Football"],
    amenities: ["Professional Pitch", "Live Streaming", "Premium Facilities"],
    availability: "Available",
    isPopular: true
  }
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [filteredTurfs, setFilteredTurfs] = useState(mockTurfs)
  const [selectedSport, setSelectedSport] = useState('All')

  const allSports = ['All', 'Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton']

  useEffect(() => {
    let results = mockTurfs

    // Filter by search query
    if (searchQuery) {
      results = results.filter(turf =>
        turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        turf.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by sport
    if (selectedSport !== 'All') {
      results = results.filter(turf => turf.sports.includes(selectedSport))
    }

    setFilteredTurfs(results)
  }, [searchQuery, selectedSport])

  return (
    <DashboardLayout type="user">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Explore Turfs Near You
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover and book the perfect turf for your next game
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-8"
        >
                    <Card className="p-6 bg-white/95 dark:bg-gray-800/95">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search turfs by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sport Filter */}
              <div className="flex gap-2 flex-wrap">
                {allSports.map((sport) => (
                  <Button
                    key={sport}
                    variant={selectedSport === sport ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSport(sport)}
                    className={selectedSport === sport ? "bg-gradient-to-r from-green-500 to-blue-500" : ""}
                  >
                    {sport}
                  </Button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results Header */}
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

        {/* Turfs Grid/List */}
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
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
          }
        >
          {filteredTurfs.map((turf) => (
            <motion.div
              key={turf.id}
              variants={fadeInUp}
              className={`group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-80' : ''}`}>
                <img
                  src={turf.image}
                  alt={turf.name}
                  className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                    viewMode === 'list' ? 'w-full h-full' : 'w-full h-64'
                  }`}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {turf.isPopular && (
                    <Badge variant="secondary" className="bg-orange-500 text-white">
                      <Zap className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <Badge 
                    variant={turf.availability === 'Available' ? 'success' : 'warning'}
                    className="bg-white/90 text-gray-800"
                  >
                    {turf.availability}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{turf.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({turf.reviews} reviews)</span>
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                  {turf.name}
                </h3>

                {/* Location */}
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{turf.location}</span>
                  <span className="mx-2">•</span>
                  <Navigation className="w-4 h-4 mr-1" />
                  <span className="text-sm">{turf.distance}</span>
                </div>

                {/* Sports */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {turf.sports.map((sport, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {sport}
                    </Badge>
                  ))}
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {turf.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700">
                      {amenity}
                    </Badge>
                  ))}
                  {turf.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700">
                      +{turf.amenities.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Price and Book Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div>
                    <span className="text-2xl font-bold text-green-600">₹{turf.price}</span>
                    <span className="text-gray-500 text-sm">/hour</span>
                  </div>
                  <Link href={`/dashboard/user/turfs/${turf.id}`}>
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

        {/* No Results */}
        {filteredTurfs.length === 0 && (
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
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedSport('All')
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
