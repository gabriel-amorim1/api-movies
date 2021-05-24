import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Movie from './Movie';
import User from './User';

@Entity('votes')
export default class Vote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column()
    movie_id: string;

    @Column()
    rating: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToOne(() => User, user => user.votes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @ManyToOne(() => Movie, movie => movie.votes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movie_id' })
    movie?: Movie;
}
