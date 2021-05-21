import { getRepository, Repository } from "typeorm";
import User from "../database/entities/User";
import IUserRepository from "../interfaces/repositories.ts/IUserRepository";
import { CreateUserInterface } from "../interfaces/UserInterface";

export default class UserRepository implements IUserRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async createAndSave(userData: CreateUserInterface): Promise<User> {
        const user = Object.assign(new User(), userData);

        return this.ormRepository.save(user);
    }
}
