import { container } from 'tsyringe';
import IUserRepository from '../interfaces/repositories.ts/IUserRepository';
import UserRepository from '../repositories/UserRepository';
import SessionService from '../services/SessionService';
import UserService from '../services/UserService';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<UserService>('UserService', UserService);
container.registerSingleton<SessionService>('SessionService', SessionService);
