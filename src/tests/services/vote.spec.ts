import { v4 } from 'uuid';
import Vote from '../../database/entities/Vote';
import { VoteInterface } from '../../interfaces/VoteInterface';
import VoteService from '../../services/VoteService';
import { HttpError } from '../../utils/errors/HttpError';
import FakeMovieRepository from '../repositories/fakes/FakeMovieRepository';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import MovieBuilder from '../testBuilders/MovieBuilder';
import UserBuilder from '../testBuilders/UserBuilder';
import VoteBuilder from '../testBuilders/VoteBuilder';
import {
    fakeMovieRepository,
    fakeUserRepository,
    makeVoteService,
} from './makeInstance/vote';

describe('Vote Service context', () => {
    let userRepository: FakeUserRepository;
    let movieRepository: FakeMovieRepository;
    let voteService: VoteService;

    beforeAll(async () => {
        userRepository = fakeUserRepository;
        movieRepository = fakeMovieRepository;
        voteService = makeVoteService;
    });

    const makeSut = async (voteData?: Partial<VoteInterface>): Promise<Vote> => {
        const userBuild = new UserBuilder()
            .withName('Create User')
            .withEmail(`${v4()}@user.com`)
            .withPassword('password')
            .build();

        const createdUser = await userRepository.createAndSave(userBuild);

        const movieBuild = new MovieBuilder()
            .withDirector('director')
            .withName('name')
            .withGenre('genre')
            .withActors('actors')
            .build();

        const createdMovie = await movieRepository.createAndSave(movieBuild);

        const voteBuild = new VoteBuilder()
            .withUserId(createdUser.id)
            .withMovieId(createdMovie.id)
            .withRating(4)
            .build();

        return voteService.create(Object.assign(voteBuild, voteData));
    };

    it('should be able to create new Vote', async () => {
        const userBuild = new UserBuilder()
            .withName('Create User')
            .withEmail(`${v4()}@user.com`)
            .withPassword('password')
            .build();

        const createdUser = await userRepository.createAndSave(userBuild);

        const movieBuild = new MovieBuilder()
            .withDirector('director')
            .withName('name')
            .withGenre('genre')
            .withActors('actors')
            .build();

        const createdMovie = await movieRepository.createAndSave(movieBuild);

        const voteBuild = new VoteBuilder()
            .withUserId(createdUser.id)
            .withMovieId(createdMovie.id)
            .withRating(4)
            .build();

        const { id, created_at, updated_at, ...entityProps } =
            await voteService.create(voteBuild);

        const expectedRes = {
            user_id: voteBuild.user_id,
            movie_id: voteBuild.movie_id,
            rating: voteBuild.rating,
        };

        expect(entityProps).toEqual(expectedRes);
        expect(id).not.toBeUndefined();
        expect(created_at).not.toBeUndefined();
        expect(updated_at).not.toBeUndefined();
    });

    it('should be able to find Vote by Id', async () => {
        const sut = await makeSut();

        const voteFound = await voteService.findById(sut.id);

        expect(sut).toEqual(voteFound);
    });

    it('should not be able to find Vote by Id - Vote not found', async () => {
        expect.hasAssertions();

        try {
            await voteService.findById(v4());
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect(error.code).toBe(404);
            expect(error.message).toBe('Vote not found');
        }
    });

    it('should be able to get all votes', async () => {
        const sut = await makeSut();

        const votes = await voteService.getAll(<any>{});

        const arrayOfIds = votes.data.map(vote => vote.id);

        expect(arrayOfIds.includes(sut.id)).toBeTruthy();
        expect(votes.count).toBeGreaterThan(0);
    });

    it('should be able to update a vote', async () => {
        const sut = await makeSut();

        const updateData = new VoteBuilder().withRating(3).build();

        const voteUpdated = await voteService.update(sut.id, {
            ...updateData,
            user_id: sut.user_id,
        });

        const expectedRes = {
            ...sut,
            rating: updateData.rating,
            updated_at: voteUpdated.updated_at,
        };

        expect(voteUpdated).toEqual(expectedRes);
    });

    it('should not be able to update a vote - Vote not found', async () => {
        expect.hasAssertions();

        try {
            await voteService.update(v4(), <any>{});
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect(error.code).toBe(404);
            expect(error.message).toBe('Vote not found');
        }
    });

    it('should be able to remove Vote by Id', async () => {
        const sut = await makeSut();

        const res = await voteService.remove(sut.id, sut.user_id, false);

        expect(res).toEqual({ affected: 1, raw: [] });
    });
});
