import User from '../../database/entities/User';
import { OptionsTypeOrmGetAll } from '../pagination';
import { CreateUserInterface } from '../UserInterface';

export default interface IUserRepository {
    createAndSave(userData: CreateUserInterface): Promise<User>;
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    getAll(
        options: OptionsTypeOrmGetAll,
    ): Promise<{ data: User[]; count: number }>;
}
