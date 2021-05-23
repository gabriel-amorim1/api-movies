import { Router } from 'express';

import * as UserController from '../controllers/UserController';

const router = Router();

router.get('/profile', UserController.findById);

router.get('/list', UserController.getAll);

router.get('/list/admin', UserController.getAllAdmin);

router.put('/', UserController.update);

router.patch('/activate', UserController.activate);

router.patch('/inactivate', UserController.inactivate);

export default router;
