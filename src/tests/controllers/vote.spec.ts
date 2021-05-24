import sinon from 'sinon';
import request from 'supertest';
import { container } from 'tsyringe';
import { v4 } from 'uuid';

import jwt from 'jwt-promisify';
import app from '../../app';
import VoteService from '../../services/VoteService';
import VoteBuilder from '../testBuilders/VoteBuilder';
import { authConfig } from '../../config/auth';

describe('Vote Route context', () => {
    let voteServiceSpy: sinon.SinonStubbedInstance<VoteService>;

    beforeEach(() => {
        sinon.restore();
        voteServiceSpy = sinon.createStubInstance(VoteService);
    });

    it('should call create controller with vote data and returns status 201', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        const voteData = new VoteBuilder().withMovieId(v4()).withRating(4).build();

        voteServiceSpy.create.resolves(<any>voteData);
        sinon.stub(container, 'resolve').returns(voteServiceSpy);

        const res = await request(app)
            .post('/api/vote')
            .send(voteData)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(201);
        expect(res.body).toStrictEqual(voteData);
        expect(
            voteServiceSpy.create.calledWithExactly(<any>{
                ...voteData,
                user_id: id,
            }),
        ).toBeTruthy();
    });

    it('should not call create controller and return status 400 when not send params', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        const res = await request(app)
            .post('/api/vote')
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual([
            'rating is a required field',
            'movie_id is a required field',
        ]);
        expect(voteServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should not call create controller and return status 401 when is user is admin', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: true },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        const res = await request(app)
            .post('/api/vote')
            .send({})
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toStrictEqual('Unauthorized');
        expect(voteServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should not call controller create - Token not provided', async () => {
        const res = await request(app).post(`/api/vote`).send({});

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token not provided' });
        expect(voteServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should not call controller create - Token invalid', async () => {
        const res = await request(app)
            .post(`/api/vote`)
            .send({})
            .set('Authorization', `bearer invalidToken`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token invalid' });
        expect(voteServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should call controller findById with id returns status 200', async () => {
        const id = v4();
        const idVote = v4();
        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        voteServiceSpy.findById.resolves(<any>'vote');
        sinon.stub(container, 'resolve').returns(voteServiceSpy);

        const res = await request(app)
            .get(`/api/vote/${idVote}`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual('vote');
        expect(voteServiceSpy.findById.calledWithExactly(idVote)).toBeTruthy();
    });

    it('should not call controller findById and returns 400 when send invalid id', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        const res = await request(app)
            .get(`/api/vote/invalidId`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual(['id must be a valid UUID']);
        expect(voteServiceSpy.findById.notCalled).toBeTruthy();
    });

    it('should not call controller findById - Token not provided', async () => {
        const idVote = v4();

        const res = await request(app).get(`/api/vote/${idVote}`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token not provided' });
        expect(voteServiceSpy.findById.notCalled).toBeTruthy();
    });

    it('should not call controller findById - Token invalid', async () => {
        const idVote = v4();

        const res = await request(app)
            .get(`/api/vote/${idVote}`)
            .set('Authorization', `bearer invalidToken`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token invalid' });
        expect(voteServiceSpy.findById.notCalled).toBeTruthy();
    });

    it('should call controller getAll with id returns status 200', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        voteServiceSpy.getAll.resolves(<any>'votes');
        sinon.stub(container, 'resolve').returns(voteServiceSpy);

        const res = await request(app)
            .get(`/api/vote`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual('votes');
        expect(voteServiceSpy.getAll.calledWithExactly({})).toBeTruthy();
    });

    it('should call update controller with vote data and returns status 200', async () => {
        const id = v4();
        const idVote = v4();

        const updateData = new VoteBuilder().withRating(4).build();

        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        voteServiceSpy.update.resolves(<any>updateData);
        sinon.stub(container, 'resolve').returns(voteServiceSpy);

        const res = await request(app)
            .put(`/api/vote/${idVote}`)
            .send(updateData)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(updateData);
        expect(
            voteServiceSpy.update.calledWithExactly(idVote, {
                ...updateData,
                user_id: id,
            }),
        ).toBeTruthy();
    });

    it('should not call update controller and returns status 401 when user is admin', async () => {
        const id = v4();
        const idVote = v4();

        const updateData = new VoteBuilder().withRating(4).build();

        const token = await jwt.sign(
            { id, is_admin: true },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        voteServiceSpy.update.resolves(<any>updateData);
        sinon.stub(container, 'resolve').returns(voteServiceSpy);

        const res = await request(app)
            .put(`/api/vote/${idVote}`)
            .send(updateData)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toStrictEqual('Unauthorized');
        expect(voteServiceSpy.update.notCalled).toBeTruthy();
    });

    it('should not call controller update and returns 400 when send invalid id', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        const res = await request(app)
            .put(`/api/vote/invalidId`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual(['id must be a valid UUID']);
        expect(voteServiceSpy.update.notCalled).toBeTruthy();
    });

    it('should not call controller update - Token not provided', async () => {
        const idVote = v4();

        const res = await request(app).put(`/api/vote/${idVote}`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token not provided' });
        expect(voteServiceSpy.update.notCalled).toBeTruthy();
    });

    it('should not call controller update - Token invalid', async () => {
        const idVote = v4();

        const res = await request(app)
            .put(`/api/vote/${idVote}`)
            .set('Authorization', `bearer invalidToken`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token invalid' });
        expect(voteServiceSpy.update.notCalled).toBeTruthy();
    });

    it('should call controller remove with id returns status 200', async () => {
        const id = v4();
        const idVote = v4();
        const token = await jwt.sign(
            { id, is_admin: true },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        voteServiceSpy.remove.resolves(<any>'voteData');
        sinon.stub(container, 'resolve').returns(voteServiceSpy);

        const res = await request(app)
            .delete(`/api/vote/${idVote}`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(204);
        expect(
            voteServiceSpy.remove.calledWithExactly(idVote, id, true),
        ).toBeTruthy();
    });

    it('should not call controller remove and returns 400 when send invalid id', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: true },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        const res = await request(app)
            .delete(`/api/vote/invalidId`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual(['id must be a valid UUID']);
        expect(voteServiceSpy.remove.notCalled).toBeTruthy();
    });

    it('should call controller remove - Token not provided', async () => {
        const res = await request(app).delete(`/api/vote`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token not provided' });
        expect(voteServiceSpy.remove.notCalled).toBeTruthy();
    });

    it('should not call controller remove - Token invalid', async () => {
        const res = await request(app)
            .delete(`/api/vote`)
            .set('Authorization', `bearer invalidToken`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token invalid' });
        expect(voteServiceSpy.remove.notCalled).toBeTruthy();
    });
});
