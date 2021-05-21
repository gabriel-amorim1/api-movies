import { Request, Response, Router } from 'express';

import apiUser from './user.routes';
import * as UserController from '../controllers/UserController';
import authMiddleware from '../utils/middleware/auth';
import apiSession from './session.routes';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('API Movies 1.0.0');
});

router.post(
    '/api/user/',
    UserController.create,
);

router.use('/api/sessions', apiSession);

router.use(authMiddleware);

router.use('/api/user', apiUser);

export default router;
