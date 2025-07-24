import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";


export interface Turf{
    name: string,
    location:string,
    ownerId: { type: Schema.Types.ObjectId, ref: 'Owner' },
    pricePerHour: Number,
    sport: string,
    openHour: Number,    // e.g. 6
    closeHour: Number,   // e.g. 22
    lunchBreak: {
        from: Number,      // e.g. 13
        to: Number         // e.g. 14
    },
    pinlocation: {
        lat: Number,      // e.g. 13
        lng: Number         // e.g. 14
    },
    slotDuration: Number,
    advamt: number,
    imageUrl: String,
    _id?: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
}

const TurfSchema = new Schema<Turf>(
    {

        name: {
            type: String,
            required: true
        },
       location: {
        type: String,
        required: true
       },
       ownerId: { type: Schema.Types.ObjectId, ref: 'Owner' },
         pricePerHour: {
            type: Number,
            required: true
        },
        sport: {
            type: String,
            required: true
        },
         openHour: {
            type: Number,
            required: true
        },
        closeHour: {
            type: Number,
            required: true
        },
        slotDuration: {
            type: Number,
            required: false,
        },
        lunchBreak: {
            from: { type: Number, required: true }, // e.g., 13
            to: { type: Number, required: true },   // e.g., 14
        },
        advamt: {
            type: Number,
            required: false
        },
        imageUrl:{
            type:String,
            required:false
        },
        pinlocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
        }
    },
    {timestamps: true}
);



const Turf = models?.Turf || model<Turf>("Turf", TurfSchema);

export default Turf;