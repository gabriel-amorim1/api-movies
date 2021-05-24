import { Request, Response } from 'express';
import { container } from 'tsyringe';
import {
    VoteInterface,
    VoteRequestGetAllInterface,
} from '../interfaces/VoteInterface';
import VoteService from '../services/VoteService';
import { HttpError } from '../utils/errors/HttpError';
import { ValidationError } from '../utils/errors/ValidationError';
import { idParamSchema } from '../utils/validators/common';
import {
    createVoteSchema,
    getAllVoteSchema,
    updateVoteSchema,
} from '../utils/vote/validators';

export const create = async (req: Request, res: Response): Promise<Response> => {
    if (req.user.is_admin === true) {
        throw new HttpError(401, 'Unauthorized');
    }

    try {
        const body = {
            ...(await createVoteSchema.validate(req.body, {
                stripUnknown: true,
                abortEarly: false,
            })),
            user_id: req.user.id,
        } as VoteInterface;

        const voteService = container.resolve(VoteService);

        const response = await voteService.create(body);

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

        const voteService = container.resolve(VoteService);
        const response = await voteService.findById(id);

        return res.status(200).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};

export const getAll = async (req: Request, res: Response): Promise<Response> => {
    const query = (await getAllVoteSchema.validate(req.query, {
        stripUnknown: true,
        abortEarly: false,
    })) as VoteRequestGetAllInterface;

    const voteService = container.resolve(VoteService);
    const response = await voteService.getAll(query);

    return res.status(200).json(response);
};

export const update = async (req: Request, res: Response): Promise<Response> => {
    if (req.user.is_admin === true) {
        throw new HttpError(401, 'Unauthorized');
    }

    try {
        const { id } = await idParamSchema.validate(req.params, {
            stripUnknown: true,
            abortEarly: false,
        });

        const voteUpdate = {
            ...(await updateVoteSchema.validate(req.body, {
                stripUnknown: true,
                abortEarly: false,
            })),
            user_id: req.user.id,
        } as VoteInterface;

        const voteService = container.resolve(VoteService);
        const response = await voteService.update(id, voteUpdate);

        return res.status(200).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = await idParamSchema.validate(req.params, {
            stripUnknown: true,
            abortEarly: false,
        });

        const voteService = container.resolve(VoteService);
        await voteService.remove(id, req.user.id, req.user.is_admin);

        return res.status(204).json();
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};
