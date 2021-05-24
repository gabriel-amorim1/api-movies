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

    it('should be able to create a new admin', async () => {
        const userBuild = new UserBuilder()
            .withName('Create Admin')
            .withEmail('create@admin.com')
            .withPassword('password')
            .withIsAdmin(true)
            .build();

        const createdUser = await userRepository.createAndSave(userBuild);

        expect(createdUser.id).not.toBeUndefined();
        expect(createdUser.created_at).not.toBeUndefined();
        expect(createdUser.updated_at).not.toBeUndefined();
        expect(createdUser.is_active).toBeTruthy();
        expect(createdUser.name).toBe(userBuild.name);
        expect(createdUser.email).toBe(userBuild.email);
        expect(createdUser.password_hash).not.toBeUndefined();
        expect(createdUser.is_admin).toBeTruthy();
    });

    it('should be able to find user by id', async () => {
        const createdUser = await makeSut();

        const userFound = await userRepository.findById(createdUser.id);

        expect({ ...createdUser, votes: [] }).toEqual(userFound);
    });

    it('should be able to find user by id and returns hidden columns', async () => {
        const createdUser = await makeSut();

        const { password_hash, is_admin, ...userFound } =
            (await userRepository.findById(createdUser.id, true)) as User;

        expect(createdUser).toEqual(userFound);
        expect(password_hash).not.toBeUndefined();
        expect(is_admin).toBeFalsy();
    });

    it('should be able to find user by email', async () => {
        const createdUser = await makeSut();

        const userFound = await userRepository.findByEmail(createdUser.email);

        expect({ ...createdUser, votes: [] }).toEqual(userFound);
    });

    it('should be able to find user by email and returns hidden columns', async () => {
        const createdUser = await makeSut();

        const { password_hash, is_admin, ...userFound } =
            (await userRepository.findByEmail(createdUser.email, true)) as User;

        expect(createdUser).toEqual(userFound);
        expect(password_hash).not.toBeUndefined();
        expect(is_admin).toBeFalsy();
    });

    it('should be able to get all users', async () => {
        const createdUser = await makeSut();

        const users = await userRepository.getAll(<any>{});

        const arrayOfIds = users.data.map(user => user.id);

        expect(users.count).toBeGreaterThan(0);
        expect(arrayOfIds.includes(createdUser.id)).toBeTruthy();
    });
});
