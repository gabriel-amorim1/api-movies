import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('API Movies 1.0.0');
});

export default router;
