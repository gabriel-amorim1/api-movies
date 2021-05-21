import { RequestGetAllInterface } from "./pagination";

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
