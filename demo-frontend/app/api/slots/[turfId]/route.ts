// app/api/slots/[turfId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";
import Turf from "@/models/Turf";
import Slot from "@/models/Slot";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { turfId: string } }) {
  try {
    console.log("Connecting to DB...");
    await connectDb();
    console.log(`Looking for turf with ID: ${params.turfId}`);
    
    const turf = await Turf.findById(params.turfId);
    if (!turf) {
      console.log("Turf not found");
      return NextResponse.json({ error: "Turf not found" }, { status: 404 });
    }
    
    const body = await req.json();
    console.log("Request body:", body);
    const { date, fromTime, toTime } = body;

    if (!date || !dayjs(date).isValid()) {
      console.log("Invalid date received:", date);
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    if (typeof fromTime !== "number" || typeof toTime !== "number" || fromTime >= toTime) {
      console.log(`Invalid fromTime/toTime received: fromTime=${fromTime}, toTime=${toTime}`);
      return NextResponse.json({ error: "Invalid fromTime or toTime" }, { status: 400 });
    }

    console.log(`Turf hours: open=${turf.openHour}, close=${turf.closeHour}`);
    if (fromTime < turf.openHour || toTime > turf.closeHour) {
      console.log(`Requested times outside open hours: fromTime=${fromTime}, toTime=${toTime}`);
      return NextResponse.json(
        {
          error: `Slots must be within turf open hours (${turf.openHour} - ${turf.closeHour})`,
        },
        { status: 400 }
      );
    }

    // REMOVED: Lunch break validation error - now handled automatically in the loop
    console.log(`Lunch break: from=${turf.lunchBreak.from}, to=${turf.lunchBreak.to}`);

    const slotDurationHours = turf.slotDuration / 60;
    console.log(`Slot duration in hours: ${slotDurationHours}`);

    const slotsToInsert = [];
    const skippedLunchSlots = [];

    for (let time = fromTime; time < toTime; time += slotDurationHours) {
      const slotEndTime = time + slotDurationHours;
      
      // Check if this slot overlaps with lunch break
      if (time < turf.lunchBreak.to && slotEndTime > turf.lunchBreak.from) {
        console.log(`Skipping time ${time}-${slotEndTime} due to lunch break.`);
        skippedLunchSlots.push({ startHour: time, endHour: slotEndTime });
        continue;
      }

      // Check for existing slot
      const existing = await Slot.findOne({
        turfId: turf._id,
        date,
        startHour: time,
        endHour: slotEndTime,
      });

      if (existing) {
        console.log(`Slot already exists: ${date} ${time} - ${slotEndTime}, skipping.`);
        continue; // Skip existing slot
      }

      slotsToInsert.push({
        turfId: turf._id,
        date,
        startHour: time,
        endHour: slotEndTime,
      });
    }

    if (slotsToInsert.length === 0) {
      console.log("No new slots to insert.");
      const message = skippedLunchSlots.length > 0 
        ? "No new slots to generate. All requested slots either already exist or fall within lunch break hours."
        : "No new slots to generate, all slots already exist";
      
      return NextResponse.json({ 
        message,
        skippedLunchSlots: skippedLunchSlots.length > 0 ? skippedLunchSlots : undefined
      });
    }

    console.log(`Inserting ${slotsToInsert.length} new slots for turf ${turf._id} on date ${date}`);

    await Slot.insertMany(slotsToInsert);

    console.log("Slots successfully generated.");
    
    const response = { 
      message: "Slots generated", 
      slots: slotsToInsert 
    };

    // Include info about skipped lunch slots if any
    if (skippedLunchSlots.length > 0) {
      response.message += ` (${skippedLunchSlots.length} slots skipped due to lunch break)`;
      response.skippedLunchSlots = skippedLunchSlots;
    }

    return NextResponse.json(response);
    
  } catch (error) {
    console.error("Error generating slots:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function GET(_: NextRequest, { params }: { params: { turfId: string } }) {
  await connectDb();
  const date = dayjs().format("YYYY-MM-DD");
  const slots = await Slot.find({ turfId: params.turfId}).sort({ startHour: 1 });

  return NextResponse.json({ slots });
}




export async function DELETE(_: NextRequest, { params }: { params: { slotId: string } }) {
  await connectDb();

  try {
    const deleted = await Slot.findByIdAndDelete(params.slotId);
    if (!deleted) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Slot deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 });
  }
}