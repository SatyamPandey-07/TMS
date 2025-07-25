'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Review {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  turfName: string;
  rating: number;
  comment: string;
  date: string;
  bookingId: string;
  response?: {
    message: string;
    date: string;
  };
  isVerified: boolean;
  helpful: number;
  reported: boolean;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  responseRate: number;
  recentRatingTrend: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    responseRate: 0,
    recentRatingTrend: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [responseFilter, setResponseFilter] = useState<string>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Sample data - replace with actual API call
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const sampleReviews: Review[] = [
          {
            id: '1',
            customerName: 'Rahul Sharma',
            customerEmail: 'rahul@example.com',
            customerAvatar: '/api/placeholder/40/40',
            turfName: 'Elite Sports Arena',
            rating: 5,
            comment: 'Excellent turf quality! The grass was perfectly maintained and the facilities were top-notch. Definitely booking again!',
            date: '2024-07-23',
            bookingId: 'BK001',
            isVerified: true,
            helpful: 12,
            reported: false
          },
          {
            id: '2',
            customerName: 'Priya Patel',
            customerEmail: 'priya@example.com',
            turfName: 'Champions Ground',
            rating: 4,
            comment: 'Good experience overall. The turf was clean and well-maintained. Only minor issue was with the changing room cleanliness.',
            date: '2024-07-22',
            bookingId: 'BK002',
            response: {
              message: 'Thank you for your feedback! We have addressed the changing room issue and improved our cleaning schedule.',
              date: '2024-07-23'
            },
            isVerified: true,
            helpful: 8,
            reported: false
          },
          {
            id: '3',
            customerName: 'Amit Kumar',
            customerEmail: 'amit@example.com',
            turfName: 'Sports Paradise',
            rating: 3,
            comment: 'Average experience. The turf was okay but could be better maintained. Booking process was smooth though.',
            date: '2024-07-21',
            bookingId: 'BK003',
            isVerified: true,
            helpful: 5,
            reported: false
          },
          {
            id: '4',
            customerName: 'Sneha Reddy',
            customerEmail: 'sneha@example.com',
            turfName: 'Elite Sports Arena',
            rating: 5,
            comment: 'Amazing facility! Great lighting for evening games and the staff was very helpful. Highly recommended!',
            date: '2024-07-20',
            bookingId: 'BK004',
            response: {
              message: 'Thank you so much for your kind words! We are thrilled you enjoyed your experience.',
              date: '2024-07-21'
            },
            isVerified: true,
            helpful: 15,
            reported: false
          },
          {
            id: '5',
            customerName: 'Vikash Singh',
            customerEmail: 'vikash@example.com',
            turfName: 'Champions Ground',
            rating: 2,
            comment: 'Disappointed with the condition of the turf. There were patches of dead grass and the equipment was old.',
            date: '2024-07-19',
            bookingId: 'BK005',
            isVerified: true,
            helpful: 3,
            reported: false
          }
        ];

        const sampleStats: ReviewStats = {
          averageRating: 4.2,
          totalReviews: 89,
          ratingDistribution: {
            5: 45,
            4: 25,
            3: 12,
            2: 5,
            1: 2
          },
          responseRate: 78,
          recentRatingTrend: 0.3
        };

        setReviews(sampleReviews);
        setStats(sampleStats);
        setLoading(false);
      }, 1000);
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarSolidIcon
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;

    // Simulate API call to save reply
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? {
            ...review,
            response: {
              message: replyText,
              date: new Date().toISOString().split('T')[0]
            }
          }
        : review
    );

    setReviews(updatedReviews);
    setReplyingTo(null);
    setReplyText('');
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.turfName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    
    const matchesResponse = responseFilter === 'all' || 
                           (responseFilter === 'responded' && review.response) ||
                           (responseFilter === 'pending' && !review.response);
    
    return matchesSearch && matchesRating && matchesResponse;
  });

  if (loading) {
    return (
      <DashboardLayout type="owner">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="owner">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-girly dark:shadow-manly">
            <StarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-manly">
              Reviews & Ratings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-girly">
              Manage customer feedback and improve your service
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="p-6 text-center shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <StarIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}</h3>
              {renderStars(Math.round(stats.averageRating), 'md')}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
            <span className="text-xs text-green-500 font-medium">
              +{stats.recentRatingTrend} this month
            </span>
          </Card>

          <Card className="p-6 text-center shadow-girly dark:shadow-manly sparkle dark:glow">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReviews}</h3>
            <p className="text-gray-600 dark:text-gray-400">Total Reviews</p>
            <span className="text-xs text-blue-500 font-medium">All time</span>
          </Card>

          <Card className="p-6 text-center shadow-girly dark:shadow-manly sparkle dark:glow">
            <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.responseRate}%</h3>
            <p className="text-gray-600 dark:text-gray-400">Response Rate</p>
            <span className="text-xs text-green-500 font-medium">Great job!</span>
          </Card>

          <Card className="p-6 text-center shadow-girly dark:shadow-manly sparkle dark:glow">
            <HeartIcon className="w-8 h-8 text-pink-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.ratingDistribution[5]}</h3>
            <p className="text-gray-600 dark:text-gray-400">5-Star Reviews</p>
            <span className="text-xs text-pink-500 font-medium">Excellent!</span>
          </Card>
        </motion.div>

        {/* Rating Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-manly">
              Rating Distribution
            </h2>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{rating}</span>
                    <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                    {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reviews by customer, turf, or comment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>

                <select
                  value={responseFilter}
                  onChange={(e) => setResponseFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Reviews</option>
                  <option value="responded">Responded</option>
                  <option value="pending">Pending Response</option>
                </select>

                <Button variant="outline" className="sparkle dark:glow">
                  <FunnelIcon className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Reviews List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="p-6 shadow-girly dark:shadow-manly sparkle dark:glow">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={review.customerAvatar} alt={review.customerName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                      {review.customerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {review.customerName}
                          </h3>
                          {review.isVerified && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {review.turfName} • {review.date}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {review.rating}.0
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {review.comment}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <HeartIcon className="w-4 h-4" />
                        {review.helpful} helpful
                      </span>
                      <span>Booking #{review.bookingId}</span>
                    </div>
                    
                    {/* Owner Response */}
                    {review.response && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-2">
                          <UserCircleIcon className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Owner Response
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {review.response.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {review.response.message}
                        </p>
                      </div>
                    )}
                    
                    {/* Reply Form */}
                    {replyingTo === review.id && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your response..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-3"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleReply(review.id)}
                            className="sparkle dark:glow"
                          >
                            Send Reply
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    {!review.response && replyingTo !== review.id && (
                      <div className="mt-4 flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setReplyingTo(review.id)}
                          className="sparkle dark:glow"
                        >
                          Reply
                        </Button>
                        {review.rating <= 2 && (
                          <Button variant="outline" size="sm" className="text-orange-600">
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                            Follow Up
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
