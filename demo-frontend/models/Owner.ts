import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";


export interface Owner{
    user: mongoose.Types.ObjectId;
    acceptedPaymentMethods: [String],
    turfIds: mongoose.Types.ObjectId,
    bookingIds: mongoose.Types.ObjectId,
    _id?: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
}

const OwnerSchema = new Schema<Owner>(
    {

        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        acceptedPaymentMethods: [
            {
                type :String,
                required: true,
            }
        ],
        turfIds: [{ type: Schema.Types.ObjectId, ref: 'Turf' }],
        bookingIds: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    },
    {timestamps: true}
);



const Owner = models?.Owner || model<Owner>("Owner", OwnerSchema);

export default Owner;