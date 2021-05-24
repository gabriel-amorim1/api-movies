import { Request, Response } from 'express';
import { container } from 'tsyringe';
import {
    MovieInterface,
    MovieRequestGetAllInterface,
} from '../interfaces/MovieInterface';
import MovieService from '../services/MovieService';
import { HttpError } from '../utils/errors/HttpError';
import { ValidationError } from '../utils/errors/ValidationError';
import {
    createMovieSchema,
    getAllMovieSchema,
    updateMovieSchema,
} from '../utils/movie/validators';
import { idParamSchema } from '../utils/validators/common';

export const create = async (req: Request, res: Response): Promise<Response> => {
    if (req.user.is_admin === false) {
        throw new HttpError(401, 'Unauthorized');
    }

    try {
        const body = (await createMovieSchema.validate(req.body, {
            stripUnknown: true,
            abortEarly: false,
        })) as MovieInterface;

        const movieService = container.resolve(MovieService);

        const response = await movieService.create(body, req.user.id);

        return res.status(201).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};

export const findById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = await idParamSchema.validate(req.params, {
            stripUnknown: true,
            abortEarly: false,
        });

        const movieService = container.resolve(MovieService);
        const response = await movieService.findById(id);

        return res.status(200).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};

export const getAll = async (req: Request, res: Response): Promise<Response> => {
    const query = (await getAllMovieSchema.validate(req.query, {
        stripUnknown: true,
        abortEarly: false,
    })) as MovieRequestGetAllInterface;

    const movieService = container.resolve(MovieService);
    const response = await movieService.getAll(query);

    return res.status(200).json(response);
};

export const update = async (req: Request, res: Response): Promise<Response> => {
    if (req.user.is_admin === false) {
        throw new HttpError(401, 'Unauthorized');
    }

    try {
        const { id } = await idParamSchema.validate(req.params, {
            stripUnknown: true,
            abortEarly: false,
        });

        const movieUpdate = (await updateMovieSchema.validate(req.body, {
            stripUnknown: true,
            abortEarly: false,
        })) as MovieInterface;

        const movieService = container.resolve(MovieService);
        const response = await movieService.update(id, movieUpdate, req.user.id);

        return res.status(200).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
    if (req.user.is_admin === false) {
        throw new HttpError(401, 'Unauthorized');
    }

    try {
        const { id } = await idParamSchema.validate(req.params, {
            stripUnknown: true,
            abortEarly: false,
        });

        const movieService = container.resolve(MovieService);
        await movieService.remove(id, req.user.id);

        return res.status(204).json();
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};
