import { Request, Response, Router } from 'express';

import * as swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../swagger';
import apiUser from './user.routes';
import * as UserController from '../controllers/UserController';
import authMiddleware from '../utils/middleware/auth';
import apiSession from './session.routes';
import apiMovie from './movie.routes';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('API Movies 1.0.0');
});

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/admin:
 *   post:
 *     tags:
 *       - Admin
 *     description: Create new Admin
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Admin
 *         description: JSON with Admin attributes.
 *         in: body
 *         required: true
 *         schema:
 *            $ref: '#/definitions/UserOrAdminCreate'
 *     responses:
 *       '201':
 *         description: Admin was created successfully.
 *         schema:
 *           $ref: '#/definitions/UserOrAdmin'
 */

router.post('/api/admin/', UserController.createUserAdmin);

/**
 * @swagger
 * /api/user:
 *   post:
 *     tags:
 *       - User
 *     description: Create new User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: User
 *         description: JSON with User attributes.
 *         in: body
 *         required: true
 *         schema:
 *            $ref: '#/definitions/UserOrAdminCreate'
 *     responses:
 *       '201':
 *         description: User was created successfully.
 *         schema:
 *           $ref: '#/definitions/UserOrAdmin'
 */

router.post('/api/user/', UserController.create);

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     tags:
 *       - Session
 *     description: Create new Session
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session
 *         description: JSON with Session attributes.
 *         in: body
 *         required: true
 *         schema:
 *            $ref: '#/definitions/SessionCreate'
 *     responses:
 *       '201':
 *         description: Session was created successfully.
 *         schema:
 *           $ref: '#/definitions/Session'
 */

router.use('/api/sessions', apiSession);

router.use(authMiddleware);

router.use('/api/user', apiUser);
router.use('/api/movie', apiMovie);

export default router;
