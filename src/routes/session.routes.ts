import { Router } from 'express';

import * as SessionController from '../controllers/SessionController';

const routes = Router();

routes.post('/', SessionController.create);

export default routes;
