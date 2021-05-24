import { container } from 'tsyringe';
import IMovieRepository from '../interfaces/repositories/IMovieRepository';
import IUserRepository from '../interfaces/repositories/IUserRepository';
import IVoteRepository from '../interfaces/repositories/IVoteRepository';
import MovieRepository from '../repositories/MovieRepository';
import UserRepository from '../repositories/UserRepository';
import VoteRepository from '../repositories/VoteRepository';
import MovieService from '../services/MovieService';
import SessionService from '../services/SessionService';
import UserService from '../services/UserService';
import VoteService from '../services/VoteService';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<UserService>('UserService', UserService);
container.registerSingleton<SessionService>('SessionService', SessionService);
container.registerSingleton<IMovieRepository>('MovieRepository', MovieRepository);
container.registerSingleton<MovieService>('MovieService', MovieService);
container.registerSingleton<IVoteRepository>('VoteRepository', VoteRepository);
container.registerSingleton<VoteService>('VoteService', VoteService);
