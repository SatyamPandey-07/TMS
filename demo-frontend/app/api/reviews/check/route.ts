import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import Review from '@/models/Review';
import Booking from '@/models/Booking';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json({ 
        error: 'Booking ID is required' 
      }, { status: 400 });
    }

    await connectDb();

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId })
      .populate('userId', 'name')
      .populate('turfId', 'name location');

    const canReview = booking.status === 'completed' && !existingReview;

    return NextResponse.json({
      canReview,
      hasReview: !!existingReview,
      bookingStatus: booking.status,
      review: existingReview || null
    });

  } catch (error) {
    console.error('Error checking review status:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
