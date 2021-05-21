import { Request, Response, Router } from 'express';

import apiUser from './user.routes';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('API Movies 1.0.0');
});

router.use('/api/user', apiUser);

export default router;
