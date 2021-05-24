import { Router } from 'express';
import * as VoteController from '../controllers/VoteController';

const router = Router();

/**
 * @swagger
 * /api/vote:
 *   post:
 *     tags:
 *       - Vote
 *     description: Create new Vote
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *       - name: Vote
 *         description: JSON with Vote attributes.
 *         in: body
 *         required: true
 *         schema:
 *            $ref: '#/definitions/VoteCreate'
 *     responses:
 *       '201':
 *         description: Vote was created successfully.
 *         schema:
 *           $ref: '#/definitions/Vote'
 */

router.post('/', VoteController.create);

/**
 * @swagger
 * /api/vote:
 *   get:
 *     tags:
 *       - Vote
 *     description: List all Votes
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
 *         description: A list of Votes was returned successfully.
 *         schema:
 *           $ref: '#/definitions/VoteGetAll'
 */

router.get('/', VoteController.getAll);

/**
 * @swagger
 * /api/vote/:voteId:
 *   get:
 *     tags:
 *       - Vote
 *     description: Find Vote by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *       - in: path
 *         name: voteId
 *         type: uuid
 *         required: true
 *     responses:
 *       '200':
 *         description: Vote was returned successfully.
 *         schema:
 *           $ref: '#/definitions/Vote'
 */

router.get('/:id', VoteController.findById);

/**
 * @swagger
 * /api/vote/:voteId:
 *   put:
 *     tags:
 *       - Vote
 *     description: Update Vote
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *       - in: path
 *         name: voteId
 *         type: uuid
 *         required: true
 *       - name: Vote
 *         description: JSON with Vote attributes.
 *         in: body
 *         schema:
 *            $ref: '#/definitions/VoteUpdate'
 *     responses:
 *       '200':
 *         description: Vote was updated successfully.
 *         schema:
 *           $ref: '#/definitions/Vote'
 */

router.put('/:id', VoteController.update);

/**
 * @swagger
 * /api/vote/:voteId:
 *   delete:
 *     tags:
 *       - Vote
 *     description: Remove Vote
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *       - in: path
 *         name: voteId
 *         type: uuid
 *         required: true
 *     responses:
 *       '204':
 *         description: Vote was removed successfully.
 */

router.delete('/:id', VoteController.remove);

export default router;
