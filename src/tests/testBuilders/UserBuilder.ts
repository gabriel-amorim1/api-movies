import User from '../../database/entities/User';

export default class UserBuilder {
    user: User;

    constructor() {
        this.user = {} as User;
    }

    public withId(id: string): UserBuilder {
        this.user.id = id;
        return this;
    }

    public withName(name: string): UserBuilder {
        this.user.name = name;
        return this;
    }

    public withEmail(email: string): UserBuilder {
        this.user.email = email;
        return this;
    }

    public withPassword(password: string): UserBuilder {
        this.user.password = password;
        return this;
    }

    public withPasswordHash(password_hash: string): UserBuilder {
        this.user.password_hash = password_hash;
        return this;
    }

    public withIsActive(is_active: boolean): UserBuilder {
        this.user.is_active = is_active;
        return this;
    }

    public withIsAdmin(is_admin: boolean): UserBuilder {
        this.user.is_admin = is_admin;
        return this;
    }

    public withCreatedAt(createdAt: Date): UserBuilder {
        this.user.created_at = createdAt;
        return this;
    }

    public withUpdatedAt(updatedAt: Date): UserBuilder {
        this.user.updated_at = updatedAt;
        return this;
    }

    public build(): User {
        return this.user;
    }
}
