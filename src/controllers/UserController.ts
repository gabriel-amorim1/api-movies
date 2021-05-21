import { Response, Request } from 'express';
import { container } from 'tsyringe';
import UserService from '../services/UserService';

export const create = async (req: Request, res: Response): Promise<Response> => {
    const userService = container.resolve(UserService);

    const response = await userService.create(req.body);

    return res.status(201).json(response);
};

export const findById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const userService = container.resolve(UserService);
    const response = await userService.findById(id);

    return res.status(200).json(response);
};

export const getAll = async (req: Request, res: Response): Promise<Response> => {
    const userService = container.resolve(UserService);
    const response = await userService.getAll(req.query);

    return res.status(200).json(response);
};
