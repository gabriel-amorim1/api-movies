/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import User from '../../../database/entities/User';
import { OptionsTypeOrmGetAll } from '../../../interfaces/pagination';
import IUserRepository from '../../../interfaces/repositories/IUserRepository';
import { UserInterface } from '../../../interfaces/UserInterface';

export default class FakeUserRepository implements IUserRepository {
    private users: User[] = [];

    public async createAndSave(userData: UserInterface): Promise<User> {
        if (!userData.id) {
            const user = Object.assign(new User(), userData);

            user.id = v4();
            user.is_active = true;
            user.created_at = new Date();
            user.updated_at = new Date();
            user.password_hash = await bcrypt.hash(user.password, 8);

            this.users.push(user);

            return user;
        }

        const index = this.users.findIndex(item => item.id === userData.id);

        this.users[index] = {
            ...this.users[index],
            ...userData,
            updated_at: new Date(),
        } as User;

        return this.users[index];
    }

    public async findById(
        id: string,
        showPassword?: boolean,
    ): Promise<User | undefined> {
        const foundUser = this.users.find(user => user.id === id);

        if (foundUser) {
            const { password_hash, password, ...entityProps } = foundUser;

            if (showPassword) {
                return { ...entityProps, password_hash } as User;
            }

            return entityProps as User;
        }

        return foundUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }

    public async getAll(
        options: OptionsTypeOrmGetAll,
    ): Promise<{ data: User[]; count: number }> {
        return { data: this.users, count: this.users.length };
    }
}
