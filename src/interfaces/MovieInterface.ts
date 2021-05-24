import { RequestGetAllInterface } from './pagination';

export interface MovieInterface {
    director: string;
    name: string;
    genre: string;
    actors: string;

    id?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface MovieRequestGetAllInterface extends RequestGetAllInterface {
    director?: string;
    name?: string;
    genre?: string;
    actors?: string;
}

export interface MovieWithVotesAverageInterface {
    id: string;
    director: string;
    name: string;
    genre: string;
    actors: string;
    votes_average: number;
    created_at: Date;
    updated_at: Date;
}
