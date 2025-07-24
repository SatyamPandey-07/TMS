import { NextRequest, NextResponse } from 'next/server';
import  { connectDb } from '@/lib/dbConnect';
import Booking from '@/models/Booking'; // Update path as needed

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
 await connectDb()
  const { id } = params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const bookingDate = new Date(booking.slotId.date);
    const [hour, min] = booking.slotId.startHour.split(":").map(Number);
    bookingDate.setHours(hour, min, 0, 0);

    const now = new Date();
    const oneHourBeforeBooking = new Date(bookingDate.getTime() - 60 * 60 * 1000);

    if (now >= oneHourBeforeBooking) {
      return NextResponse.json({ message: 'Bookings can only be cancelled more than 1 hour in advance.' }, { status: 400 });
    }

    await Booking.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
