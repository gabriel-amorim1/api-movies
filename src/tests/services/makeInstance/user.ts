import UserService from '../../../services/UserService';
import FakeUserRepository from '../../repositories/fakes/FakeUserRepository';

const fakeUserRepository = new FakeUserRepository();

const makeUserService = new UserService(fakeUserRepository);

export { fakeUserRepository, makeUserService };
