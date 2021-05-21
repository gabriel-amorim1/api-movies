import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateUserInterface, UpdateUserInterface, UserRequestGetAllInterface } from '../interfaces/UserInterface';
import UserService from '../services/UserService';
import { ValidationError } from '../utils/errors/ValidationError';
import { createUserSchema, updateUserSchema } from '../utils/user/validators';
import { idSchema } from '../utils/validators/common';

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

export const findById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = await idSchema.validate(req.params, {
            stripUnknown: true,
        });

        const userService = container.resolve(UserService);
        const response = await userService.findById(id);

        return res.status(200).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};

export const getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
        const query = (await updateUserSchema.validate(req.query, {
            stripUnknown: true,
        })) as UserRequestGetAllInterface;

        const userService = container.resolve(UserService);
        const response = await userService.getAll(query);

        return res.status(200).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};

export const update = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = await idSchema.validate(req.params, {
            stripUnknown: true,
        });

        const userUpdate = (await updateUserSchema.validate(req.body, {
            stripUnknown: true,
        })) as UpdateUserInterface;

        const userService = container.resolve(UserService);
        const response = await userService.update(id, userUpdate);

        return res.status(200).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};

export const activate = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = await idSchema.validate(req.params, {
            stripUnknown: true,
        });

        const userService = container.resolve(UserService);
        const response = await userService.activate(id);

        return res.status(200).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};

export const inactivate = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = await idSchema.validate(req.params, {
            stripUnknown: true,
        });

        const userService = container.resolve(UserService);
        const response = await userService.inactivate(id);

        return res.status(204).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};
