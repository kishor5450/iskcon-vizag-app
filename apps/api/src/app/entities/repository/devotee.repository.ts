import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DevoteeEntity } from '../devotee.entity';

@Injectable()
export class DevoteeRepository extends Repository<DevoteeEntity> {
  constructor(private dataSource: DataSource) {
    super(DevoteeEntity, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<DevoteeEntity | null> {
    return this.findOne({ where: { email } });
  }

  async findById(id: number): Promise<DevoteeEntity | null> {
    return this.findOne({ where: { id } });
  }

  async getAllDevoteesWithRecords(): Promise<DevoteeEntity[]> {
    return this.find({
      relations: { sadhanaRecords: true },
      order: { totalRoundsChanted: 'DESC' },
    });
  }

  createDevotee(data: Partial<DevoteeEntity>): DevoteeEntity {
    return this.create(data);
  }

  async saveDevotee(devotee: DevoteeEntity): Promise<DevoteeEntity> {
    return this.save(devotee);
  }

  async updatePreferences(id: number, lang: string, japaGoal: number): Promise<void> {
    await this.update(id, { preferredLanguage: lang as any, japaGoal });
  }

  async updateAvatar(id: number, avatarUrl: string): Promise<void> {
    await this.update(id, { avatarUrl });
  }
}
