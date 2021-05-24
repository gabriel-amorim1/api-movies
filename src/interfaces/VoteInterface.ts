import { RequestGetAllInterface } from './pagination';

export interface VoteInterface {
    user_id: string;
    movie_id: string;
    rating: number;

    id?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface VoteRequestGetAllInterface extends RequestGetAllInterface {
    user_id?: string;
    movie_id?: string;
    rating?: string;
}
