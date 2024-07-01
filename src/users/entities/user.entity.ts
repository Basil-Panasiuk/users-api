import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Position } from '../positions/entities/position.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @ManyToOne(() => Position, (position) => position.users)
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @Column()
  photo: string;

  @CreateDateColumn({ type: 'timestamp', name: 'registration_timestamp' })
  registrationTimestamp: Date;
}
