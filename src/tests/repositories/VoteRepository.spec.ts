import connect from '../../database/connection';
import VoteRepository from '../../repositories/VoteRepository';
import VoteBuilder from '../testBuilders/VoteBuilder';
import makeUserSut from './makeSuts/user';
import makeMovieSut from './makeSuts/movie';
import makeSut from './makeSuts/vote';

describe('Vote Repository Context', () => {
    let voteRepository: VoteRepository;

    beforeAll(async () => {
        await connect(true);
        voteRepository = new VoteRepository();
    });

    it('should be able to create a new vote', async () => {
        const user = await makeUserSut();
        const movie = await makeMovieSut();

        const voteBuild = new VoteBuilder()
            .withUserId(user.id)
            .withMovieId(movie.id)
            .withRating(4)
            .build();

        const createdVote = await voteRepository.createAndSave(voteBuild);

        expect(createdVote.id).not.toBeUndefined();
        expect(createdVote.created_at).not.toBeUndefined();
        expect(createdVote.updated_at).not.toBeUndefined();
        expect(createdVote.user_id).toBe(voteBuild.user_id);
        expect(createdVote.movie_id).toBe(voteBuild.movie_id);
        expect(createdVote.rating).toBe(voteBuild.rating);
    });

    it('should be able to find vote by id', async () => {
        const createdVote = await makeSut();

        const voteFound = await voteRepository.findById(createdVote.id);

        expect(createdVote).toEqual(voteFound);
    });

    it('should be able to get all votes', async () => {
        const createdVote = await makeSut();

        const votes = await voteRepository.getAll(<any>{});

        const arrayOfIds = votes.data.map(vote => vote.id);

        expect(votes.count).toBeGreaterThan(0);
        expect(arrayOfIds.includes(createdVote.id)).toBeTruthy();
    });

    it('should be able to remove vote by id', async () => {
        const createdVote = await makeSut();

        const res = await voteRepository.remove(createdVote.id);

        expect(res).toEqual({ raw: [] });
    });
});
