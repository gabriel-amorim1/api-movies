import { Router } from 'express';

import * as UserController from '../controllers/UserController';

const router = Router();

router.get('/', UserController.getAll);

router.get(
    '/:id',
    UserController.findById,
);

router.put(
    '/:id',
    UserController.update,
);

router.patch(
    '/activate/:id',
    UserController.activate,
);

router.patch(
    '/inactivate/:id',
    UserController.inactivate,
);

export default router;
