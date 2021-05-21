import { inject, injectable } from 'tsyringe';
import User from '../database/entities/User';
import IUserRepository from '../interfaces/repositories.ts/IUserRepository';
import { CreateUserInterface, UpdateUserInterface, UserRequestGetAllInterface } from '../interfaces/UserInterface';
import { buildFilterGetAll } from '../utils/dataBase/filters';
import { buildPaginatedGetAll } from '../utils/dataBase/pagination';
import { HttpError } from '../utils/errors/HttpError';

@injectable()
class UserService {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,
    ) {}

    public async create(userData: CreateUserInterface): Promise<User> {
        await this.verifyIfEmailIsAlreadyRegistered(userData.email);

        return this.userRepository.createAndSave(userData);
    }

    public async findById(id: string): Promise<User> {
        const userFound = await this.userRepository.findById(id);

        if (!userFound) throw new HttpError(404, 'User not found');

        return userFound;
    }

    public async verifyIfEmailIsAlreadyRegistered(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        if (user) {
            throw new HttpError(400, 'Email already registered.');
        }
    }

    public async getAll(
        queryParams: UserRequestGetAllInterface,
    ): Promise<{ data: User[]; count: number }> {
        const options = buildFilterGetAll(queryParams);

        const users = await this.userRepository.getAll(options);

        return buildPaginatedGetAll(queryParams, users);
    }

    public async update(id: string, userUpdate: UpdateUserInterface): Promise<User> {
        const foundUser = await this.findById(id);

        if(userUpdate.email && userUpdate.email !== foundUser.email){
            await this.verifyIfEmailIsAlreadyRegistered(userUpdate.email);
        }

        return this.userRepository.createAndSave(
            Object.assign(foundUser, { ...userUpdate }),
        );
    }

    public async activate(id: string): Promise<void> {
        const foundUser = await this.findById(id);

        this.userRepository.createAndSave(
            Object.assign(foundUser, { is_active: true }),
        );
    }

    public async inactivate(id: string): Promise<void> {
        const foundUser = await this.findById(id);

        this.userRepository.createAndSave(
            Object.assign(foundUser, { is_active: false }),
        );
    }
}

export default UserService;
