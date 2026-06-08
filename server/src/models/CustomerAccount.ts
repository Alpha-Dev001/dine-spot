import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';
import type { CustomerAccount as CustomerAccountType } from '../types';

const customerAccountSchema = new Schema<CustomerAccountType>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    passwordSalt: {
        type: String,
        required: true
    },
    isAuthenticated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export function hashPassword(password: string): { passwordHash: string; passwordSalt: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return { passwordHash, passwordSalt: salt };
}

export function verifyPassword(password: string, passwordSalt: string, passwordHash: string): boolean {
    const candidateHash = crypto.pbkdf2Sync(password, passwordSalt, 100000, 64, 'sha512').toString('hex');
    return candidateHash === passwordHash;
}

export const CustomerAccountModel = mongoose.model<CustomerAccountType>('CustomerAccount', customerAccountSchema);

