import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Vote from './Vote';

@Entity('movies')
export default class Movie {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    director: string;

    @Column()
    name: string;

    @Column()
    genre: string;

    @Column()
    actors: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => Vote, vote => vote.movie, { eager: true })
    votes?: Vote[];
}
