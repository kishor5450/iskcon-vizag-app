import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ISevaOpportunity } from '@temple/models';

@Entity('sevas')
export class SevaOpportunityEntity implements ISevaOpportunity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  date: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  time?: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'int', default: 0 })
  requiredDevoteesCount: number;

  @Column({ type: 'int', default: 0 })
  registeredDevoteesCount: number;

  @Column({ type: 'boolean', default: true })
  official: boolean;

  @CreateDateColumn()
  createdAt: string;
}
