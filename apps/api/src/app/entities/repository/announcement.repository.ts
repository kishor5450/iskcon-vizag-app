import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AnnouncementEntity } from '../announcement.entity';

@Injectable()
export class AnnouncementRepository extends Repository<AnnouncementEntity> {
  constructor(private dataSource: DataSource) {
    super(AnnouncementEntity, dataSource.createEntityManager());
  }

  async getAllAnnouncements(official?: boolean): Promise<AnnouncementEntity[]> {
    if (official !== undefined) {
      return this.find({
        where: { official },
        order: { id: 'DESC' },
      });
    }
    return this.find({
      order: { id: 'DESC' },
    });
  }

  async findById(id: number): Promise<AnnouncementEntity | null> {
    return this.findOne({ where: { id } });
  }

  createAnnouncement(data: Partial<AnnouncementEntity>): AnnouncementEntity {
    return this.create(data);
  }

  async saveAnnouncement(announcement: AnnouncementEntity): Promise<AnnouncementEntity> {
    return this.save(announcement);
  }

  async deleteAnnouncement(id: number): Promise<void> {
    await this.delete(id);
  }

  async countAnnouncements(): Promise<number> {
    return this.count();
  }
}
