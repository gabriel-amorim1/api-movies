import { DeleteResult, getRepository, Repository } from 'typeorm';
import Vote from '../database/entities/Vote';
import { OptionsTypeOrmGetAll } from '../interfaces/pagination';
import IVoteRepository from '../interfaces/repositories/IVoteRepository';
import { VoteInterface } from '../interfaces/VoteInterface';

export default class VoteRepository implements IVoteRepository {
    private ormRepository: Repository<Vote>;

    constructor() {
        this.ormRepository = getRepository(Vote);
    }

    public async createAndSave(voteData: VoteInterface): Promise<Vote> {
        const vote = Object.assign(new Vote(), voteData);

        return this.ormRepository.save(vote);
    }

    public async findById(id: string): Promise<Vote | undefined> {
        return this.ormRepository.findOne(id);
    }

    public async getAll(
        options: OptionsTypeOrmGetAll,
    ): Promise<{ data: Vote[]; count: number }> {
        const [data, count] = await this.ormRepository.findAndCount(options);

        return { data, count };
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.ormRepository.delete(id);
    }
}
