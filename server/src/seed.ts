import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { INITIAL_BOOKINGS, INITIAL_LIVE_ACTIVITIES, INITIAL_RESTAURANTS } from './data';
import { BookingModel } from './models/Booking';
import { LiveActivityModel } from './models/LiveActivity';
import { RestaurantModel } from './models/Restaurant';
import { connectDB } from './db';

dotenv.config();

async function seed() {
    await connectDB();

    const restaurantCount = await RestaurantModel.countDocuments();
    if (restaurantCount > 0) {
        console.log('Seed data already exists. Skipping seeding.');
        await mongoose.disconnect();
        return;
    }

    await RestaurantModel.insertMany(INITIAL_RESTAURANTS);
    await BookingModel.insertMany(INITIAL_BOOKINGS.map((booking) => ({
        ...booking,
        restaurantId: booking.restaurantId ?? 'the-monolith'
    })));
    await LiveActivityModel.insertMany(INITIAL_LIVE_ACTIVITIES);

    console.log('Seed data inserted successfully.');
    await mongoose.disconnect();
}

seed().catch(async (error) => {
    console.error('Seeding failed', error);
    await mongoose.disconnect();
    process.exit(1);
});
