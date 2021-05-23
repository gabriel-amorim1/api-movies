import { SessionResponseInterface } from '../../interfaces/SessionInterface';
import { UserInterface } from '../../interfaces/UserInterface';
import SessionService from '../../services/SessionService';
import { HttpError } from '../../utils/errors/HttpError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UserBuilder from '../testBuilders/UserBuilder';
import { fakeUserRepository, makeSessionService } from './makeInstance/session';

describe('Session Service context', () => {
    let userRepository: FakeUserRepository;
    let sessionService: SessionService;

    beforeAll(async () => {
        userRepository = fakeUserRepository;
        sessionService = makeSessionService;
    });

    it('should be able to create new Session', async () => {
        const userBuild = new UserBuilder()
            .withName('Create Test')
            .withEmail('create@teste.com')
            .withPassword('password')
            .build();

        const createdUser = await userRepository.createAndSave(userBuild);

        const { token, user } = await sessionService.create(
            createdUser.email,
            createdUser.password,
        );

        const expectedRes = {
            id: createdUser.id,
            email: createdUser.email,
            name: createdUser.name,
        };

        expect(user).toEqual(expectedRes);
        expect(token).not.toBeUndefined();
    });

    it('should not be able to create new Session - User not found', async () => {
        expect.hasAssertions();

        try {
            await sessionService.create('email', 'password');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect(error.code).toBe(404);
            expect(error.message).toBe('User not found');
        }
    });

    it('should not be able to create new Session - Password does no match', async () => {
        expect.hasAssertions();

        try {
            const userBuild = new UserBuilder()
                .withName('Create Test')
                .withEmail('create@teste.com')
                .withPassword('password')
                .build();

            const createdUser = await userRepository.createAndSave(userBuild);

            await sessionService.create(createdUser.email, 'wrongPassword');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect(error.code).toBe(400);
            expect(error.message).toBe('Password does no match');
        }
    });
});
