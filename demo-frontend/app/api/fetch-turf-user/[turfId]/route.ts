// app/api/turfs/[turfId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Turf from '@/models/Turf';
import { connectDb } from '@/lib/dbConnect';

export async function GET(req: NextRequest, { params }: { params: Promise<{ turfId: string }> }) {
  try {
    await connectDb();

    const { turfId } = await params;
    const turf = await Turf.findById(turfId);

    if (!turf) {
      return NextResponse.json({ error: 'Turf not found' }, { status: 404 });
    }

    // Convert Mongoose document to JSON (strip _id and __v if you want)
    const turfObj = turf.toObject();
    turfObj._id = turfObj._id.toString(); // Ensure _id is string

    return NextResponse.json(turfObj);
  } catch (err) {
    console.error('Error fetching turf:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
