'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useNotification } from '@/components/Notification';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  Star, 
  Navigation,
  Coffee,
  Timer,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Plus,
  Minus
} from 'lucide-react';

interface Slot {
  _id: string;
  startHour: number;
  endHour: number;
  date: string;
  isBooked: boolean;
}

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
  rating?: number;
}

export default function TurfPage({ params }: { params: { turfId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();
  const turfId = params.turfId;
  
  const [turf, setTurf] = useState<Turf | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [turfLoading, setTurfLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTurfDetails = async () => {
      try {
        setTurfLoading(true);
        const res = await fetch(`/api/fetch-turf-user/${turfId}`);
        const data = await res.json();
        console.log(data);
        
        setTurf(data);
      } catch (err) {
        console.error('Error fetching turf details', err);
      } finally {
        setTurfLoading(false);
      }
    };

    const fetchSlots = async () => {
      try {
        const res = await fetch(`/api/slots/${turfId}`);
        const data = await res.json();
        setSlots(data.slots);
      } catch (err) {
        console.error('Error fetching slots', err);
      }
    };

    fetchTurfDetails();
    fetchSlots();
  }, [turfId]);

  const handleBook = (slotId: string) => {
    setLoading(true);
    router.push(`/dashboard/user/turfs/${turfId}/book?turfId=${turfId}&slotId=${slotId}`);
  };

  const handleSlotSelection = (slotId: string) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  const handleBookMultiple = () => {
    if (selectedSlots.length === 0) {
      showNotification('Please select at least one slot to book', 'error');
      return;
    }
    
    if (selectedSlots.length === 1) {
      // If only one slot selected, use regular booking flow
      handleBook(selectedSlots[0]);
      return;
    }
    
    // For multiple slots, redirect to multi-slot booking page
    const slotsParam = selectedSlots.join(',');
    setLoading(true);
    router.push(`/dashboard/user/turfs/${turfId}/book?turfId=${turfId}&slotIds=${slotsParam}&multiSlot=true`);
  };

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  const handleBack = () => {
    router.back();
  };

  const formatTime = (hour: number) => {
    return `${hour}:00`;
  };

  const getSlotStatus = (slot: Slot) => {
    if (slot.isBooked) {
      return { text: 'Booked', color: 'bg-red-500', icon: XCircle };
    }
    return { text: 'Available', color: 'bg-green-500', icon: CheckCircle };
  };

  if (turfLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading turf details...</p>
        </div>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Turf not found</p>
          <button 
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const availableSlots = slots.filter(slot => !slot.isBooked);
  const bookedSlots = slots.filter(slot => slot.isBooked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{turf.name}</h1>
              <p className="text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {turf.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Turf Details Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2">
              <img 
                src={turf.imageUrl} 
                alt={turf.name} 
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            {/* Details Section */}
            <div className="md:w-1/2 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-800">{turf.name}</h2>
                {turf.rating && (
                  <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{turf.rating}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{turf.location}</span>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>Open: {formatTime(turf.openHour)} - {formatTime(turf.closeHour)}</span>
                </div>

                {/* Lunch Break */}
                {turf.lunchBreak?.from && turf.lunchBreak?.to && (
                  <div className="flex items-center gap-3 text-orange-600">
                    <Coffee className="w-5 h-5 text-orange-400" />
                    <span>Lunch Break: {formatTime(turf.lunchBreak.from)} - {formatTime(turf.lunchBreak.to)}</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-3 text-green-600">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-xl font-bold">₹{turf.priceBase}/hour</span>
                </div>

                {/* Slot Duration */}
                <div className="flex items-center gap-3 text-gray-700">
                  <Timer className="w-5 h-5 text-gray-400" />
                  <span>{turf.slotDuration} minutes per slot</span>
                </div>

                {/* Advance Amount */}
                <div className="flex items-center gap-3 text-blue-600">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <span>Advance Payment: ₹{turf.advamt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slots Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Slots */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-bold text-gray-800">
                  Available Slots ({availableSlots.length})
                </h3>
              </div>
              
              {/* Multi-slot selection controls */}
              {selectedSlots.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedSlots.length} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-200 hover:border-red-300"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            
            {availableSlots.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlots.includes(slot._id);
                    return (
                      <div key={slot._id} className="relative">
                        <button
                          disabled={loading}
                          onClick={() => handleSlotSelection(slot._id)}
                          className={`group relative w-full p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                            isSelected 
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-2 border-blue-700' 
                              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>{formatTime(slot.startHour)} - {formatTime(slot.endHour)}</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <span>{slot.date}</span>
                          </div>
                          
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                        </button>
                        
                        {/* Quick book single slot button */}
                        <button
                          onClick={() => handleBook(slot._id)}
                          disabled={loading}
                          className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm text-gray-800 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                        >
                          Quick Book
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                {/* Multi-slot booking button */}
                {selectedSlots.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-900">
                          {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
                        </h4>
                        <p className="text-sm text-blue-700">
                          Total advance: ₹{(turf?.advamt || 0) * selectedSlots.length}
                        </p>
                      </div>
                      <button
                        onClick={handleBookMultiple}
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Book {selectedSlots.length > 1 ? 'Multiple' : 'Slot'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No available slots at the moment</p>
              </div>
            )}
          </div>

          {/* Booked Slots */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bold text-gray-800">
                Booked Slots ({bookedSlots.length})
              </h3>
            </div>
            
            {bookedSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {bookedSlots.map((slot) => (
                  <div
                    key={slot._id}
                    className="bg-gray-100 text-gray-500 p-4 rounded-xl font-semibold cursor-not-allowed shadow-sm"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      <span>{formatTime(slot.startHour)} - {formatTime(slot.endHour)}</span>
                       <span>{slot.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No booked slots yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{availableSlots.length}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">{bookedSlots.length}</div>
              <div className="text-sm text-gray-600">Booked</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">₹{turf.priceBase}</div>
              <div className="text-sm text-gray-600">Per Hour</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{turf.slotDuration}m</div>
              <div className="text-sm text-gray-600">Slot Duration</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}