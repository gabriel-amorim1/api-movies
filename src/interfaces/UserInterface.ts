import { RequestGetAllInterface } from './pagination';

export interface UserInterface {
    name: string;
    email: string;

    id?: string;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    password?: string;
    password_hash?: string;
}

export interface CreateUserInterface {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserInterface {
    name?: string;
    email?: string;
    password?: string;
}

export interface UserRequestGetAllInterface extends RequestGetAllInterface {
    name?: string;
    email?: string;
}

export interface UserResponseInterface {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
