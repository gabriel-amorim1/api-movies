import { Router } from 'express';

import * as UserController from '../controllers/UserController';

const router = Router();

router.post(
    '/',
    UserController.create,
);

router.get('/', UserController.getAll);

router.get(
    '/:id',
    UserController.findById,
);

export default router;
