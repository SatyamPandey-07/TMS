// app/api/payment/route.ts (your existing file)

import { NextRequest, NextResponse } from 'next/server';
import Turf from '@/models/Turf';
import Slot from '@/models/Slot';
import Booking from '@/models/Booking';                // import Booking model
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

    const { turfId, slotId, amount } = await req.json();

    await connectDb();

    const turf = await Turf.findById(turfId);
    const slot = await Slot.findById(slotId);

    if (!turf || !slot) {
      return NextResponse.json({ error: 'Invalid turf or slot' }, { status: 400 });
    }

    if (slot.isBooked) {
      return NextResponse.json({ error: 'Slot already booked' }, { status: 400 });
    }

    // Mark slot as booked
    slot.isBooked = true;
    await slot.save();

    // Create Booking record with status "confirmed"
    const booking = new Booking({
      userId,
      turfId,
      slotId,
      status: 'confirmed',
      paymentreceived: amount,
      paymentremain: turf.priceBase ? (turf.priceBase-amount):0,
      // You can add paymentId if you have one
    });

    await booking.save();

    // Send confirmation email
    await sendBookingConfirmationEmail({
      to: email,
      turfName: turf.name,
      location: turf.location,
      slotTime: `${slot.startHour} - ${slot.endHour}`,  // Adjust field names here if needed
      advancePaid: amount,
      remainingPayment: turf.priceBase ? turf.priceBase * 0.5 : 0,
    });

    return NextResponse.json({ success: true, bookingId: booking._id });

  } catch (err) {
    console.error('Payment/Booking error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}