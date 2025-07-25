import { NextRequest, NextResponse } from 'next/server';
import Turf from '@/models/Turf';
import Slot from '@/models/Slot';
import Booking from '@/models/Booking';
import { sendBookingConfirmationEmail } from '@/lib/sendEmail';
import { connectDb } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    const userId = session?.user?.id;
    if (!email || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { turfId, slotIds, amount } = await req.json();

    if (!turfId || !slotIds || !Array.isArray(slotIds) || slotIds.length === 0) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    await connectDb();

    const turf = await Turf.findById(turfId);
    if (!turf) {
      return NextResponse.json({ error: 'Invalid turf' }, { status: 400 });
    }

    // Fetch all slots and verify they exist and are not booked
    const slots = await Slot.find({ _id: { $in: slotIds } });
    
    if (slots.length !== slotIds.length) {
      return NextResponse.json({ error: 'Some slots not found' }, { status: 400 });
    }

    // Check if any slot is already booked
    const bookedSlots = slots.filter(slot => slot.isBooked);
    if (bookedSlots.length > 0) {
      return NextResponse.json({ 
        error: `Some slots are already booked: ${bookedSlots.map(s => s._id).join(', ')}` 
      }, { status: 400 });
    }

    // Start transaction-like operation
    const bookingPromises = [];
    const slotUpdatePromises = [];

    try {
      // Mark all slots as booked first
      for (const slot of slots) {
        slot.isBooked = true;
        slotUpdatePromises.push(slot.save());
      }
      await Promise.all(slotUpdatePromises);

      // Create booking records for each slot
      for (const slot of slots) {
        const booking = new Booking({
          userId,
          turfId,
          slotId: slot._id,
          status: 'confirmed',
          paymentreceived: turf.advamt, // Each slot gets the advance amount
          paymentremain: turf.priceBase ? (turf.priceBase - turf.advamt) : 0,
        });
        bookingPromises.push(booking.save());
      }

      const savedBookings = await Promise.all(bookingPromises);

      // Send confirmation email with all slot details
      const slotTimes = slots.map(slot => 
        `${slot.date} (${slot.startHour}:00 - ${slot.endHour}:00)`
      ).join(', ');

      await sendBookingConfirmationEmail({
        to: email,
        turfName: turf.name,
        location: turf.location,
        slotTime: slotTimes,
        advancePaid: amount,
        remainingPayment: turf.priceBase ? (turf.priceBase * slots.length) - amount : 0,
      });

      return NextResponse.json({ 
        success: true, 
        bookingIds: savedBookings.map(booking => booking._id),
        message: `Successfully booked ${slots.length} slots`
      });

    } catch (error) {
      // Rollback: unmark slots as booked if booking creation fails
      console.error('Error during multi-slot booking, rolling back:', error);
      
      const rollbackPromises = slots.map(slot => {
        slot.isBooked = false;
        return slot.save();
      });
      await Promise.all(rollbackPromises);
      
      throw error;
    }

  } catch (err) {
    console.error('Multi-slot payment/booking error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
