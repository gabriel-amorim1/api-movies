import sinon from 'sinon';
import request from 'supertest';
import { container } from 'tsyringe';
import { v4 } from 'uuid';

import app from '../../app';
import UserService from '../../services/UserService';
import UserBuilder from '../testBuilders/UserBuilder';

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

    it('should not call create controller and return status 400 when not send params', async () => {
        const res = await request(app).post('/api/user');

        expect(res.status).toBe(400);
        expect(userServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should be call controller findOne with id returns status 200', async () => {
        const userId = v4();

        userServiceSpy.findById.resolves(<any>'userData');
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app).get(`/api/user/${userId}`);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual('userData');
        expect(userServiceSpy.findById.calledWithExactly(userId)).toBeTruthy();
    });

    it('should be call controller findOne return status 400 when not send params', async () => {
        const res = await request(app).get('/api/user/invalid');

        expect(res.status).toBe(400);
        expect(res.body.errors).toEqual(['id must be a valid UUID']);
        expect(userServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should be call controller getAll and returns status 200', async () => {
        userServiceSpy.getAll.resolves(<any>{ data: 'users', count: 2 });
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app).get(`/api/user`);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(<any>{ data: 'users', count: 2 });
        expect(userServiceSpy.getAll.calledWithExactly({})).toBeTruthy();
    });

    it('should be call update controller with user data and returns status 200', async () => {
        const id = v4();
        const userData = new UserBuilder()
            .withName('Gabriel')
            .withEmail('gabriel@update.com')
            .build();

        userServiceSpy.update.resolves(<any>userData);
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app).put(`/api/user/${id}`).send(userData);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(userData);
        expect(userServiceSpy.update.calledWithExactly(id, userData)).toBeTruthy();
    });

    it('should not call update controller and return status 400 when send invalid id', async () => {
        const res = await request(app).put('/api/user/invalid');

        expect(res.status).toBe(400);
        expect(userServiceSpy.update.notCalled).toBeTruthy();
    });

    it('should be call controller activate with id returns status 200', async () => {
        const userId = v4();

        userServiceSpy.activate.resolves(<any>'userData');
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app).patch(`/api/user/activate/${userId}`);

        expect(res.status).toBe(200);
        expect(userServiceSpy.activate.calledWithExactly(userId)).toBeTruthy();
    });

    it('should be call controller activate return status 400 when not send params', async () => {
        const res = await request(app).patch('/api/user/activate/invalid');

        expect(res.status).toBe(400);
        expect(res.body.errors).toEqual(['id must be a valid UUID']);
        expect(userServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should be call controller inactivate with id returns status 200', async () => {
        const userId = v4();

        userServiceSpy.inactivate.resolves(<any>'userData');
        sinon.stub(container, 'resolve').returns(userServiceSpy);

        const res = await request(app).patch(`/api/user/inactivate/${userId}`);

        expect(res.status).toBe(204);
        expect(userServiceSpy.inactivate.calledWithExactly(userId)).toBeTruthy();
    });

    it('should be call controller inactivate return status 400 when not send params', async () => {
        const res = await request(app).patch('/api/user/inactivate/invalid');

        expect(res.status).toBe(400);
        expect(res.body.errors).toEqual(['id must be a valid UUID']);
        expect(userServiceSpy.create.notCalled).toBeTruthy();
    });
});
