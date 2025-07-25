import mongoose, { model, models, Schema } from "mongoose";



export interface IBooking{
    userId: mongoose.Types.ObjectId,
    slotId: mongoose.Types.ObjectId,
    turfId: mongoose.Types.ObjectId,
    status:string,
    paymentreceived?:number,
    paymentremain?: number,
    paymentId?: String,
    isPaymentReceived: boolean,
    _id?: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,


}

const BookingSchema = new Schema<IBooking>(
    {

        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        slotId: { type: Schema.Types.ObjectId, ref: 'Slot' },
        turfId: { type: Schema.Types.ObjectId, ref: 'Turf' },
        status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
        paymentreceived: {
            type: Number,
            required:false,
        },
        paymentremain: {
            type: Number,
            required:false,
        },
        paymentId:{
            type: String,
            required: false

        },
        isPaymentReceived: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
);



const Booking = models?.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;