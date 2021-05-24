import MovieService from '../../../services/MovieService';
import FakeMovieRepository from '../../repositories/fakes/FakeMovieRepository';
import { fakeUserRepository } from './user';

const fakeMovieRepository = new FakeMovieRepository();

const makeMovieService = new MovieService(fakeMovieRepository, fakeUserRepository);

export { fakeMovieRepository, makeMovieService, fakeUserRepository };
