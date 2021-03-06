import { getRepository, Repository } from 'typeorm';
import User from '../database/entities/User';
import { OptionsTypeOrmGetAll } from '../interfaces/pagination';
import IUserRepository from '../interfaces/repositories/IUserRepository';
import { UserInterface } from '../interfaces/UserInterface';

export default class UserRepository implements IUserRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async createAndSave(userData: UserInterface): Promise<User> {
        const user = Object.assign(new User(), userData);

        return this.ormRepository.save(user);
    }

    public async findById(
        id: string,
        showHideColumns?: boolean,
    ): Promise<User | undefined> {
        if (showHideColumns) {
            return this.ormRepository
                .createQueryBuilder('user')
                .addSelect('user.password_hash')
                .addSelect('user.is_admin')
                .where('id = :id', { id })
                .getOne();
        }

        return this.ormRepository.findOne(id);
    }

    public async findByEmail(
        email: string,
        showHideColumns?: boolean,
    ): Promise<User | undefined> {
        if (showHideColumns) {
            return this.ormRepository
                .createQueryBuilder('user')
                .addSelect('user.password_hash')
                .addSelect('user.is_admin')
                .where('email = :email', { email })
                .getOne();
        }

        return this.ormRepository.findOne({ email });
    }

    public async getAll(
        options: OptionsTypeOrmGetAll,
    ): Promise<{ data: User[]; count: number }> {
        const [data, count] = await this.ormRepository.findAndCount(options);

        return { data, count };
    }
}
