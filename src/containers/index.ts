import { container } from 'tsyringe';
import IMovieRepository from '../interfaces/repositories.ts/IMovieRepository';
import IUserRepository from '../interfaces/repositories.ts/IUserRepository';
import MovieRepository from '../repositories/MovieRepository';
import UserRepository from '../repositories/UserRepository';
import MovieService from '../services/MovieService';
import SessionService from '../services/SessionService';
import UserService from '../services/UserService';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<UserService>('UserService', UserService);
container.registerSingleton<SessionService>('SessionService', SessionService);
container.registerSingleton<IMovieRepository>('MovieRepository', MovieRepository);
container.registerSingleton<MovieService>('MovieService', MovieService);
