import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export async function connectDB(): Promise<void> {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('MONGODB_URI environment variable is required');
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
}
