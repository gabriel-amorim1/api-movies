import User from '../../database/entities/User';
import { OptionsTypeOrmGetAll } from '../pagination';
import { UserInterface } from '../UserInterface';

export default interface IUserRepository {
    createAndSave(userData: UserInterface): Promise<User>;
    findById(id: string, showHideColumns?: boolean): Promise<User | undefined>;
    findByEmail(email: string, showHideColumns?: boolean): Promise<User | undefined>;
    getAll(options: OptionsTypeOrmGetAll): Promise<{ data: User[]; count: number }>;
}
