import * as yup from 'yup';
import { getAllRequestSchema } from '../../validators/common';

export const createVoteSchema = yup.object().shape({
    rating: yup.number().min(0).max(4).required(),
    movie_id: yup.string().uuid().required(),
});

export const updateVoteSchema = yup.object().shape({
    rating: yup.number().min(0).max(4).required(),
});

export const getAllVoteSchema = yup.object().shape({
    ...getAllRequestSchema.fields,
    movie_id: yup.string().optional(),
    user_id: yup.string().optional(),
    rating: yup.string().optional(),
});
