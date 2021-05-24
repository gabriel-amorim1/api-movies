import { inject, injectable } from 'tsyringe';
import { DeleteResult } from 'typeorm';
import User from '../database/entities/User';
import Vote from '../database/entities/Vote';
import IMovieRepository from '../interfaces/repositories/IMovieRepository';
import IUserRepository from '../interfaces/repositories/IUserRepository';
import IVoteRepository from '../interfaces/repositories/IVoteRepository';
import {
    VoteInterface,
    VoteRequestGetAllInterface,
} from '../interfaces/VoteInterface';
import { buildFilterGetAll } from '../utils/dataBase/filters';
import { buildPaginatedGetAll } from '../utils/dataBase/pagination';
import { HttpError } from '../utils/errors/HttpError';

@injectable()
class VoteService {
    constructor(
        @inject('VoteRepository')
        private voteRepository: IVoteRepository,

        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('MovieRepository')
        private movieRepository: IMovieRepository,
    ) {}

    public async create(voteData: VoteInterface): Promise<Vote> {
        const user = await this.userRepository.findById(voteData.user_id);

        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        if (user.is_active === false) {
            throw new HttpError(401, 'Unauthorized - This account is inactive');
        }

        const movie = await this.movieRepository.findById(voteData.movie_id);

        if (!movie) {
            throw new HttpError(404, 'Movie not found');
        }

        if (movie.votes) {
            const userVote = movie.votes?.find(vote => vote.user_id === user.id);

            if (userVote) {
                throw new HttpError(400, 'You already rated this movie');
            }
        }

        const createdVote = await this.voteRepository.createAndSave(voteData);

        return createdVote;
    }

    public async findById(id: string): Promise<Vote> {
        const voteFound = await this.voteRepository.findById(id);

        if (!voteFound) throw new HttpError(404, 'Vote not found');

        return voteFound;
    }

    public async getAll(
        queryParams: VoteRequestGetAllInterface,
    ): Promise<{ data: Vote[]; count: number }> {
        const options = buildFilterGetAll(queryParams);

        const votes = await this.voteRepository.getAll(options);

        return buildPaginatedGetAll(queryParams, votes);
    }

    public async update(id: string, updateData: VoteInterface): Promise<Vote> {
        const voteFound = await this.findById(id);

        const user = (await this.userRepository.findById(voteFound.user_id)) as User;

        if (user.is_active === false) {
            throw new HttpError(401, 'Unauthorized - This account is inactive');
        }

        if (voteFound.user_id !== updateData.user_id) {
            throw new HttpError(401, 'Unauthorized - Only owner can edit vote');
        }

        const voteUpdated = await this.voteRepository.createAndSave(
            Object.assign(voteFound, { ...updateData }),
        );

        return voteUpdated;
    }

    public async remove(
        id: string,
        user_id: string,
        is_admin: boolean,
    ): Promise<DeleteResult> {
        const vote = await this.findById(id);

        const user = (await this.userRepository.findById(user_id)) as User;

        if (user.is_active === false) {
            throw new HttpError(401, 'Unauthorized - This account is inactive');
        }

        if (vote.user_id !== user_id && is_admin === false) {
            throw new HttpError(
                401,
                'Unauthorized - Only owner or admins can remove vote',
            );
        }

        return this.voteRepository.remove(id);
    }
}

export default VoteService;
