import { Router } from 'express';
import { CustomerAccountModel, hashPassword, verifyPassword } from '../models/CustomerAccount';

const router = Router();

function sanitizeCustomerAccount(customerAccount: any) {
    const c = customerAccount.toObject ? customerAccount.toObject() : customerAccount;
    return {
        email: c.email,
        isAuthenticated: c.isAuthenticated,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
    };
}

router.post('/signup', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const existingAccount = await CustomerAccountModel.findOne({ email: normalizedEmail });

        if (existingAccount) {
            res.status(409).json({ message: 'Customer account already exists.' });
            return;
        }

        const { passwordHash, passwordSalt } = hashPassword(String(password));

        const customerAccount = await CustomerAccountModel.create({
            email: normalizedEmail,
            passwordHash,
            passwordSalt,
            isAuthenticated: true
        });

        res.status(201).json(sanitizeCustomerAccount(customerAccount));
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
        const customerAccount = await CustomerAccountModel.findOne({ email: normalizedEmail });

        if (!customerAccount) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }

        const validPassword = verifyPassword(String(password), customerAccount.passwordSalt, customerAccount.passwordHash);

        if (!validPassword) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }

        customerAccount.isAuthenticated = true;
        await customerAccount.save();

        res.json(sanitizeCustomerAccount(customerAccount));
    } catch (error) {
        next(error);
    }
});

router.patch('/:email', async (req, res, next) => {
    try {
        const normalizedEmail = decodeURIComponent(req.params.email).trim().toLowerCase();
        const { isAuthenticated } = req.body;

        const customerAccount = await CustomerAccountModel.findOne({ email: normalizedEmail });
        if (!customerAccount) {
            res.status(404).json({ message: 'Customer account not found.' });
            return;
        }

        if (typeof isAuthenticated === 'boolean') {
            customerAccount.isAuthenticated = isAuthenticated;
        }

        await customerAccount.save();

        res.json(sanitizeCustomerAccount(customerAccount));
    } catch (error) {
        next(error);
    }
});

export default router;

