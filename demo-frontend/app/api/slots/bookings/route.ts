import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import Slot from '@/models/Slot';

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    
    const { searchParams } = new URL(req.url);
    const turfId = searchParams.get('turfId');
    
    if (!turfId) {
      return NextResponse.json({ error: 'Turf ID is required' }, { status: 400 });
    }

    const slots = await Slot.find({ turfId }).sort({ date: 1, startHour: 1 });
    
    // Format slots for frontend compatibility
    const formattedSlots = slots.map(slot => ({
      ...slot.toObject(),
      timeSlot: `${slot.startHour}:00 - ${slot.endHour}:00`,
      isBooked: slot.booked || false,
      bookedBy: slot.bookedBy || null
    }));

    return NextResponse.json({ slots: formattedSlots });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}
