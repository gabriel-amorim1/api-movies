import SessionService from '../../../services/SessionService';
import { fakeUserRepository } from './user';

const makeSessionService = new SessionService(fakeUserRepository);

export { fakeUserRepository, makeSessionService };
