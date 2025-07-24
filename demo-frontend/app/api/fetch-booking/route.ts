import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // customize this to your auth setup
import { connectDb } from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import Turf from '@/models/Turf';
import Slot from '@/models/Slot';

export const GET = async (req: NextRequest) => {
  await connectDb();
  
  const session = await getServerSession(authOptions);
  const ownerId = session?.user?.id;
  console.log(ownerId);
  
  if (!ownerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Step 1: Find all turfs owned by this owner
    const turfs = await Turf.find({ ownerId: ownerId }).select('_id');
    console.log(turfs);
    
    const turfIds = turfs.map(t => t._id);

    console.log(turfIds);
    
    if (turfIds.length === 0) {
      return NextResponse.json({ bookings: [] });
    }

    // Step 2: Fetch bookings for those turfs
    const bookings = await Booking.find({ turfId: { $in: turfIds } })
      .populate('userId', 'name email') // optional
      .populate('slotId') // to get date/time
      .populate('turfId', 'name location') // to get turf info
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
};
