import { v4 } from 'uuid';
import Movie from '../../database/entities/Movie';
import { MovieInterface } from '../../interfaces/MovieInterface';
import MovieService from '../../services/MovieService';
import { HttpError } from '../../utils/errors/HttpError';
import MovieBuilder from '../testBuilders/MovieBuilder';
import { makeMovieService } from './makeInstance/movie';

describe('Movie Service context', () => {
    let movieService: MovieService;

    beforeAll(async () => {
        movieService = makeMovieService;
    });

    const makeSut = async (movieData?: Partial<MovieInterface>): Promise<Movie> => {
        const movieBuild = new MovieBuilder()
            .withDirector('director')
            .withName('name')
            .withGenre('genre')
            .withActors('actors')
            .build();

        return movieService.create(Object.assign(movieBuild, movieData));
    };

    it('should be able to create new Movie', async () => {
        const movieBuild = new MovieBuilder()
            .withDirector('director')
            .withName('name')
            .withGenre('genre')
            .withActors('actors')
            .build();

        const { id, created_at, updated_at, ...entityProps } =
            await movieService.create(movieBuild);

        const expectedRes = {
            director: movieBuild.director,
            name: movieBuild.name,
            genre: movieBuild.genre,
            actors: movieBuild.actors,
        };

        expect(entityProps).toEqual(expectedRes);
        expect(id).not.toBeUndefined();
        expect(created_at).not.toBeUndefined();
        expect(updated_at).not.toBeUndefined();
    });

    it('should be able to find Movie by Id', async () => {
        const sut = await makeSut();

        const movieFound = await movieService.findById(sut.id);

        expect({ ...sut, votes_average: 0 }).toEqual(movieFound);
    });

    it('should not be able to find Movie by Id - Movie not found', async () => {
        expect.hasAssertions();

        try {
            await movieService.findById(v4());
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect(error.code).toBe(404);
            expect(error.message).toBe('Movie not found');
        }
    });

    it('should be able to get all movies', async () => {
        const sut = await makeSut();

        const movies = await movieService.getAll(<any>{});

        const arrayOfIds = movies.data.map(movie => movie.id);

        expect(arrayOfIds.includes(sut.id)).toBeTruthy();
        expect(movies.count).toBeGreaterThan(0);
    });

    it('should be able to update a movie', async () => {
        const sut = await makeSut();

        const updateData = new MovieBuilder()
            .withDirector('director update')
            .withName('name update')
            .withGenre('genre update')
            .withActors('actors update')
            .build();

        const movieUpdated = await movieService.update(sut.id, updateData);

        const expectedRes = {
            ...sut,
            director: updateData.director,
            name: updateData.name,
            genre: updateData.genre,
            actors: updateData.actors,
            updated_at: movieUpdated.updated_at,
            votes_average: 0,
        };

        expect(movieUpdated).toEqual(expectedRes);
    });

    it('should not be able to update a movie - Movie not found', async () => {
        expect.hasAssertions();

        try {
            await movieService.update(v4(), <any>{});
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect(error.code).toBe(404);
            expect(error.message).toBe('Movie not found');
        }
    });

    it('should be able to remove Movie by Id', async () => {
        const sut = await makeSut();

        const res = await movieService.remove(sut.id);

        expect(res).toEqual({ affected: 1, raw: [] });
    });
});
