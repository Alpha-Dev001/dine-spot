import { Router } from 'express';
import { LiveActivityModel } from '../models/LiveActivity';

const router = Router();

router.get('/', async (_req, res, next) => {
    try {
        const activities = await LiveActivityModel.find().sort({ createdAt: -1 });
        res.json(activities);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const activity = await LiveActivityModel.create(req.body);
        res.status(201).json(activity);
    } catch (error) {
        next(error);
    }
});

export default router;
