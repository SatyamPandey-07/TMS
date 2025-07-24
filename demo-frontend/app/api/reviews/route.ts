import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import Review from '@/models/Review';
import Booking from '@/models/Booking';
import Turf from '@/models/Turf';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

// POST - Create a new review
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId, rating, comment, isAnonymous } = await req.json();

    if (!bookingId || !rating || !comment) {
      return NextResponse.json({ 
        error: 'Booking ID, rating, and comment are required' 
      }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ 
        error: 'Rating must be between 1 and 5' 
      }, { status: 400 });
    }

    if (comment.length > 1000) {
      return NextResponse.json({ 
        error: 'Comment must be less than 1000 characters' 
      }, { status: 400 });
    }

    await connectDb();

    // Verify the booking exists and belongs to the user
    const booking = await Booking.findById(bookingId)
      .populate('turfId')
      .populate('userId');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.userId._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (booking.status !== 'completed') {
      return NextResponse.json({ 
        error: 'Can only review completed bookings' 
      }, { status: 400 });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return NextResponse.json({ 
        error: 'Review already exists for this booking' 
      }, { status: 400 });
    }

    // Create the review
    const review = new Review({
      userId: session.user.id,
      turfId: booking.turfId._id,
      bookingId,
      rating,
      comment,
      isAnonymous: isAnonymous || false,
      isVerified: true
    });

    await review.save();

    // Populate the review with user and turf data for response
    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name')
      .populate('turfId', 'name location')
      .populate('bookingId');

    return NextResponse.json({
      success: true,
      review: populatedReview,
      message: 'Review submitted successfully!'
    });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET - Get reviews (for a turf or user)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const turfId = searchParams.get('turfId');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    await connectDb();

    let query: Record<string, any> = {};
    
    if (turfId) {
      query.turfId = turfId;
    }
    
    if (userId) {
      query.userId = userId;
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find(query)
      .populate('userId', 'name')
      .populate('turfId', 'name location')
      .populate('bookingId', 'createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    // Calculate average rating if getting reviews for a turf
    let averageRating = null;
    if (turfId) {
      const ratingStats = await Review.aggregate([
        { $match: { turfId: new mongoose.Types.ObjectId(turfId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
          }
        }
      ]);
      
      if (ratingStats.length > 0) {
        averageRating = {
          average: Math.round(ratingStats[0].averageRating * 10) / 10,
          total: ratingStats[0].totalReviews
        };
      }
    }

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      averageRating
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
