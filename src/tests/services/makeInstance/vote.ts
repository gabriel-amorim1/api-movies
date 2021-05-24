import VoteService from '../../../services/VoteService';
import FakeVoteRepository from '../../repositories/fakes/FakeVoteRepository';
import { fakeMovieRepository } from './movie';
import { fakeUserRepository } from './user';

const fakeVoteRepository = new FakeVoteRepository();

const makeVoteService = new VoteService(
    fakeVoteRepository,
    fakeUserRepository,
    fakeMovieRepository,
);

export {
    fakeVoteRepository,
    makeVoteService,
    fakeUserRepository,
    fakeMovieRepository,
};
