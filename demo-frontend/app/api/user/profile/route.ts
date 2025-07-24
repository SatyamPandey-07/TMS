import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDb } from '@/lib/dbConnect';
import User from '@/models/User';
import Booking from '@/models/Booking';
import Turf from '@/models/Turf';
import Slot from '@/models/Slot';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDb();
    
    // Get user details (for phone number which isn't in session)
    const user = await User.findById(session.user.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's booking statistics
    const totalBookings = await Booking.countDocuments({ userId: user._id });
    const confirmedBookings = await Booking.countDocuments({ 
      userId: user._id, 
      status: 'confirmed' 
    });

    // Calculate total spent
    const bookings = await Booking.find({ userId: user._id, status: 'confirmed' });
    const totalSpent = bookings.reduce((total, booking) => {
      return total + (booking.paymentreceived || 0);
    }, 0);

    // Get recent bookings with turf details
    const recentBookings = await Booking.find({ userId: user._id })
      .populate('turfId', 'name location')
      .populate('slotId', 'date startHour endHour')
      .sort({ createdAt: -1 })
      .limit(5);

    // Find favorite turf (most booked)
    const turfBookingCounts = await Booking.aggregate([
      { $match: { userId: user._id, status: 'confirmed' } },
      { $group: { _id: '$turfId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let favoriteSpot = 'No favorite yet';
    if (turfBookingCounts.length > 0) {
      const favoriteTurf = await Turf.findById(turfBookingCounts[0]._id);
      favoriteSpot = favoriteTurf?.name || 'Unknown Turf';
    }

    // Create recent activities from bookings
    const recentActivities = recentBookings.map((booking: any) => ({
      id: booking._id.toString(),
      type: 'booking',
      title: `Booked ${booking.turfId?.name || 'Unknown Turf'}`,
      description: `${booking.turfId?.location || 'Location unavailable'} - ${booking.slotId ? `${booking.slotId.startHour}:00 - ${booking.slotId.endHour}:00` : 'Time unavailable'}`,
      date: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Date unavailable',
      turf: booking.turfId?.name || 'Unknown Turf'
    }));

    const userProfile = {
      user: {
        phone: user.phone || '',
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        }) : 'Unknown'
      },
      stats: {
        totalBookings,
        gamesPlayed: confirmedBookings,
        totalSpent,
        favoriteSpot,
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        }) : 'Unknown',
        achievements: generateAchievements(totalBookings, confirmedBookings, totalSpent)
      },
      recentActivities
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await connectDb();
    
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { name, phone },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || ''
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

// Helper function to generate achievements based on user activity
function generateAchievements(totalBookings: number, confirmedBookings: number, totalSpent: number) {
  const achievements = [];
  
  if (totalBookings >= 1) achievements.push('First Timer');
  if (totalBookings >= 5) achievements.push('Regular Player');
  if (totalBookings >= 10) achievements.push('Sports Enthusiast');
  if (totalBookings >= 25) achievements.push('Turf Master');
  if (totalSpent >= 5000) achievements.push('Big Spender');
  if (confirmedBookings >= 3) achievements.push('Consistent Player');
  
  return achievements.length > 0 ? achievements : ['New Member'];
}
