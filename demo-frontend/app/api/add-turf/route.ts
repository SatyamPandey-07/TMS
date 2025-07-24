import { NextRequest, NextResponse } from "next/server";
import Turf from "@/models/Turf";
import { connectDb } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json();
    const {
      name,
      location,
      pinlocation,  // { lat, lng }
      ownerId,
      priceBase,
      openHour,
      closeHour,
      lunchBreak,
      slotDuration,
      advamt,
      imageUrl,
    } = body;

    if (!name || !location || !pinlocation || !ownerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const turf = await Turf.create({
      name,
      location,
      pinlocation,
      ownerId,
      priceBase,
      openHour,
      closeHour,
      lunchBreak,
      slotDuration,
      advamt,
      imageUrl,
    });

    return NextResponse.json({ turf }, { status: 201 });

  } catch (error) {
    console.error("Error creating turf:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
