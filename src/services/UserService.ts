import bcrypt from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import User from '../database/entities/User';
import IUserRepository from '../interfaces/repositories/IUserRepository';
import {
    UpdateUserInterface,
    UserInterface,
    UserRequestGetAllInterface,
    UserResponseInterface,
} from '../interfaces/UserInterface';
import { buildFilterGetAll } from '../utils/dataBase/filters';
import { buildPaginatedGetAll } from '../utils/dataBase/pagination';
import { HttpError } from '../utils/errors/HttpError';
import * as userView from '../utils/views/users_view';

@injectable()
class UserService {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,
    ) {}

    private async verifyIfEmailIsAlreadyRegistered(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        if (user) {
            throw new HttpError(400, 'Email already registered.');
        }
    }

    public async create(userData: UserInterface): Promise<UserResponseInterface> {
        await this.verifyIfEmailIsAlreadyRegistered(userData.email);

        const createdUser = await this.userRepository.createAndSave(userData);

        return userView.render(createdUser);
    }

    public async findById(id: string, showPassword?: boolean): Promise<User> {
        const userFound = await this.userRepository.findById(id, showPassword);

        if (!userFound) throw new HttpError(404, 'User not found');

        return userFound;
    }

    public async getAll(
        queryParams: UserRequestGetAllInterface,
    ): Promise<{ data: User[]; count: number }> {
        const options = buildFilterGetAll(queryParams);

        const users = await this.userRepository.getAll(options);

        return buildPaginatedGetAll(queryParams, users);
    }

    public async update(
        id: string,
        updateData: UpdateUserInterface,
    ): Promise<UserResponseInterface> {
        const userFound = await this.findById(id, true);

        if (userFound.is_active === false) {
            throw new HttpError(401, 'Unauthorized - This account is inactive');
        }

        if (updateData.email && updateData.email !== userFound.email) {
            await this.verifyIfEmailIsAlreadyRegistered(updateData.email);
        }

        if (updateData.password) {
            userFound.password_hash = await bcrypt.hash(updateData.password, 8);
        }

        const userUpdated = await this.userRepository.createAndSave(
            Object.assign(userFound, { ...updateData }),
        );

        return userView.render(userUpdated);
    }

    public async activate(id: string): Promise<void> {
        const foundUser = await this.findById(id, true);

        this.userRepository.createAndSave(
            Object.assign(foundUser, { is_active: true }),
        );
    }

    public async inactivate(id: string): Promise<void> {
        const foundUser = await this.findById(id, true);

        this.userRepository.createAndSave(
            Object.assign(foundUser, { is_active: false }),
        );
    }
}

export default UserService;
