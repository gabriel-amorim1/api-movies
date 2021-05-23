import { Request, Response } from 'express';
import { container } from 'tsyringe';
import {
    CreateUserInterface,
    UpdateUserInterface,
    UserRequestGetAllInterface,
} from '../interfaces/UserInterface';
import UserService from '../services/UserService';
import { HttpError } from '../utils/errors/HttpError';
import { ValidationError } from '../utils/errors/ValidationError';
import {
    createUserSchema,
    getAllUserSchema,
    updateUserSchema,
} from '../utils/user/validators';

export const create = async (req: Request, res: Response): Promise<Response> => {
    try {
        const body = (await createUserSchema.validate(req.body, {
            stripUnknown: true,
            abortEarly: false,
        })) as CreateUserInterface;

        const userService = container.resolve(UserService);

        const response = await userService.create(body);

        return res.status(201).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};

export const createUserAdmin = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const body = (await createUserSchema.validate(req.body, {
            stripUnknown: true,
            abortEarly: false,
        })) as CreateUserInterface;

        const userService = container.resolve(UserService);

        const response = await userService.create({ ...body, is_admin: true });

        return res.status(201).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};

export const findById = async (req: Request, res: Response): Promise<Response> => {
    const userService = container.resolve(UserService);
    const response = await userService.findById(req.user.id);

    return res.status(200).json(response);
};

export const getAll = async (req: Request, res: Response): Promise<Response> => {
    const query = (await getAllUserSchema.validate(req.query, {
        stripUnknown: true,
        abortEarly: false,
    })) as UserRequestGetAllInterface;

    const userService = container.resolve(UserService);
    const response = await userService.getAll({ ...query, is_admin: false });

    return res.status(200).json(response);
};

export const getAllAdmin = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    if (req.user.is_admin === false) {
        throw new HttpError(401, 'Unauthorized');
    }

    const query = (await getAllUserSchema.validate(req.query, {
        stripUnknown: true,
        abortEarly: false,
    })) as UserRequestGetAllInterface;

    const userService = container.resolve(UserService);
    const response = await userService.getAll({ ...query, is_admin: true });

    return res.status(200).json(response);
};

export const update = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userUpdate = (await updateUserSchema.validate(req.body, {
            stripUnknown: true,
            abortEarly: false,
        })) as UpdateUserInterface;

        const userService = container.resolve(UserService);
        const response = await userService.update(req.user.id, userUpdate);

        return res.status(200).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};

export const activate = async (req: Request, res: Response): Promise<Response> => {
    const userService = container.resolve(UserService);
    const response = await userService.activate(req.user.id);

    return res.status(200).json(response);
};

export const inactivate = async (req: Request, res: Response): Promise<Response> => {
    const userService = container.resolve(UserService);
    const response = await userService.inactivate(req.user.id);

    return res.status(204).json(response);
};
