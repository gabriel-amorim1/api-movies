import { container } from 'tsyringe';
import IUserRepository from '../interfaces/repositories.ts/IUserRepository';
import UserRepository from '../repositories/UserRepository';
import UserService from '../services/UserService';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<UserService>('UserService', UserService);
