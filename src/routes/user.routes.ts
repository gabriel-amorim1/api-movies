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

router.put(
    '/:id',
    UserController.update,
);

export default router;
