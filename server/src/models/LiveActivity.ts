import mongoose, { Schema } from 'mongoose';
import type { LiveActivity as LiveActivityType } from '../types';

const liveActivitySchema = new Schema<LiveActivityType>({
    id: { type: String, required: true, unique: true },
    type: {
        type: String,
        required: true,
        enum: ['booking', 'attendance', 'review', 'system']
    },
    message: { type: String, required: true },
    timestamp: { type: String, required: true },
    latency: String,
    category: {
        type: String,
        enum: ['success', 'warning', 'info']
    }
}, {
    timestamps: true
});

export const LiveActivityModel = mongoose.model<LiveActivityType>('LiveActivity', liveActivitySchema);
