import { Router } from 'express';
import { OwnerAccountModel, hashPassword, verifyPassword } from '../models/OwnerAccount';

const router = Router();

function sanitizeOwnerAccount(ownerAccount: any) {
    const owner = ownerAccount.toObject ? ownerAccount.toObject() : ownerAccount;

    return {
        email: owner.email,
        establishmentName: owner.establishmentName,
        isAuthenticated: owner.isAuthenticated,
        dashboardData: owner.dashboardData,
        createdAt: owner.createdAt,
        updatedAt: owner.updatedAt
    };
}

router.post('/signup', async (req, res, next) => {
    try {
        const { email, password, establishmentName } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const existingAccount = await OwnerAccountModel.findOne({ email: normalizedEmail });

        if (existingAccount) {
            res.status(409).json({ message: 'Owner account already exists.' });
            return;
        }

        const { passwordHash, passwordSalt } = hashPassword(String(password));

        const ownerAccount = await OwnerAccountModel.create({
            email: normalizedEmail,
            passwordHash,
            passwordSalt,
            establishmentName: establishmentName || 'Owner Dashboard',
            isAuthenticated: false,
            dashboardData: {
                restaurants: [],
                bookings: [],
                activities: []
            }
        });

        res.status(201).json(sanitizeOwnerAccount(ownerAccount));
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const ownerAccount = await OwnerAccountModel.findOne({ email: normalizedEmail });

        if (!ownerAccount) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }

        const validPassword = verifyPassword(String(password), ownerAccount.passwordSalt, ownerAccount.passwordHash);

        if (!validPassword) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }

        ownerAccount.isAuthenticated = true;
        await ownerAccount.save();

        res.json(sanitizeOwnerAccount(ownerAccount));
    } catch (error) {
        next(error);
    }
});

router.patch('/:email', async (req, res, next) => {
    try {
        const normalizedEmail = decodeURIComponent(req.params.email).trim().toLowerCase();
        const { establishmentName, dashboardData, isAuthenticated } = req.body;

        const ownerAccount = await OwnerAccountModel.findOne({ email: normalizedEmail });

        if (!ownerAccount) {
            res.status(404).json({ message: 'Owner account not found.' });
            return;
        }

        if (typeof establishmentName === 'string') {
            ownerAccount.establishmentName = establishmentName;
        }

        if (dashboardData) {
            ownerAccount.dashboardData = dashboardData;
        }

        if (typeof isAuthenticated === 'boolean') {
            ownerAccount.isAuthenticated = isAuthenticated;
        }

        await ownerAccount.save();

        res.json(sanitizeOwnerAccount(ownerAccount));
    } catch (error) {
        next(error);
    }
});

export default router;
