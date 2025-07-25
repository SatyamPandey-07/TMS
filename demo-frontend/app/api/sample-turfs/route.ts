import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";
import Turf from "@/models/Turf";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDb();
    
    const sampleTurfs = [
      {
        name: "Green Valley Sports Complex",
        location: "Sector 15, Noida",
        sport: "Football",
        ownerId: session.user.id,
        pricePerHour: 800,
        openHour: 6,
        closeHour: 22,
        lunchBreak: {
          from: 13,
          to: 14
        },
        pinlocation: {
          lat: 28.5355,
          lng: 77.3910
        },
        slotDuration: 60,
        advamt: 200,
        imageUrl: "/api/placeholder/400/300"
      },
      {
        name: "Champions Cricket Ground",
        location: "Dwarka, New Delhi",
        sport: "Cricket",
        ownerId: session.user.id,
        pricePerHour: 1200,
        openHour: 5,
        closeHour: 21,
        lunchBreak: {
          from: 12,
          to: 13
        },
        pinlocation: {
          lat: 28.5929,
          lng: 77.0460
        },
        slotDuration: 120,
        advamt: 300,
        imageUrl: "/api/placeholder/400/300"
      },
      {
        name: "Elite Badminton Center",
        location: "Gurgaon, Haryana",
        sport: "Badminton",
        ownerId: session.user.id,
        pricePerHour: 600,
        openHour: 6,
        closeHour: 23,
        lunchBreak: {
          from: 14,
          to: 15
        },
        pinlocation: {
          lat: 28.4595,
          lng: 77.0266
        },
        slotDuration: 60,
        advamt: 150,
        imageUrl: "/api/placeholder/400/300"
      }
    ];

    // Clear existing turfs for this owner first
    await Turf.deleteMany({ ownerId: session.user.id });
    
    const createdTurfs = await Turf.insertMany(sampleTurfs);
    
    return NextResponse.json({ 
      message: 'Sample turfs created successfully',
      turfs: createdTurfs 
    });

  } catch (error) {
    console.error("Error creating sample turfs:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
