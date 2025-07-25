import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';
import { sendGrievanceEmail } from '@/lib/sendGrievanceEmail';

export async function DELETE(req: NextRequest, { params }: { params: { bookingId: string } }) {
  await connectDb();
  
  if (!mongoose.models.Slot) {
    require('@/models/Slot');
  }

  try {
    // Parse the request body to get cancellation reason
    const body = await req.json();
    const { cancellationReason } = body;
    console.log(cancellationReason)

    if (!cancellationReason || cancellationReason.trim() === '') {
      return NextResponse.json({ message: 'Cancellation reason is required' }, { status: 400 });
    }

    const booking = await Booking.findById(params.bookingId).populate([
      {
        path: 'slotId',
        model: 'Slot'
      },
      {
        path: 'userId', // Assuming you have user details in booking
        model: 'User' // Adjust model name as needed
      }
    ]);

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const bookingDate = new Date(booking.slotId.date);
    console.log(booking.slotId);
    
    bookingDate.setHours(booking.slotId.startHour, 0, 0, 0);

    const now = new Date();
    const oneHourBeforeBooking = new Date(bookingDate.getTime() - 60 * 60 * 1000);

    if (now >= oneHourBeforeBooking) {
      return NextResponse.json({ 
        message: 'Bookings can only be cancelled more than 1 hour in advance.' 
      }, { status: 400 });
    }

    console.log(booking.userId);
    

    // Prepare booking details for email
    const bookingDetails = {
      bookingId: booking._id,
      userName: booking.userId?.name || 'Unknown User',
      userEmail: booking.userId?.email || 'Unknown Email',
      slotDate: booking.slotId.date,
      startHour: booking.slotId.startHour,
      endHour: booking.slotId.endHour,
      venue: booking.slotId.venue || 'Unknown Venue',
      cancelledAt: new Date(),
      reason: cancellationReason.trim()
    };

    // Send grievance email
    await sendGrievanceEmail(bookingDetails);

    // Delete the booking
    await Booking.findByIdAndDelete(params.bookingId);

    return NextResponse.json({ 
      message: 'Booking cancelled successfully and grievance email sent' 
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
