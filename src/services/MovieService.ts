import { inject, injectable } from 'tsyringe';
import { DeleteResult } from 'typeorm';
import Movie from '../database/entities/Movie';
import {
    MovieInterface,
    MovieRequestGetAllInterface,
    MovieWithVotesAverageInterface,
} from '../interfaces/MovieInterface';
import IMovieRepository from '../interfaces/repositories/IMovieRepository';
import IUserRepository from '../interfaces/repositories/IUserRepository';
import { buildFilterGetAll } from '../utils/dataBase/filters';
import { buildPaginatedGetAll } from '../utils/dataBase/pagination';
import { HttpError } from '../utils/errors/HttpError';

@injectable()
class MovieService {
    constructor(
        @inject('MovieRepository')
        private movieRepository: IMovieRepository,

        @inject('UserRepository')
        private userRepository: IUserRepository,
    ) {}

    public async create(movieData: MovieInterface, user_id: string): Promise<Movie> {
        const user = await this.userRepository.findById(user_id);

        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        if (user.is_active === false) {
            throw new HttpError(401, 'Unauthorized - This account is inactive');
        }

        const createdMovie = await this.movieRepository.createAndSave(movieData);

        return createdMovie;
    }

    public async findById(id: string): Promise<MovieWithVotesAverageInterface> {
        const movieFound = await this.movieRepository.findById(id);

        if (!movieFound) throw new HttpError(404, 'Movie not found');

        let votes_average = 0;
        if (movieFound.votes && movieFound.votes.length > 0) {
            votes_average =
                movieFound.votes
                    .map(vote => vote.rating)
                    .reduce((sumOfRatings, rating) => sumOfRatings + rating) /
                movieFound.votes.length;
        }

        return { ...movieFound, votes_average };
    }

    public async getAll(
        queryParams: MovieRequestGetAllInterface,
    ): Promise<{ data: MovieWithVotesAverageInterface[]; count: number }> {
        const options = buildFilterGetAll(queryParams);

        const movies = await this.movieRepository.getAll(options);

        const moviesWithVotesAverage = movies.data.map(movie => {
            let votes_average = 0;
            if (movie.votes && movie.votes.length > 0) {
                votes_average =
                    movie.votes
                        .map(vote => vote.rating)
                        .reduce((sumOfRatings, rating) => sumOfRatings + rating) /
                    movie.votes.length;
            }

            return { ...movie, votes_average };
        });

        return buildPaginatedGetAll(queryParams, {
            data: moviesWithVotesAverage,
            count: movies.count,
        });
    }

    public async update(
        id: string,
        updateData: MovieInterface,
        user_id: string,
    ): Promise<Movie> {
        const user = await this.userRepository.findById(user_id);

        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        if (user.is_active === false) {
            throw new HttpError(401, 'Unauthorized - This account is inactive');
        }

        const movieFound = await this.findById(id);

        const movieUpdated = await this.movieRepository.createAndSave(
            Object.assign(movieFound, { ...updateData }),
        );

        return movieUpdated;
    }

    public async remove(id: string, user_id: string): Promise<DeleteResult> {
        const user = await this.userRepository.findById(user_id);

        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        if (user.is_active === false) {
            throw new HttpError(401, 'Unauthorized - This account is inactive');
        }

        await this.findById(id);

        return this.movieRepository.remove(id);
    }
}

export default MovieService;
