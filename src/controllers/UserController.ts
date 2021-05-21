import { Response, Request } from 'express';
import { container } from 'tsyringe';
import UserService from '../services/UserService';

export const create = async (req: Request, res: Response): Promise<Response> => {
    const userService = container.resolve(UserService);

    const response = await userService.create(req.body);

    return res.status(201).json(response);
};
