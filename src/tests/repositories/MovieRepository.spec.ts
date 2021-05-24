import connect from '../../database/connection';
import MovieRepository from '../../repositories/MovieRepository';
import MovieBuilder from '../testBuilders/MovieBuilder';
import makeSut from './makeSuts/movie';

describe('Movie Repository Context', () => {
    let movieRepository: MovieRepository;

    beforeAll(async () => {
        await connect(true);
        movieRepository = new MovieRepository();
    });

    it('should be able to create a new movie', async () => {
        const movieBuild = new MovieBuilder()
            .withDirector('director')
            .withName('name')
            .withGenre('genre')
            .withActors('actors')
            .build();

        const createdMovie = await movieRepository.createAndSave(movieBuild);

        expect(createdMovie.id).not.toBeUndefined();
        expect(createdMovie.created_at).not.toBeUndefined();
        expect(createdMovie.updated_at).not.toBeUndefined();
        expect(createdMovie.director).toBe(movieBuild.director);
        expect(createdMovie.name).toBe(movieBuild.name);
        expect(createdMovie.genre).toBe(movieBuild.genre);
        expect(createdMovie.actors).toBe(movieBuild.actors);
    });

    it('should be able to find movie by id', async () => {
        const createdMovie = await makeSut();

        const movieFound = await movieRepository.findById(createdMovie.id);

        expect({ ...createdMovie, votes: [] }).toEqual(movieFound);
    });

    it('should be able to get all movies', async () => {
        const createdMovie = await makeSut();

        const movies = await movieRepository.getAll(<any>{});

        const arrayOfIds = movies.data.map(movie => movie.id);

        expect(movies.count).toBeGreaterThan(0);
        expect(arrayOfIds.includes(createdMovie.id)).toBeTruthy();
    });

    it('should be able to remove movie by id', async () => {
        const createdMovie = await makeSut();

        const res = await movieRepository.remove(createdMovie.id);

        expect(res).toEqual({ raw: [] });
    });
});
