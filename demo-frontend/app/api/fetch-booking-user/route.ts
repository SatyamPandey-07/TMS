import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // customize this to your auth setup
import { connectDb } from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import Slot from '@/models/Slot';
import Turf from '@/models/Turf';
import User from '@/models/User';


export const GET = async (req: NextRequest) => {
  await connectDb();

  const models = { Booking, Slot, Turf, User };
  
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  console.log("userId");
  
  console.log(userId);
  
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    

    // Step 2: Fetch bookings for those turfs
    const bookings = await Booking.find({ userId: userId })
      .populate('userId', 'name email') // optional
      .populate('slotId', 'startHour endHour date') // to get date/time
      .populate('turfId', 'name location') // to get turf info
      .sort({ createdAt: -1 });

      console.log(bookings);
      

    return NextResponse.json({ bookings }, { status: 200 });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
};
