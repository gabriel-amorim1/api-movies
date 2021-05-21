import { Response, Request } from 'express';
import { container } from 'tsyringe';
import SessionService from '../services/SessionService';

export const create = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    const sessionService = container.resolve(SessionService);
    const response = await sessionService.create(email, password);

    return res.status(201).json(response);
};
