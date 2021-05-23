import { DeleteResult } from 'typeorm';
import Movie from '../../database/entities/Movie';
import { MovieInterface } from '../MovieInterface';
import { OptionsTypeOrmGetAll } from '../pagination';

export default interface IUserRepository {
    createAndSave(movieData: MovieInterface): Promise<Movie>;
    findById(id: string): Promise<Movie | undefined>;
    getAll(options: OptionsTypeOrmGetAll): Promise<{ data: Movie[]; count: number }>;
    remove(id: string): Promise<DeleteResult>;
}
