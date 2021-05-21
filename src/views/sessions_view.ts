import jwt from 'jwt-promisify';
import { authConfig } from '../config/auth';
import User from '../database/entities/User';
import { SessionResponseInterface } from '../interfaces/SessionInterface';

export const render = async (
    user: User,
): Promise<SessionResponseInterface> => {
    return {
        user: {
            id: user.id!,
            name: user.name,
            email: user.email,
        },

        token: await jwt.sign({ id: user.id }, process.env.APP_SECRET!, {
            expiresIn: authConfig.expiresIn,
        }),
    };
};
