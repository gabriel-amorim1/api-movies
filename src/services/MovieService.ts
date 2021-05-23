import { inject, injectable } from 'tsyringe';
import { DeleteResult } from 'typeorm';
import Movie from '../database/entities/Movie';
import { MovieInterface } from '../interfaces/MovieInterface';
import IMovieRepository from '../interfaces/repositories.ts/IMovieRepository';
import { UserRequestGetAllInterface } from '../interfaces/UserInterface';
import { buildFilterGetAll } from '../utils/dataBase/filters';
import { buildPaginatedGetAll } from '../utils/dataBase/pagination';
import { HttpError } from '../utils/errors/HttpError';

@injectable()
class MovieService {
    constructor(
        @inject('MovieRepository')
        private movieRepository: IMovieRepository,
    ) {}

    public async create(movieData: MovieInterface): Promise<Movie> {
        const createdMovie = await this.movieRepository.createAndSave(movieData);

        return createdMovie;
    }

    public async findById(id: string): Promise<Movie> {
        const movieFound = await this.movieRepository.findById(id);

        if (!movieFound) throw new HttpError(404, 'Movie not found');

        return movieFound;
    }

    public async getAll(
        queryParams: UserRequestGetAllInterface,
    ): Promise<{ data: Movie[]; count: number }> {
        const options = buildFilterGetAll(queryParams);

        const users = await this.movieRepository.getAll(options);

        return buildPaginatedGetAll(queryParams, users);
    }

    public async update(id: string, updateData: MovieInterface): Promise<Movie> {
        const movieFound = await this.findById(id);

        const movieUpdated = await this.movieRepository.createAndSave(
            Object.assign(movieFound, { ...updateData }),
        );

        return movieUpdated;
    }

    public async remove(id: string): Promise<DeleteResult> {
        await this.findById(id);

        return this.movieRepository.remove(id);
    }
}

export default MovieService;
