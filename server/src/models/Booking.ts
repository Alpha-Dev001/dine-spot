import mongoose, { Schema } from 'mongoose';
import type { Booking as BookingType } from '../types';

const bookingSchema = new Schema<BookingType>({
    id: { type: String, required: true, unique: true },
    guestName: { type: String, required: true },
    email: String,
    phone: String,
    tableNo: { type: String, required: true },
    time: { type: String, required: true },
    covers: { type: Number, required: true },
    status: {
        type: String,
        required: true,
        enum: ['seated', 'confirmed', 'arriving', 'canceled']
    },
    specialNotes: String,
    restaurantId: { type: String, required: true, index: true }
}, {
    timestamps: true
});

export const BookingModel = mongoose.model<BookingType>('Booking', bookingSchema);
