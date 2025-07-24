// app/api/payment/route.ts (your existing file)

import { NextRequest, NextResponse } from 'next/server';
import Turf from '@/models/Turf';
import Slot from '@/models/Slot';
import Booking from '@/models/Booking';                // import Booking model
import User from '@/models/User';
import { sendBookingReceiptEmail } from '@/lib/sendEmail';
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
      paymentremain: turf.pricePerHour ? (Number(turf.pricePerHour) - amount) : 0,
      // You can add paymentId if you have one
    });

    await booking.save();

    // Get user information for the receipt
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    // Send PDF receipt email
    await sendBookingReceiptEmail({
      bookingId: booking._id.toString(),
      userName: user.name,
      userEmail: email,
      turfName: turf.name,
      location: turf.location,
      date: slot.date,
      timeSlot: `${slot.startHour} - ${slot.endHour}`,
      advancePaid: amount,
      remainingPayment: turf.pricePerHour ? (Number(turf.pricePerHour) - amount) : 0,
      totalAmount: turf.pricePerHour ? Number(turf.pricePerHour) : amount,
      bookingDate: new Date().toLocaleDateString(),
      sport: turf.sport || 'Not specified',
    });

    return NextResponse.json({ success: true, bookingId: booking._id });

  } catch (err) {
    console.error('Payment/Booking error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
