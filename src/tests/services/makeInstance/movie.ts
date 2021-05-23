import MovieService from '../../../services/MovieService';
import FakeMovieRepository from '../../repositories/fakes/FakeMovieRepository';

const fakeMovieRepository = new FakeMovieRepository();

const makeMovieService = new MovieService(fakeMovieRepository);

export { fakeMovieRepository, makeMovieService };
