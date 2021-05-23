import * as yup from 'yup';
import { getAllRequestSchema } from '../../validators/common';

export const createMovieSchema = yup.object().shape({
    director: yup.string().required(),
    name: yup.string().required(),
    genre: yup.string().required(),
    actors: yup.string().required(),
});

export const updateMovieSchema = yup.object().shape({
    director: yup.string().optional(),
    name: yup.string().optional(),
    genre: yup.string().optional(),
    actors: yup.string().optional(),
});

export const getAllMovieSchema = yup.object().shape({
    ...getAllRequestSchema.fields,
    director: yup.string().optional(),
    name: yup.string().optional(),
    genre: yup.string().optional(),
    actors: yup.string().optional(),
});
