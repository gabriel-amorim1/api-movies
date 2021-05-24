import Vote from '../../../database/entities/Vote';
import { VoteInterface } from '../../../interfaces/VoteInterface';
import VoteRepository from '../../../repositories/VoteRepository';
import VoteBuilder from '../../testBuilders/VoteBuilder';
import makeUserSut from './user';
import makeMovieSut from './movie';

export default async (voteData?: Partial<VoteInterface>): Promise<Vote> => {
    const voteRepository = new VoteRepository();

    const user = await makeUserSut();
    const movie = await makeMovieSut();

    const voteBuild = new VoteBuilder()
        .withUserId(user.id)
        .withMovieId(movie.id)
        .withRating(4)
        .build();

    const createdVote = await voteRepository.createAndSave(
        Object.assign(voteBuild, voteData),
    );

    return createdVote;
};
