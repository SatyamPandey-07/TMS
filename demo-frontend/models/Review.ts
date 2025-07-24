import mongoose, { model, models, Schema } from "mongoose";

export interface Review {
    userId: mongoose.Types.ObjectId;
    turfId: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    rating: number; // 1-5 stars
    comment: string;
    isAnonymous?: boolean;
    isVerified?: boolean; // If booking is verified
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const ReviewSchema = new Schema<Review>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        turfId: {
            type: Schema.Types.ObjectId,
            ref: 'Turf',
            required: true
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
            unique: true // One review per booking
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            maxlength: 1000
        },
        isAnonymous: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: true // Verified because it's from actual booking
        }
    },
    { timestamps: true }
);

// Index for efficient queries
ReviewSchema.index({ turfId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ bookingId: 1 });

const Review = models.Review || model<Review>('Review', ReviewSchema);

export default Review;
