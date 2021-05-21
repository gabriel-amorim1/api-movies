import User from '../../database/entities/User';
import { CreateUserInterface } from '../UserInterface';

export default interface IUserRepository {
    createAndSave(userData: CreateUserInterface): Promise<User>;
}
