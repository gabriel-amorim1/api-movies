import sinon from 'sinon';
import request from 'supertest';
import { container } from 'tsyringe';
import app from '../../app';
import SessionService from '../../services/SessionService';

describe('User Route context', () => {
    let sessionServiceSpy: sinon.SinonStubbedInstance<SessionService>;

    beforeEach(() => {
        sinon.restore();
        sessionServiceSpy = sinon.createStubInstance(SessionService);
    });

    it('should call create controller with user data and returns status 201', async () => {
        const sessionData = {
            email: 'gabriel@teste.com',
            password: '123456',
        };

        sessionServiceSpy.create.resolves(<any>'sessionCreated');
        sinon.stub(container, 'resolve').returns(sessionServiceSpy);

        const res = await request(app).post('/api/sessions').send(sessionData);

        expect(res.status).toBe(201);
        expect(res.body).toStrictEqual('sessionCreated');
        expect(
            sessionServiceSpy.create.calledWithExactly(
                sessionData.email,
                sessionData.password,
            ),
        ).toBeTruthy();
    });

    it('should not call create controller with user data when send invalid params and return status 400', async () => {
        const sessionData = {
            email: <any>123,
            password: <any>123,
        };

        const res = await request(app).post('/api/sessions').send(sessionData);

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual([
            'email must be a valid email',
            'password must be at least 6 characters',
        ]);
        expect(sessionServiceSpy.create.notCalled).toBeTruthy();
    });

    it('should not call create controller with user data when not send params and return status 400', async () => {
        const res = await request(app).post('/api/sessions');

        expect(res.status).toBe(400);
        expect(res.body.errors).toStrictEqual([
            'email is a required field',
            'password is a required field',
        ]);
        expect(sessionServiceSpy.create.notCalled).toBeTruthy();
    });
});
