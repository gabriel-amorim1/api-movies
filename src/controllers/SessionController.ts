import { Response, Request } from 'express';
import { container } from 'tsyringe';
import SessionService from '../services/SessionService';
import { ValidationError } from '../utils/errors/ValidationError';
import { sessionValidation } from '../utils/session/validators/validator';

export const create = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = await sessionValidation.validate(req.body, {
            stripUnknown: true,
            abortEarly: false,
        });

        const sessionService = container.resolve(SessionService);
        const response = await sessionService.create(email, password);

        return res.status(201).json(response);
    } catch (error) {
        throw new ValidationError(error.errors, 400, error.message);
    }
};
