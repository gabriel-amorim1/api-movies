import sinon from 'sinon';
import request from 'supertest';
import { container } from 'tsyringe';
import { v4 } from 'uuid';

import jwt from 'jwt-promisify';
import app from '../../app';
import MovieService from '../../services/MovieService';
import MovieBuilder from '../testBuilders/MovieBuilder';
import { authConfig } from '../../config/auth';

describe('Movie Route context', () => {
    let movieServiceSpy: sinon.SinonStubbedInstance<MovieService>;

    beforeEach(() => {
        sinon.restore();
        movieServiceSpy = sinon.createStubInstance(MovieService);
    });

    it('should call create controller with movie data and returns status 201', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: true },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        const movieData = new MovieBuilder()
            .withDirector('director')
            .withName('name')
            .withGenre('genre')
            .withActors('actors')
            .build();

        movieServiceSpy.create.resolves(<any>movieData);
        sinon.stub(container, 'resolve').returns(movieServiceSpy);

        const res = await request(app)
            .post('/api/movie')
            .send(movieData)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(201);
        expect(res.body).toStrictEqual(movieData);
        expect(
            movieServiceSpy.create.calledWithExactly(<any>movieData, id),
        ).toBeTruthy();
    });

    it('should not call create controller and return status 400 when not send params', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: true },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        const res = await request(app)
            .post('/api/movie')
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual([
            'director is a required field',
            'name is a required field',
            'genre is a required field',
            'actors is a required field',
        ]);
        expect(movieServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should not call create controller and return status 401 when is user is not admin', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        const res = await request(app)
            .post('/api/movie')
            .send({})
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toStrictEqual('Unauthorized');
        expect(movieServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should not call controller create - Token not provided', async () => {
        const res = await request(app).post(`/api/movie`).send({});

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token not provided' });
        expect(movieServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should not call controller create - Token invalid', async () => {
        const res = await request(app)
            .post(`/api/movie`)
            .send({})
            .set('Authorization', `bearer invalidToken`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token invalid' });
        expect(movieServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should call controller findById with id returns status 200', async () => {
        const id = v4();
        const idMovie = v4();
        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        movieServiceSpy.findById.resolves(<any>'movie');
        sinon.stub(container, 'resolve').returns(movieServiceSpy);

        const res = await request(app)
            .get(`/api/movie/${idMovie}`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual('movie');
        expect(movieServiceSpy.findById.calledWithExactly(idMovie)).toBeTruthy();
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
            .get(`/api/movie/invalidId`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual(['id must be a valid UUID']);
        expect(movieServiceSpy.findById.notCalled).toBeTruthy();
    });

    it('should not call controller findById - Token not provided', async () => {
        const idMovie = v4();

        const res = await request(app).get(`/api/movie/${idMovie}`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token not provided' });
        expect(movieServiceSpy.findById.notCalled).toBeTruthy();
    });

    it('should not call controller findById - Token invalid', async () => {
        const idMovie = v4();

        const res = await request(app)
            .get(`/api/movie/${idMovie}`)
            .set('Authorization', `bearer invalidToken`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token invalid' });
        expect(movieServiceSpy.findById.notCalled).toBeTruthy();
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

        movieServiceSpy.getAll.resolves(<any>'movies');
        sinon.stub(container, 'resolve').returns(movieServiceSpy);

        const res = await request(app)
            .get(`/api/movie`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual('movies');
        expect(movieServiceSpy.getAll.calledWithExactly({})).toBeTruthy();
    });

    it('should call update controller with movie data and returns status 200', async () => {
        const id = v4();
        const idMovie = v4();

        const updateData = new MovieBuilder()
            .withDirector('director')
            .withName('name')
            .withGenre('genre')
            .withActors('actors')
            .build();

        const token = await jwt.sign(
            { id, is_admin: true },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        movieServiceSpy.update.resolves(<any>updateData);
        sinon.stub(container, 'resolve').returns(movieServiceSpy);

        const res = await request(app)
            .put(`/api/movie/${idMovie}`)
            .send(updateData)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(updateData);
        expect(
            movieServiceSpy.update.calledWithExactly(idMovie, updateData, id),
        ).toBeTruthy();
    });

    it('should not call update controller and returns status 401 when user is not admin', async () => {
        const id = v4();
        const idMovie = v4();

        const updateData = new MovieBuilder()
            .withDirector('director')
            .withName('name')
            .withGenre('genre')
            .withActors('actors')
            .build();

        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        movieServiceSpy.update.resolves(<any>updateData);
        sinon.stub(container, 'resolve').returns(movieServiceSpy);

        const res = await request(app)
            .put(`/api/movie/${idMovie}`)
            .send(updateData)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toStrictEqual('Unauthorized');
        expect(movieServiceSpy.update.notCalled).toBeTruthy();
    });

    it('should not call controller update and returns 400 when send invalid id', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: true },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        const res = await request(app)
            .put(`/api/movie/invalidId`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual(['id must be a valid UUID']);
        expect(movieServiceSpy.update.notCalled).toBeTruthy();
    });

    it('should not call controller update - Token not provided', async () => {
        const idMovie = v4();

        const res = await request(app).put(`/api/movie/${idMovie}`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token not provided' });
        expect(movieServiceSpy.update.notCalled).toBeTruthy();
    });

    it('should not call controller update - Token invalid', async () => {
        const idMovie = v4();

        const res = await request(app)
            .put(`/api/movie/${idMovie}`)
            .set('Authorization', `bearer invalidToken`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token invalid' });
        expect(movieServiceSpy.update.notCalled).toBeTruthy();
    });

    it('should call controller remove with id returns status 200', async () => {
        const id = v4();
        const idMovie = v4();
        const token = await jwt.sign(
            { id, is_admin: true },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        movieServiceSpy.remove.resolves(<any>'movieData');
        sinon.stub(container, 'resolve').returns(movieServiceSpy);

        const res = await request(app)
            .delete(`/api/movie/${idMovie}`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(204);
        expect(movieServiceSpy.remove.calledWithExactly(idMovie, id)).toBeTruthy();
    });

    it('should not call controller remove and returns status 401 when user is not admin', async () => {
        const id = v4();
        const idMovie = v4();
        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        movieServiceSpy.remove.resolves(<any>'movieData');
        sinon.stub(container, 'resolve').returns(movieServiceSpy);

        const res = await request(app)
            .delete(`/api/movie/${idMovie}`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toStrictEqual('Unauthorized');
        expect(movieServiceSpy.remove.notCalled).toBeTruthy();
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
            .delete(`/api/movie/invalidId`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual(['id must be a valid UUID']);
        expect(movieServiceSpy.remove.notCalled).toBeTruthy();
    });

    it('should call controller remove - Token not provided', async () => {
        const res = await request(app).delete(`/api/movie`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token not provided' });
        expect(movieServiceSpy.remove.notCalled).toBeTruthy();
    });

    it('should not call controller remove - Token invalid', async () => {
        const res = await request(app)
            .delete(`/api/movie`)
            .set('Authorization', `bearer invalidToken`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token invalid' });
        expect(movieServiceSpy.remove.notCalled).toBeTruthy();
    });
});
