import { Router } from 'express';

import * as UserController from '../controllers/UserController';

const router = Router();

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     tags:
 *       - User and Admin
 *     description: Profile information
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Profile information was returned successfully.
 *         schema:
 *           $ref: '#/definitions/UserOrAdmin'
 */

router.get('/profile', UserController.findById);

/**
 * @swagger
 * /api/user/list:
 *   get:
 *     tags:
 *       - User
 *     description: List all Users
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *       - in: query
 *         name: name
 *         type: string
 *       - in: query
 *         name: email
 *         type: string
 *       - in: query
 *         name: page
 *         type: number
 *       - in: query
 *         name: size
 *         type: number
 *       - in: query
 *         name: sortParam
 *         type: string
 *         enum: [ name, email, created_at, updated_at, is_active]
 *       - in: query
 *         name: sortOrder
 *         type: string
 *         enum: [asc, desc, ASC, DESC]
 *     responses:
 *       '200':
 *         description: A list of Users was returned successfully.
 *         schema:
 *           $ref: '#/definitions/UserOrAdminGetAll'
 */

router.get('/list', UserController.getAll);

/**
 * @swagger
 * /api/user/list/admin:
 *   get:
 *     tags:
 *       - Admin
 *     description: List all Admin
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *       - in: query
 *         name: name
 *         type: string
 *       - in: query
 *         name: email
 *         type: string
 *       - in: query
 *         name: page
 *         type: number
 *       - in: query
 *         name: size
 *         type: number
 *       - in: query
 *         name: sortParam
 *         type: string
 *         enum: [ name, email, created_at, updated_at, is_active]
 *       - in: query
 *         name: sortOrder
 *         type: string
 *         enum: [asc, desc, ASC, DESC]
 *     responses:
 *       '200':
 *         description: A list of Admin was returned successfully.
 *         schema:
 *           $ref: '#/definitions/UserOrAdminGetAll'
 */

router.get('/list/admin', UserController.getAllAdmin);

/**
 * @swagger
 * /api/user/:
 *   put:
 *     tags:
 *       - User and Admin
 *     description: Update User or Admin
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *       - name: UserOrAdmin
 *         description: JSON with User or Admin attributes.
 *         in: body
 *         schema:
 *            $ref: '#/definitions/UserOrAdminUpdate'
 *     responses:
 *       '200':
 *         description: User or Admin was updated successfully.
 *         schema:
 *           $ref: '#/definitions/UserOrAdmin'
 */

router.put('/', UserController.update);

/**
 * @swagger
 * /api/user/activate:
 *   patch:
 *     tags:
 *       - User and Admin
 *     description: Activate User or Admin
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: User or Admin was activated successfully.
 */

router.patch('/activate', UserController.activate);

/**
 * @swagger
 * /api/user/inactivate:
 *   patch:
 *     tags:
 *       - User and Admin
 *     description: Inactivate User or Admin
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: User or Admin was inactivated successfully.
 */

router.patch('/inactivate', UserController.inactivate);

export default router;
