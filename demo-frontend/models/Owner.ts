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
    
    // Business Information
    businessName?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    gstin?: string;
    panNumber?: string;
    
    // Notification Settings
    notificationSettings?: {
        email?: boolean;
        sms?: boolean;
        push?: boolean;
        bookingAlerts?: boolean;
        paymentAlerts?: boolean;
        reviewNotifications?: boolean;
    };
    
    // Business Settings
    businessSettings?: {
        autoAcceptBookings?: boolean;
        allowCancellations?: boolean;
        cancellationWindow?: number;
        requireAdvancePayment?: boolean;
        advancePaymentPercentage?: number;
    };
    
    // Security Settings
    securitySettings?: {
        twoFactorAuth?: boolean;
        businessListingVisible?: boolean;
        showContactInfo?: boolean;
        allowDirectMessages?: boolean;
    };
    
    // Payment Settings
    paymentSettings?: {
        methods?: {
            card?: boolean;
            upi?: boolean;
            netbanking?: boolean;
            wallet?: boolean;
        };
        tax?: {
            includeTax?: boolean;
            taxPercentage?: number;
        };
    };
    
    lastUpdated?: Date;
}

const OwnerSchema = new Schema<Owner>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        acceptedPaymentMethods: [
            {
                type: String,
                required: true,
            }
        ],
        turfIds: [{ type: Schema.Types.ObjectId, ref: 'Turf' }],
        bookingIds: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
        
        // Business Information
        businessName: { type: String },
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        address: { type: String },
        gstin: { type: String },
        panNumber: { type: String },
        
        // Notification Settings
        notificationSettings: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            bookingAlerts: { type: Boolean, default: true },
            paymentAlerts: { type: Boolean, default: true },
            reviewNotifications: { type: Boolean, default: true },
        },
        
        // Business Settings
        businessSettings: {
            autoAcceptBookings: { type: Boolean, default: false },
            allowCancellations: { type: Boolean, default: true },
            cancellationWindow: { type: Number, default: 24 },
            requireAdvancePayment: { type: Boolean, default: true },
            advancePaymentPercentage: { type: Number, default: 50 },
        },
        
        // Security Settings
        securitySettings: {
            twoFactorAuth: { type: Boolean, default: false },
            businessListingVisible: { type: Boolean, default: true },
            showContactInfo: { type: Boolean, default: true },
            allowDirectMessages: { type: Boolean, default: true },
        },
        
        // Payment Settings
        paymentSettings: {
            methods: {
                card: { type: Boolean, default: true },
                upi: { type: Boolean, default: true },
                netbanking: { type: Boolean, default: true },
                wallet: { type: Boolean, default: false },
            },
            tax: {
                includeTax: { type: Boolean, default: true },
                taxPercentage: { type: Number, default: 18 },
            },
        },
        
        lastUpdated: { type: Date, default: Date.now },
    },
    {timestamps: true}
);



const Owner = models?.Owner || model<Owner>("Owner", OwnerSchema);

export default Owner;