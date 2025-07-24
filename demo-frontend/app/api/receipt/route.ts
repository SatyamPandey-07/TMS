import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import Turf from '@/models/Turf';
import Slot from '@/models/Slot';
import User from '@/models/User';
import { generateReceiptPDF } from '@/lib/generateReceipt';
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
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    await connectDb();

    // Find the booking with populated data
    const booking = await Booking.findById(bookingId)
      .populate('turfId')
      .populate('slotId')
      .populate('userId');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if the user owns this booking or is an admin
    if (booking.userId._id.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Generate PDF receipt
    const receiptData = {
      bookingId: booking._id.toString(),
      userName: booking.userId.name,
      userEmail: booking.userId.email,
      turfName: booking.turfId.name,
      location: booking.turfId.location,
      date: booking.slotId.date,
      timeSlot: `${booking.slotId.startHour} - ${booking.slotId.endHour}`,
      advancePaid: Number(booking.paymentreceived),
      remainingPayment: Number(booking.paymentremain || 0),
      totalAmount: Number(booking.paymentreceived) + Number(booking.paymentremain || 0),
      bookingDate: new Date(booking.createdAt).toLocaleDateString(),
      sport: booking.turfId.sport || 'Not specified',
    };

    const pdfBuffer = await generateReceiptPDF(receiptData);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="TurfMaster_Receipt_${booking._id}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating receipt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId, emailTo } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    await connectDb();

    // Find the booking with populated data
    const booking = await Booking.findById(bookingId)
      .populate('turfId')
      .populate('slotId')
      .populate('userId');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if the user owns this booking or is an admin
    if (booking.userId._id.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Import the email function here to avoid circular imports
    const { sendBookingReceiptEmail } = await import('@/lib/sendEmail');

    // Resend receipt email
    await sendBookingReceiptEmail({
      bookingId: booking._id.toString(),
      userName: booking.userId.name,
      userEmail: emailTo || booking.userId.email,
      turfName: booking.turfId.name,
      location: booking.turfId.location,
      date: booking.slotId.date,
      timeSlot: `${booking.slotId.startHour} - ${booking.slotId.endHour}`,
      advancePaid: Number(booking.paymentreceived),
      remainingPayment: Number(booking.paymentremain || 0),
      totalAmount: Number(booking.paymentreceived) + Number(booking.paymentremain || 0),
      bookingDate: new Date(booking.createdAt).toLocaleDateString(),
      sport: booking.turfId.sport || 'Not specified',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Receipt email sent successfully' 
    });

  } catch (error) {
    console.error('Error resending receipt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
