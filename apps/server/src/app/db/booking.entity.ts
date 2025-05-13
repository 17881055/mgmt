import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Session } from './session.entity';

@Entity({ name: 'booking' })
export class Booking extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Session, (session) => session.user)
    sessions: Session[];

    @Column({
        length: 255,
    })
    email: string;

    @Column()
    hash: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        nullable: true,
    })
    position: string;

    @Column({
        default: true,
    })
    isActive: boolean;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
