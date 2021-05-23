import sinon from 'sinon';
import request from 'supertest';
import { container } from 'tsyringe';
import { v4 } from 'uuid';

import jwt from 'jwt-promisify';
import app from '../../app';
import UserService from '../../services/UserService';
import UserBuilder from '../testBuilders/UserBuilder';
import { authConfig } from '../../config/auth';

describe('User Route context', () => {
    let userServiceSpy: sinon.SinonStubbedInstance<UserService>;

    beforeEach(() => {
        sinon.restore();
        userServiceSpy = sinon.createStubInstance(UserService);
    });

    it('should be call create controller with user data and returns status 201', async () => {
        const userData = new UserBuilder()
            .withName('Gabriel')
            .withEmail('gabriel@teste.com')
            .withPassword('123456')
            .build();

        userServiceSpy.create.resolves(<any>userData);
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app).post('/api/user').send(userData);

        expect(res.status).toBe(201);
        expect(res.body).toStrictEqual(userData);
        expect(userServiceSpy.create.calledWithExactly(<any>userData)).toBeTruthy();
    });

    it('should not call create controller and return status 400 when send invalid params', async () => {
        const userData = new UserBuilder()
            .withName(<any>123)
            .withEmail(<any>123)
            .withPassword(<any>123)
            .build();

        const token = await jwt.sign(
            { id: v4(), is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        const res = await request(app)
            .post('/api/user')
            .send(userData)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual([
            'email must be a valid email',
            'password must be at least 6 characters',
        ]);
        expect(userServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should not call create controller and return status 400 when not send params', async () => {
        const res = await request(app).post('/api/user');

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual([
            'name is a required field',
            'email is a required field',
            'password is a required field',
        ]);
        expect(userServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should be call create controller by admin route and returns status 201', async () => {
        const userData = new UserBuilder()
            .withName('Gabriel')
            .withEmail('gabriel@teste.com')
            .withPassword('123456')
            .build();

        userServiceSpy.create.resolves(<any>userData);
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app).post('/api/admin').send(userData);

        expect(res.status).toBe(201);
        expect(res.body).toStrictEqual(userData);
        expect(
            userServiceSpy.create.calledWithExactly({ ...userData, is_admin: true }),
        ).toBeTruthy();
    });

    it('should not call create controller by admin route and return status 400 when not send params', async () => {
        const res = await request(app).post('/api/admin');

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual([
            'name is a required field',
            'email is a required field',
            'password is a required field',
        ]);
        expect(userServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should be call controller findById with id returns status 200', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        userServiceSpy.findById.resolves(<any>'user');
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app)
            .get(`/api/user/profile`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual('user');
        expect(userServiceSpy.findById.calledWithExactly(id)).toBeTruthy();
    });

    it('should not call controller findById - Token not provided', async () => {
        const res = await request(app).get(`/api/user/profile`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token not provided' });
        expect(userServiceSpy.findById.notCalled).toBeTruthy();
    });

    it('should not call controller findById - Token invalid', async () => {
        const res = await request(app)
            .get(`/api/user/profile`)
            .set('Authorization', `bearer invalidToken`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token invalid' });
        expect(userServiceSpy.findById.notCalled).toBeTruthy();
    });

    it('should be call controller getAll with id returns status 200', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        userServiceSpy.getAll.resolves(<any>'users');
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app)
            .get(`/api/user/list`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual('users');
        expect(
            userServiceSpy.getAll.calledWithExactly({ is_admin: false }),
        ).toBeTruthy();
    });

    it('should be call controller getAll by admin route with id returns status 200', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: true },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        userServiceSpy.getAll.resolves(<any>'users');
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app)
            .get(`/api/user/list/admin`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual('users');
        expect(
            userServiceSpy.getAll.calledWithExactly({ is_admin: true }),
        ).toBeTruthy();
    });

    it('should not call controller getAll by admin route - Unauthorized', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        userServiceSpy.getAll.resolves(<any>'users');
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app)
            .get(`/api/user/list/admin`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(401);
        expect(res.body.message).toStrictEqual('Unauthorized');
        expect(userServiceSpy.getAll.notCalled).toBeTruthy();
    });

    it('should be call update controller with user data and returns status 200', async () => {
        const id = v4();

        const updateData = new UserBuilder()
            .withName('Gabriel')
            .withEmail('gabriel@update.com')
            .withPassword('password')
            .build();

        const token = await jwt.sign(
            { id, is_admin: true },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        userServiceSpy.update.resolves(<any>updateData);
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app)
            .put(`/api/user`)
            .send(updateData)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(updateData);
        expect(userServiceSpy.update.calledWithExactly(id, updateData)).toBeTruthy();
    });

    it('should not call update controller and return status 400 when send invalid params', async () => {
        const updateData = new UserBuilder()
            .withName(<any>123)
            .withEmail(<any>123)
            .withPassword(<any>123)
            .build();

        const token = await jwt.sign(
            { id: v4(), is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        const res = await request(app)
            .put('/api/user')
            .send(updateData)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual([
            'email must be a valid email',
            'password must be at least 6 characters',
        ]);
        expect(userServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should not call controller update - Token not provided', async () => {
        const res = await request(app).put(`/api/user`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token not provided' });
        expect(userServiceSpy.update.notCalled).toBeTruthy();
    });

    it('should not call controller update - Token invalid', async () => {
        const res = await request(app)
            .put(`/api/user`)
            .set('Authorization', `bearer invalidToken`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token invalid' });
        expect(userServiceSpy.update.notCalled).toBeTruthy();
    });

    it('should be call controller activate with id returns status 200', async () => {
        const id = v4();

        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        userServiceSpy.activate.resolves(<any>'userData');
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app)
            .patch(`/api/user/activate`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(200);
        expect(userServiceSpy.activate.calledWithExactly(id)).toBeTruthy();
    });

    it('should not call controller activate - Token not provided', async () => {
        const res = await request(app).put(`/api/user/activate`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token not provided' });
        expect(userServiceSpy.activate.notCalled).toBeTruthy();
    });

    it('should not call controller activate - Token invalid', async () => {
        const res = await request(app)
            .put(`/api/user/activate`)
            .set('Authorization', `bearer invalidToken`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token invalid' });
        expect(userServiceSpy.activate.notCalled).toBeTruthy();
    });

    it('should be call controller inactivate with id returns status 200', async () => {
        const id = v4();
        const token = await jwt.sign(
            { id, is_admin: false },
            process.env.APP_SECRET!,
            {
                expiresIn: authConfig.expiresIn,
            },
        );

        userServiceSpy.inactivate.resolves(<any>'userData');
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app)
            .patch(`/api/user/inactivate`)
            .set('Authorization', `bearer ${token}`);

        expect(res.status).toBe(204);
        expect(userServiceSpy.inactivate.calledWithExactly(id)).toBeTruthy();
    });

    it('should not call controller inactivate - Token not provided', async () => {
        const res = await request(app).put(`/api/user/inactivate`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token not provided' });
        expect(userServiceSpy.inactivate.notCalled).toBeTruthy();
    });

    it('should not call controller inactivate - Token invalid', async () => {
        const res = await request(app)
            .put(`/api/user/inactivate`)
            .set('Authorization', `bearer invalidToken`);

        expect(res.status).toBe(401);
        expect(res.body).toStrictEqual({ error: 'Token invalid' });
        expect(userServiceSpy.inactivate.notCalled).toBeTruthy();
    });
});
