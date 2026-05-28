import { Router } from 'express';
import { BookingModel } from '../models/Booking';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const restaurantId = typeof req.query.restaurantId === 'string' ? req.query.restaurantId : undefined;
        const bookings = await BookingModel.find(restaurantId ? { restaurantId } : {}).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const booking = await BookingModel.create(req.body);
        res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['seated', 'confirmed', 'arriving', 'canceled'].includes(status)) {
            res.status(400).json({ message: 'Invalid status provided' });
            return;
        }

        const booking = await BookingModel.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });

        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        res.json(booking);
    } catch (error) {
        next(error);
    }
});

export default router;
