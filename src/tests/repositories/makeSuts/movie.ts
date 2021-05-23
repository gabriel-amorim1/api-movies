import Movie from '../../../database/entities/Movie';
import { MovieInterface } from '../../../interfaces/MovieInterface';
import MovieRepository from '../../../repositories/MovieRepository';
import MovieBuilder from '../../testBuilders/MovieBuilder';

export default async (movieData?: Partial<MovieInterface>): Promise<Movie> => {
    const movieRepository = new MovieRepository();

    const movieBuild = new MovieBuilder()
        .withDirector('director')
        .withName('name')
        .withGenre('genre')
        .withActors('actors')
        .build();

    const createdMovie = await movieRepository.createAndSave(
        Object.assign(movieBuild, movieData),
    );

    return createdMovie;
};
