import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';
import type { OwnerAccount as OwnerAccountType } from '../types';

const ownerAccountSchema = new Schema<OwnerAccountType>({
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
    establishmentName: {
        type: String,
        default: 'Owner Dashboard'
    },
    isAuthenticated: {
        type: Boolean,
        default: false
    },
    dashboardData: {
        restaurants: { type: [Schema.Types.Mixed], default: [] },
        bookings: { type: [Schema.Types.Mixed], default: [] },
        activities: { type: [Schema.Types.Mixed], default: [] }
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

export const OwnerAccountModel = mongoose.model<OwnerAccountType>('OwnerAccount', ownerAccountSchema);
