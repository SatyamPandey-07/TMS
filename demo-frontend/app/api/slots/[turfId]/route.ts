// app/api/slots/[turfId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";
import Turf from "@/models/Turf";
import Slot from "@/models/Slot";
import dayjs from "dayjs";

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

    console.log(`Lunch break: from=${turf.lunchBreak.from}, to=${turf.lunchBreak.to}`);
    if (fromTime < turf.lunchBreak.to && toTime > turf.lunchBreak.from) {
      console.log(`Requested time overlaps lunch break.`);
      return NextResponse.json(
        { error: `Slots cannot overlap lunch break (${turf.lunchBreak.from} - ${turf.lunchBreak.to})` },
        { status: 400 }
      );
    }

    const slotDurationHours = turf.slotDuration / 60;
    console.log(`Slot duration in hours: ${slotDurationHours}`);

    const slotsToInsert = [];

    for (let time = fromTime; time < toTime; time += slotDurationHours) {
      if (time >= turf.lunchBreak.from && time < turf.lunchBreak.to) {
        console.log(`Skipping time ${time} due to lunch break.`);
        continue;
      }

      // Check for existing slot
      const existing = await Slot.findOne({
        turfId: turf._id,
        date,
        startHour: time,
        endHour: time + slotDurationHours,
      });

      if (existing) {
        console.log(`Slot already exists: ${date} ${time} - ${time + slotDurationHours}, skipping.`);
        continue; // Skip existing slot
      }

      slotsToInsert.push({
        turfId: turf._id,
        date,
        startHour: time,
        endHour: time + slotDurationHours,
      });
    }

    if (slotsToInsert.length === 0) {
      console.log("No new slots to insert.");
      return NextResponse.json({ message: "No new slots to generate, all slots already exist" });
    }

    console.log(`Inserting ${slotsToInsert.length} new slots for turf ${turf._id} on date ${date}`);

    await Slot.insertMany(slotsToInsert);

    console.log("Slots successfully generated.");
    return NextResponse.json({ message: "Slots generated", slots: slotsToInsert });
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