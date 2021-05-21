import { inject, injectable } from 'tsyringe';
import User from '../database/entities/User';
import IUserRepository from '../interfaces/repositories.ts/IUserRepository';
import { CreateUserInterface } from '../interfaces/UserInterface';

@injectable()
class UserService {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,
    ) {}

    public async create(userData: CreateUserInterface): Promise<User> {
        return this.userRepository.createAndSave(userData);
    }
}

export default UserService;
