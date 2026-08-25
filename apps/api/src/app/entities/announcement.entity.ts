import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IAnnouncement } from '@temple/models';

@Entity('announcements')
export class AnnouncementEntity implements IAnnouncement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image?: string;

  @Column({ type: 'varchar', length: 50, default: 'general' })
  type: 'festival' | 'temple' | 'classes' | 'seva' | 'general';

  @Column({ type: 'varchar', length: 50 })
  date: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  time?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'boolean', default: true })
  official: boolean; // true = Official ISKCON Vizag updates, false = Community feed

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;
}
