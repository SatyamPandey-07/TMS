import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // customize this to your auth setup
import { connectDb } from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import Turf from '@/models/Turf';
import Slot from '@/models/Slot';
import User from '@/models/User';
import mongoose from 'mongoose';


export const GET = async (req: NextRequest) => {
  await connectDb();
  
  const session = await getServerSession(authOptions);
  const ownerId = session?.user?.id;
  console.log(ownerId);
  
  if (!ownerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.models.Slot) {
    require('@/models/Slot');
  }
  if (!mongoose.models.Booking) {
    require('@/models/Booking');
  }
  if (!mongoose.models.Turf) {
    require('@/models/Turf');
  }
  if (!mongoose.models.User) {
    require('@/models/User');
  }
  try {
    // Step 1: Find all turfs owned by this owner
    const turfs = await Turf.find({ ownerId: ownerId }).select('_id');
    console.log(turfs);
    
    const turfIds = turfs.map(t => t._id);

    
    
    if (turfIds.length === 0) {
      return NextResponse.json({ bookings: [] });
    }

    // Step 2: Fetch bookings for those turfs
   
const bookings = await Booking.find({ turfId: { $in: turfIds } })
.populate({
    path: 'userId',
    select: 'name email'
  })
  .populate({
    path: 'slotId',
    model: 'Slot' // explicitly specify the model
  })
  .populate({
    path: 'turfId',
    select: 'name location priceBase'
  })
  .sort({ createdAt: -1 });

  console.log(bookings);
  

    return NextResponse.json({ bookings }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
};
