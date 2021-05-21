import { verify } from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';

interface ITokenPayload {
    iat: number;
    exp: number;
    id: string;
}

export default async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void | Response> => {
    if (
        process.env.ENVIRONMENT === 'PRODUCTION' ||
        process.env.ENVIRONMENT === 'DEV'
    ) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Token not provided' });
        }

        const [scheme, token] = authHeader.split(' ');

        try {
            const decoded = verify(token, process.env.APP_SECRET!);

            const { id } = decoded as ITokenPayload;

            req.user = { id };

            return next();
        } catch (err) {
            return res.status(401).json({ error: 'Token invalid' });
        }
    } else {
        req.user = { id: v4() };

        return next();
    }
};
