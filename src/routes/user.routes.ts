import { Router } from 'express';

import * as UserController from '../controllers/UserController';

const router = Router();

router.post(
    '/',
    UserController.create,
);

export default router;
