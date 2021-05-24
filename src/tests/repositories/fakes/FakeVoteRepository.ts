/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteResult } from 'typeorm';
import { v4 } from 'uuid';
import Vote from '../../../database/entities/Vote';
import { VoteInterface } from '../../../interfaces/VoteInterface';
import { OptionsTypeOrmGetAll } from '../../../interfaces/pagination';
import IVoteRepository from '../../../interfaces/repositories/IVoteRepository';

export default class FakeVoteRepository implements IVoteRepository {
    private votes: Vote[] = [];

    public async createAndSave(voteData: VoteInterface): Promise<Vote> {
        if (!voteData.id) {
            const vote = Object.assign(new Vote(), voteData);

            vote.id = v4();
            vote.created_at = new Date();
            vote.updated_at = new Date();

            this.votes.push(vote);

            return vote;
        }

        const index = this.votes.findIndex(item => item.id === voteData.id);

        this.votes[index] = {
            ...this.votes[index],
            ...voteData,
            updated_at: new Date(),
        } as Vote;

        return this.votes[index];
    }

    public async findById(id: string): Promise<Vote | undefined> {
        return this.votes.find(vote => vote.id === id);
    }

    public async getAll(
        options: OptionsTypeOrmGetAll,
    ): Promise<{ data: Vote[]; count: number }> {
        return { data: this.votes, count: this.votes.length };
    }

    public async remove(id: string): Promise<DeleteResult> {
        this.votes = this.votes.filter(vote => vote.id === id);

        return { affected: 1, raw: [] };
    }
}
