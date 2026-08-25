import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { IDevotee } from '@temple/models';
import { SadhanaRecordEntity } from './sadhana-record.entity';

@Entity('devotees')
export class DevoteeEntity implements IDevotee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password?: string; // Hashed password for authentication

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'int', default: 16 })
  japaGoal: number;

  @Column({ type: 'int', default: 0 })
  currentStreak: number;

  @Column({ type: 'int', default: 0 })
  bestStreak: number;

  @Column({ type: 'int', default: 0 })
  totalRoundsChanted: number;

  @Column({ type: 'varchar', length: 10, default: 'en' })
  preferredLanguage: 'en' | 'te' | 'hi';

  @Column({ type: 'varchar', length: 20, default: 'devotee' })
  role: 'devotee' | 'admin';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @OneToMany(() => SadhanaRecordEntity, (record) => record.devotee)
  sadhanaRecords: SadhanaRecordEntity[];
}
