import { NextRequest } from 'next/server';
import mongoose from 'mongoose';


// Import your existing Booking model or define it here
import Booking from '@/models/Booking'; // Adjust import path
import { connectDb } from '@/lib/dbConnect';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    await connectDb()
  
    const body = await request.json();

   

    // Find and update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      params.bookingId,
      {
        isPaymentReceived: true,

        ...body
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'userId', select: 'name email' },
      { path: 'turfId', select: 'name location pricebase' },
      { path: 'slotId', select: 'date startHour endHour' }
    ]);

    if (!updatedBooking) {
      return Response.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Booking closed successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Error closing booking:', error);
    return Response.json(
      { 
        success: false, 
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
