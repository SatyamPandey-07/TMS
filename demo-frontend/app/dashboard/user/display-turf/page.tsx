'use client';
import { useEffect, useState, useMemo } from 'react';
import { Search, MapPin, Filter, Star, Clock, Navigation } from 'lucide-react';

interface Turf {
  _id: string;
  name: string;
  location: string;
  ownerId: string;
  priceBase: number;
  openHour: number;
  closeHour: number;
  lunchBreak: {
    from: number;
    to: number;
  };
  pinlocation: {
    lat: number;
    lng: number;
  };
  slotDuration: number;
  advamt: number;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
  rating?: number; // Optional field for display
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function AllTurfsPage() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(50); // km
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');

  useEffect(() => {
    fetch('/api/all-turf')
      .then((res) => res.json())
      .then(data => setTurfs(data.turfs));
  }, []);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's current location
  const getUserLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsGettingLocation(false);
          setShowNearbyOnly(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          alert('Unable to get your location. Please enable location services.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsGettingLocation(false);
    }
  };

  // Filter and sort turfs
  const filteredAndSortedTurfs = useMemo(() => {
    let filtered = turfs.filter(turf =>
      turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turf.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply nearby filter
    if (showNearbyOnly && userLocation) {
      filtered = filtered.filter(turf => {
        if (!turf.pinlocation?.lat || !turf.pinlocation?.lng) return false;
        const distance = calculateDistance(
          userLocation.latitude, 
          userLocation.longitude, 
          turf.pinlocation.lat, 
          turf.pinlocation.lng
        );
        return distance <= maxDistance;
      });
    }

    // Add distance to turfs for sorting
    const turfsWithDistance = filtered.map(turf => ({
      ...turf,
      distance: userLocation && turf.pinlocation?.lat && turf.pinlocation?.lng
        ? calculateDistance(userLocation.latitude, userLocation.longitude, turf.pinlocation.lat, turf.pinlocation.lng)
        : null
    }));

    // Sort turfs
    turfsWithDistance.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          if (!a.distance && !b.distance) return 0;
          if (!a.distance) return 1;
          if (!b.distance) return -1;
          return a.distance - b.distance;
        case 'price':
          return a.priceBase - b.priceBase;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return turfsWithDistance;
  }, [turfs, searchTerm, showNearbyOnly, userLocation, maxDistance, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Perfect Turf</h1>
          <p className="text-gray-600">Discover and book premium sports turfs near you</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by turf name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Location Button */}
            <button
              onClick={getUserLocation}
              disabled={isGettingLocation}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Navigation className="w-5 h-5" />
              {isGettingLocation ? 'Getting Location...' : 'Find Nearby'}
            </button>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">Filters</span>
            </div>
          </div>

          {/* Advanced Filters */}
          {userLocation && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="nearby"
                    checked={showNearbyOnly}
                    onChange={(e) => setShowNearbyOnly(e.target.checked)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="nearby" className="text-sm text-gray-700">
                    Show nearby only
                  </label>
                </div>

                {showNearbyOnly && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Max distance:</label>
                    <select
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value={5}>5 km</option>
                      <option value={10}>10 km</option>
                      <option value={25}>25 km</option>
                      <option value={50}>50 km</option>
                      <option value={100}>100 km</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'distance' | 'price' | 'rating')}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="distance">Distance</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredAndSortedTurfs.length} turf{filteredAndSortedTurfs.length !== 1 ? 's' : ''}
            {showNearbyOnly && userLocation && ` within ${maxDistance}km`}
          </p>
        </div>

        {/* Turfs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedTurfs.map(turf => (
            <div key={turf._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={turf.imageUrl} 
                  alt={turf.name} 
                  className="w-full h-48 object-cover"
                />
                {turf.distance !== null && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    {turf.distance!.toFixed(1)} km away
                  </div>
                )}
                {turf.rating && (
                  <div className="absolute top-3 left-3 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {turf.rating}
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{turf.name}</h2>
                
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm line-clamp-1">{turf.location}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                    <span>₹{turf.priceBase}</span>
                    <span className="text-sm text-gray-500 font-normal">/hour</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{turf.openHour}:00 - {turf.closeHour}:00</span>
                  </div>
                </div>

                {/* Show lunch break if exists */}
                {turf.lunchBreak?.from && turf.lunchBreak?.to && (
                  <div className="text-xs text-orange-600 mb-3 flex items-center gap-1">
                    <span>⏰</span>
                    <span>Lunch break: {turf.lunchBreak.from}:00 - {turf.lunchBreak.to}:00</span>
                  </div>
                )}

                {/* Slot duration info */}
                <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                  <span>🕐</span>
                  <span>{turf.slotDuration} min slots • Advance: ₹{turf.advamt}</span>
                </div>
                
                <a 
                  href={`/dashboard/user/turfs/${turf._id}`} 
                  className="block w-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  View Slots & Book
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedTurfs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No turfs found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}