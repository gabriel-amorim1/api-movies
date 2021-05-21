import * as yup from 'yup';
import { getAllRequestSchema } from '../../validators/common';

export const createUserSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
});

export const updateUserSchema = yup.object().shape({
    name: yup.string().optional(),
    email: yup.string().email().optional(),
    password: yup.string().min(6).optional(),
});

export const getAllUserSchema = yup.object().shape({
    ...getAllRequestSchema.fields,
    name: yup.string().optional(),
    email: yup.string().optional(),
});
