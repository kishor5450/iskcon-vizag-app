import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { IDevotee, PreferredLanguage, DevoteeRole } from '@temple/models';
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

  @Column({ type: 'enum', enum: PreferredLanguage, default: PreferredLanguage.ENGLISH })
  preferredLanguage: PreferredLanguage;

  @Column({ type: 'enum', enum: DevoteeRole, default: DevoteeRole.DEVOTEE })
  role: DevoteeRole;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @OneToMany(() => SadhanaRecordEntity, (record) => record.devotee)
  sadhanaRecords: SadhanaRecordEntity[];
}
