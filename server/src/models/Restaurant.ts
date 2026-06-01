import mongoose, { Schema } from 'mongoose';
import type { Restaurant as RestaurantType } from '../types';

const restaurantSchema = new Schema<RestaurantType>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewsCount: { type: Number, required: true },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
    description: { type: String, required: true },
    philosophies: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    address: { type: String, required: true },
    coordinates: {
        type: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        required: true
    },
    popularTimeSlots: { type: [String], default: [] },
    michelinStar: Number,
    menu: {
        type: [{
            name: { type: String, required: true },
            description: { type: String, required: true },
            price: { type: Number, required: true },
            pairing: { type: String }
        }],
        default: []
    }
}, {
    timestamps: true
});

export const RestaurantModel = mongoose.model<RestaurantType>('Restaurant', restaurantSchema);
