import connect from '../../database/connection';
import User from '../../database/entities/User';
import UserRepository from '../../repositories/UserRepository';
import UserBuilder from '../testBuilders/UserBuilder';
import makeSut from './makeSuts/user';

describe('User Repository Context', () => {
    let userRepository: UserRepository;

    beforeAll(async () => {
        await connect(true);
        userRepository = new UserRepository();
    });

    it('should be able to create a new user', async () => {
        const userBuild = new UserBuilder()
            .withName('Create User')
            .withEmail('create@user.com')
            .withPassword('password')
            .build();

        const createdUser = await userRepository.createAndSave(userBuild);

        expect(createdUser.id).not.toBeUndefined();
        expect(createdUser.created_at).not.toBeUndefined();
        expect(createdUser.updated_at).not.toBeUndefined();
        expect(createdUser.is_active).toBeTruthy();
        expect(createdUser.name).toBe(userBuild.name);
        expect(createdUser.email).toBe(userBuild.email);
        expect(createdUser.password_hash).not.toBeUndefined();
    });

    it('should be able to find user by id', async () => {
        const createdUser = await makeSut();

        const userFound = await userRepository.findById(createdUser.id);

        expect(createdUser).toEqual(userFound);
    });

    it('should be able to find user by id and returns password_hash', async () => {
        const createdUser = await makeSut();

        const { password_hash, ...userFound } = (await userRepository.findById(
            createdUser.id,
            true,
        )) as User;

        expect(createdUser).toEqual(userFound);
        expect(password_hash).not.toBeUndefined();
    });

    it('should be able to find user by email', async () => {
        const createdUser = await makeSut();

        const userFound = await userRepository.findByEmail(createdUser.email);

        expect(createdUser).toEqual(userFound);
    });

    it('should be able to get all users', async () => {
        const createdUser = await makeSut();

        const users = await userRepository.getAll(<any>{});

        const arrayOfIds = users.data.map(user => user.id);

        expect(users.count).toBeGreaterThan(0);
        expect(arrayOfIds.includes(createdUser.id)).toBeTruthy();
    });
});
