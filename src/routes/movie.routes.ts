import { Router } from 'express';

import * as MovieController from '../controllers/MovieController';

const router = Router();

/**
 * @swagger
 * /api/movie:
 *   post:
 *     tags:
 *       - Movie
 *     description: Create new Movie
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *       - name: Movie
 *         description: JSON with Movie attributes.
 *         in: body
 *         required: true
 *         schema:
 *            $ref: '#/definitions/MovieCreate'
 *     responses:
 *       '201':
 *         description: Movie was created successfully.
 *         schema:
 *           $ref: '#/definitions/Movie'
 */

router.post('/', MovieController.create);

/**
 * @swagger
 * /api/movie:
 *   get:
 *     tags:
 *       - Movie
 *     description: List all Movies
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *       - in: query
 *         name: director
 *         type: string
 *       - in: query
 *         name: name
 *         type: string
 *       - in: query
 *         name: genre
 *         type: string
 *       - in: query
 *         name: actors
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
 *         enum: [ director, name, genre, actors, created_at, updated_at, is_active]
 *       - in: query
 *         name: sortOrder
 *         type: string
 *         enum: [asc, desc, ASC, DESC]
 *     responses:
 *       '200':
 *         description: A list of Movies was returned successfully.
 *         schema:
 *           $ref: '#/definitions/MovieGetAll'
 */

router.get('/', MovieController.getAll);

/**
 * @swagger
 * /api/movie/:movieId:
 *   get:
 *     tags:
 *       - Movie
 *     description: Find Movie by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *       - in: path
 *         name: movieId
 *         type: uuid
 *         required: true
 *     responses:
 *       '200':
 *         description: Movie was returned successfully.
 *         schema:
 *           $ref: '#/definitions/Movie'
 */

router.get('/:id', MovieController.findById);

/**
 * @swagger
 * /api/movie/:movieId:
 *   put:
 *     tags:
 *       - Movie
 *     description: Update Movie
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *       - in: path
 *         name: movieId
 *         type: uuid
 *         required: true
 *       - name: Movie
 *         description: JSON with Movie attributes.
 *         in: body
 *         schema:
 *            $ref: '#/definitions/MovieUpdate'
 *     responses:
 *       '200':
 *         description: Movie was updated successfully.
 *         schema:
 *           $ref: '#/definitions/Movie'
 */

router.put('/:id', MovieController.update);

/**
 * @swagger
 * /api/user/:movieId:
 *   delete:
 *     tags:
 *       - Movie
 *     description: Remove Movie
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *       - in: path
 *         name: movieId
 *         type: uuid
 *         required: true
 *     responses:
 *       '204':
 *         description: Movie was removed successfully.
 */

router.delete('/:id', MovieController.remove);

export default router;
