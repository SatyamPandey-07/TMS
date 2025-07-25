import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import Review from '@/models/Review';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PUT - Update a review
export async function PUT(
  req: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId } = params;
    const { rating, comment, isAnonymous } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ 
        error: 'Rating and comment are required' 
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

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (review.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment;
    review.isAnonymous = isAnonymous || false;
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name')
      .populate('turfId', 'name location')
      .populate('bookingId');

    return NextResponse.json({
      success: true,
      review: populatedReview,
      message: 'Review updated successfully!'
    });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE - Delete a review
export async function DELETE(
  req: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId } = params;

    await connectDb();

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Allow deletion by review owner or admin
    if (review.userId.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await Review.findByIdAndDelete(reviewId);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully!'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
