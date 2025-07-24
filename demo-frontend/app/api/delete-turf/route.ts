import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import Turf from '@/models/Turf';
import Slot from '@/models/Slot';
import Booking from '@/models/Booking';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const turfId = searchParams.get('id');

    if (!turfId) {
      return NextResponse.json({ error: 'Turf ID is required' }, { status: 400 });
    }

    await connectDb();

    // Step 1: Delete all bookings related to this turf
    await Booking.deleteMany({ turfId });

    // Step 2: Delete all slots related to this turf
    await Slot.deleteMany({ turfId });

    // Step 3: Delete the turf itself
    const deletedTurf = await Turf.findByIdAndDelete(turfId);

    if (!deletedTurf) {
      return NextResponse.json({ error: 'Turf not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Turf, slots, and bookings deleted successfully' });
  } catch (error) {
    console.error('[DELETE_TURF_ERROR]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
