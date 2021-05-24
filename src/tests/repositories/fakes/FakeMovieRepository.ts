/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteResult } from 'typeorm';
import { v4 } from 'uuid';
import Movie from '../../../database/entities/Movie';
import { MovieInterface } from '../../../interfaces/MovieInterface';
import { OptionsTypeOrmGetAll } from '../../../interfaces/pagination';
import IMovieRepository from '../../../interfaces/repositories/IMovieRepository';

export default class FakeMovieRepository implements IMovieRepository {
    private movies: Movie[] = [];

    public async createAndSave(movieData: MovieInterface): Promise<Movie> {
        if (!movieData.id) {
            const movie = Object.assign(new Movie(), movieData);

            movie.id = v4();
            movie.created_at = new Date();
            movie.updated_at = new Date();

            this.movies.push(movie);

            return movie;
        }

        const index = this.movies.findIndex(item => item.id === movieData.id);

        this.movies[index] = {
            ...this.movies[index],
            ...movieData,
            updated_at: new Date(),
        } as Movie;

        return this.movies[index];
    }

    public async findById(id: string): Promise<Movie | undefined> {
        return this.movies.find(movie => movie.id === id);
    }

    public async getAll(
        options: OptionsTypeOrmGetAll,
    ): Promise<{ data: Movie[]; count: number }> {
        return { data: this.movies, count: this.movies.length };
    }

    public async remove(id: string): Promise<DeleteResult> {
        this.movies = this.movies.filter(movie => movie.id === id);

        return { affected: 1, raw: [] };
    }
}
