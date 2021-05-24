import { DeleteResult } from 'typeorm';
import Vote from '../../database/entities/Vote';
import { OptionsTypeOrmGetAll } from '../pagination';
import { VoteInterface } from '../VoteInterface';

export default interface IVoteRepository {
    createAndSave(voteData: VoteInterface): Promise<Vote>;
    findById(id: string): Promise<Vote | undefined>;
    getAll(options: OptionsTypeOrmGetAll): Promise<{ data: Vote[]; count: number }>;
    remove(id: string): Promise<DeleteResult>;
}
