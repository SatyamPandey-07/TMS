import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';

export async function DELETE(req: NextRequest, { params }: { params: { bookingId: string } }) {
  await connectDb();
  
  if (!mongoose.models.Slot) {
    require('@/models/Slot');
  }

  try {
    console.log('Attempting to cancel booking:', params.bookingId);

    // Find the booking with slot details
    const booking = await Booking.findById(params.bookingId).populate({
      path: 'slotId',
      model: 'Slot'
    });

    if (!booking) {
      console.log('Booking not found:', params.bookingId);
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    console.log('Found booking:', {
      bookingId: booking._id,
      slotDate: booking.slotId.date,
      startHour: booking.slotId.startHour
    });

    // Check if booking can be cancelled (1 hour before rule)
    const bookingDate = new Date(booking.slotId.date);
    bookingDate.setHours(booking.slotId.startHour, 0, 0, 0);

    const now = new Date();
    const oneHourBeforeBooking = new Date(bookingDate.getTime() - 60 * 60 * 1000);

    console.log('Time check:', {
      now: now.toISOString(),
      bookingTime: bookingDate.toISOString(),
      oneHourBefore: oneHourBeforeBooking.toISOString(),
      canCancel: now < oneHourBeforeBooking
    });

    if (now >= oneHourBeforeBooking) {
      return NextResponse.json({ 
        message: 'Bookings can only be cancelled more than 1 hour in advance.' 
      }, { status: 400 });
    }

    // Delete the booking
    const deletedBooking = await Booking.findByIdAndDelete(params.bookingId);
    
    if (!deletedBooking) {
      return NextResponse.json({ 
        message: 'Failed to cancel booking' 
      }, { status: 500 });
    }

    console.log('Booking cancelled successfully:', params.bookingId);

    return NextResponse.json({ 
      message: 'Booking cancelled successfully',
      cancelledBookingId: params.bookingId
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ 
      message: 'Server error occurred while cancelling booking' 
    }, { status: 500 });
  }
}
