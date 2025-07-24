import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Star, Users } from 'lucide-react';
import Image from 'next/image';

interface TurfCardProps {
  turf: {
    _id: string;
    name: string;
    location: string;
    priceBase: number;
    imageUrl: string;
    rating?: number;
    openHour?: number;
    closeHour?: number;
    capacity?: number;
  };
  onBook?: (turfId: string) => void;
}

export function ModernTurfCard({ turf, onBook }: TurfCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={turf.imageUrl || '/placeholder-turf.jpg'}
            alt={turf.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Rating Badge */}
          {turf.rating && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{turf.rating}</span>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-3 py-1">
            <span className="text-sm font-bold">₹{turf.priceBase}/hr</span>
          </div>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {turf.name}
          </CardTitle>
          <CardDescription className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            {turf.location}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            {turf.openHour && turf.closeHour && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{turf.openHour}:00 - {turf.closeHour}:00</span>
              </div>
            )}
            
            {turf.capacity && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{turf.capacity} players</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              Football
            </div>
            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              Available
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => window.open(`/dashboard/user/turfs/${turf._id}`, '_blank')}
            >
              View Details
            </Button>
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => onBook?.(turf._id)}
            >
              Book Now
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default ModernTurfCard;
