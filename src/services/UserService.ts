import { inject, injectable } from 'tsyringe';
import User from '../database/entities/User';
import IUserRepository from '../interfaces/repositories.ts/IUserRepository';
import { CreateUserInterface } from '../interfaces/UserInterface';
import { HttpError } from '../utils/errors/HttpError';

@injectable()
class UserService {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,
    ) {}

    public async create(userData: CreateUserInterface): Promise<User> {
        return this.userRepository.createAndSave(userData);
    }

    public async findById(id: string): Promise<User> {
        const userFound = await this.userRepository.findById(id);

        if (!userFound) throw new HttpError(404, 'User not found');

        return userFound;
    }
}

export default UserService;
