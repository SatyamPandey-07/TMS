
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";
import Turf from "@/models/Turf";
import Slot from "@/models/Slot";
import dayjs from "dayjs";



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