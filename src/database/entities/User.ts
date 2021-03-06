import bcrypt from 'bcrypt';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Vote from './Vote';

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    password: string;

    @Column({ select: false })
    password_hash: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: false, select: false })
    is_admin: boolean;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => Vote, vote => vote.user, { eager: true })
    votes?: Vote[];

    @BeforeInsert()
    @BeforeUpdate()
    private async savePasswordHash(): Promise<void> {
        if (this.password) {
            this.password_hash = await bcrypt.hash(this.password, 8);
        }
    }

    async checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password_hash);
    }
}
