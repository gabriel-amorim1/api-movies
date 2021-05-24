import { inject, injectable } from 'tsyringe';
import { DeleteResult } from 'typeorm';
import Movie from '../database/entities/Movie';
import {
    MovieInterface,
    MovieRequestGetAllInterface,
    MovieWithVotesAverageInterface,
} from '../interfaces/MovieInterface';
import IMovieRepository from '../interfaces/repositories/IMovieRepository';
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
