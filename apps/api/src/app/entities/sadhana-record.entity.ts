import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ISadhanaRecord } from '@temple/models';
import { DevoteeEntity } from './devotee.entity';

@Entity('sadhana_records')
export class SadhanaRecordEntity implements ISadhanaRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  devoteeId: number;

  @Column({ type: 'varchar', length: 10 })
  date: string; // YYYY-MM-DD format

  @Column({ type: 'int', default: 0 })
  japaRoundsCount: number;

  @Column({ type: 'boolean', default: false })
  readingCompleted: boolean;

  @Column({ type: 'varchar', length: 255, default: '' })
  readingProgress: string;

  @Column({ type: 'boolean', default: false })
  mangalaArati: boolean;

  @Column({ type: 'boolean', default: false })
  morningPrayer: boolean;

  @Column({ type: 'boolean', default: false })
  spiritualLecture: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @ManyToOne(() => DevoteeEntity, (devotee) => devotee.sadhanaRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'devoteeId' })
  devotee: DevoteeEntity;
}
