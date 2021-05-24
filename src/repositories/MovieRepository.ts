import { DeleteResult, getRepository, Repository } from 'typeorm';
import Movie from '../database/entities/Movie';
import User from '../database/entities/User';
import { MovieInterface } from '../interfaces/MovieInterface';
import { OptionsTypeOrmGetAll } from '../interfaces/pagination';
import IMovieRepository from '../interfaces/repositories/IMovieRepository';

export default class MovieRepository implements IMovieRepository {
    private ormRepository: Repository<Movie>;

    constructor() {
        this.ormRepository = getRepository(Movie);
    }

    public async createAndSave(movieData: MovieInterface): Promise<Movie> {
        const movie = Object.assign(new User(), movieData);

        return this.ormRepository.save(movie);
    }

    public async findById(id: string): Promise<Movie | undefined> {
        return this.ormRepository.findOne(id);
    }

    public async getAll(
        options: OptionsTypeOrmGetAll,
    ): Promise<{ data: Movie[]; count: number }> {
        const [data, count] = await this.ormRepository.findAndCount(options);

        return { data, count };
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.ormRepository.delete(id);
    }
}
