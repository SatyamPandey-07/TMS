import { connectDb } from '@/lib/dbConnect';
import Turf from '@/models/Turf';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const ownerId = session?.user?.id;

    if (!ownerId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDb();

    const turfs = await Turf.find({ ownerId });

    console.log('All turfs:', turfs);

    return NextResponse.json({ turfs });
  } catch (err) {
    console.error('Failed to fetch turfs', err);
    return NextResponse.json({ error: 'Failed to fetch turfs' }, { status: 500 });
  }
}
