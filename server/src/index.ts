import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { connectDB } from './db';
import errorHandler from './middleware/errorHandler';
import restaurantsRouter from './routes/restaurants';
import bookingsRouter from './routes/bookings';
import activitiesRouter from './routes/activities';
import ownersRouter from './routes/owners';
import customersRouter from './routes/customers';
import { OwnerAccountModel, hashPassword } from './models/OwnerAccount';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(cors({ origin: ['http://localhost:3000'] }));
app.use(express.json());

app.use('/api/restaurants', restaurantsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/owners', ownersRouter);
app.use('/api/customers', customersRouter);

app.use(errorHandler);

async function ensureDefaultOwnerAccount() {
    const defaultEmail = 'owner@tableau.com';
    const defaultPassword = 'securepass';

    const existing = await OwnerAccountModel.findOne({ email: defaultEmail });

    if (existing) {
        return;
    }

    const { passwordHash, passwordSalt } = hashPassword(defaultPassword);

    await OwnerAccountModel.create({
        email: defaultEmail,
        passwordHash,
        passwordSalt,
        establishmentName: 'Owner Dashboard',
        isAuthenticated: false,
        dashboardData: {
            restaurants: [],
            bookings: [],
            activities: []
        }
    });
}

async function bootstrap() {
    try {
        await connectDB();
        await ensureDefaultOwnerAccount();
        app.listen(port, () => {
            console.log(`Tableau server listening on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start Tableau server', error);
        process.exit(1);
    }
}

bootstrap();
