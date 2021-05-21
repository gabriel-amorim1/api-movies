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
        if (await this.userRepository.findByEmail(userData.email)) {
            throw new HttpError(400, 'Email already registered.');
        }

        return this.userRepository.createAndSave(userData);
    }

    public async findById(id: string): Promise<User> {
        const userFound = await this.userRepository.findById(id);

        if (!userFound) throw new HttpError(404, 'User not found');

        return userFound;
    }

    public async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) throw new HttpError(404, 'Email not found');

        return user;
    }
}

export default UserService;
