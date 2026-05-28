import { Router } from 'express';
import { RestaurantModel } from '../models/Restaurant';

const router = Router();

router.get('/', async (_req, res, next) => {
    try {
        const restaurants = await RestaurantModel.find().sort({ name: 1 });
        res.json(restaurants);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const restaurant = await RestaurantModel.findOne({ id: req.params.id });

        if (!restaurant) {
            res.status(404).json({ message: 'Restaurant not found' });
            return;
        }

        res.json(restaurant);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const restaurant = await RestaurantModel.create(req.body);
        res.status(201).json(restaurant);
    } catch (error) {
        next(error);
    }
});

export default router;
