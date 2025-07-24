// app/api/turf/all/route.ts
import { connectDb } from '@/lib/dbConnect'
import Turf from '@/models/Turf'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDb()
    const turfs = await Turf.find()
    console.log("All turfs");
    
    console.log(turfs)
    
    return NextResponse.json({ turfs })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch turfs' }, { status: 500 })
  }
}
