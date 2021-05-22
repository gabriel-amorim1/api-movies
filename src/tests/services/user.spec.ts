import { v4 } from 'uuid';
import {
    UserInterface,
    UserResponseInterface,
} from '../../interfaces/UserInterface';
import UserService from '../../services/UserService';
import { HttpError } from '../../utils/errors/HttpError';
import UserBuilder from '../testBuilders/UserBuilder';
import { makeUserService } from './makeInstance/user';

describe('User Service context', () => {
    let userService: UserService;

    beforeAll(async () => {
        userService = makeUserService;
    });

    const makeSut = (
        userData?: Partial<UserInterface>,
    ): Promise<UserResponseInterface> => {
        const userBuild = new UserBuilder()
            .withName('Create Test')
            .withEmail(`${v4()}@teste.com`)
            .withPassword('password')
            .build();

        return userService.create(Object.assign(userBuild, userData));
    };

    it('should be able to create new User', async () => {
        const userBuild = new UserBuilder()
            .withName('Create Test')
            .withEmail('create@teste.com')
            .withPassword('password')
            .build();

        const { id, created_at, updated_at, ...entityProps } =
            await userService.create(userBuild);

        const expectedRes = {
            name: userBuild.name,
            email: userBuild.email,
            is_active: true,
        };

        expect(entityProps).toEqual(expectedRes);
        expect(id).not.toBeUndefined();
        expect(created_at).not.toBeUndefined();
        expect(updated_at).not.toBeUndefined();
    });

    it('should not be able to create new User - Email already registered', async () => {
        expect.hasAssertions();

        const sut = await makeSut();

        try {
            await userService.create({ ...sut, password: '123456' });
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect(error.code).toBe(400);
            expect(error.message).toBe('Email already registered.');
        }
    });

    it('should be able to find User by Id', async () => {
        const sut = await makeSut();

        const userFound = await userService.findById(sut.id);

        expect(sut).toEqual(userFound);
    });

    it('should not be able to find User by Id - User not found', async () => {
        expect.hasAssertions();

        try {
            await userService.findById(v4());
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect(error.code).toBe(404);
            expect(error.message).toBe('User not found');
        }
    });

    it('should be able to get all users', async () => {
        const sut = await makeSut();

        const users = await userService.getAll(<any>{});

        const arrayOfIds = users.data.map(user => user.id);

        expect(arrayOfIds.includes(sut.id)).toBeTruthy();
        expect(users.count).toBeGreaterThan(0);
    });

    it('should be able to update a user', async () => {
        const sut = await makeSut();

        const updateData = new UserBuilder()
            .withName('Update Test')
            .withEmail(`${v4()}@teste.com`)
            .withPassword('passwordUpdated')
            .build();

        const userUpdated = await userService.update(sut.id, updateData);

        const expectedRes = {
            ...sut,
            name: updateData.name,
            email: updateData.email,
            updated_at: userUpdated.updated_at,
        };

        expect(userUpdated).toEqual(expectedRes);
    });

    it('should not be able to update a user - User not found', async () => {
        expect.hasAssertions();

        try {
            await userService.update(v4(), {});
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect(error.code).toBe(404);
            expect(error.message).toBe('User not found');
        }
    });

    it('should not be able to update a user - Email already registered.', async () => {
        expect.hasAssertions();

        const sut = await makeSut();
        const sut2 = await makeSut();

        try {
            await userService.update(sut.id, { email: sut2.email });
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect(error.code).toBe(400);
            expect(error.message).toBe('Email already registered.');
        }
    });

    it('should be able to activate User by Id', async () => {
        const sut = await makeSut({ is_active: false });

        await userService.activate(sut.id);

        const userFound = await userService.findById(sut.id);

        expect(userFound.is_active).toBe(true);
    });

    it('should be able to inactivate User by Id', async () => {
        const sut = await makeSut();

        await userService.inactivate(sut.id);

        const userFound = await userService.findById(sut.id);

        expect(userFound.is_active).toBe(false);
    });
});
