import mongoose, { model, models, Schema } from "mongoose";

export interface Slot {
  turfId: mongoose.Types.ObjectId;
  date: string; // Format: YYYY-MM-DD
  startHour: number;
  endHour: number;
  isBooked: boolean;
  bookingId?: mongoose.Types.ObjectId;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const SlotSchema = new Schema<Slot>(
  {
    turfId: { type: Schema.Types.ObjectId, ref: "Turf", required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    startHour: { type: Number, required: true },
    endHour: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: false },
  },
  { timestamps: true }
);

const Slot = models?.Slot || model<Slot>("Slot", SlotSchema);

export default Slot;
