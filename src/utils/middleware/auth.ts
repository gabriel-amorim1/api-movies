/* eslint-disable @typescript-eslint/no-unused-vars */
import { verify } from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';

interface ITokenPayload {
    iat: number;
    exp: number;
    id: string;
    is_admin: boolean;
}

export default async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void | Response> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const [scheme, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, process.env.APP_SECRET!);

        const { id, is_admin } = decoded as ITokenPayload;

        req.user = { id, is_admin };

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalid' });
    }
};
