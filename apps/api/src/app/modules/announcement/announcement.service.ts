import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnouncementEntity } from '../../entities/announcement.entity';
import { IAnnouncement, CreateAnnouncementRequestDto, AnnouncementType } from '@temple/models';

@Injectable()
export class AnnouncementService implements OnModuleInit {
  constructor(
    @InjectRepository(AnnouncementEntity)
    private readonly announcementRepository: Repository<AnnouncementEntity>
  ) {}

  async onModuleInit() {
    await this.seedDefaultAnnouncements();
  }

  async getAll(official?: boolean): Promise<IAnnouncement[]> {
    if (official !== undefined) {
      return this.announcementRepository.find({
        where: { official },
        order: { id: 'DESC' },
      });
    }
    return this.announcementRepository.find({
      order: { id: 'DESC' },
    });
  }

  async create(dto: CreateAnnouncementRequestDto): Promise<IAnnouncement> {
    const item = this.announcementRepository.create(dto);
    return this.announcementRepository.save(item);
  }

  private async seedDefaultAnnouncements(): Promise<void> {
    const count = await this.announcementRepository.count();
    if (count > 0) return;

    const defaults: Partial<AnnouncementEntity>[] = [
      {
        title: 'Janmashtami Celebrations',
        description: 'Special program, abhishek, and kirtan for Krishna Janmashtami from 25 Aug - 27 Aug.',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb061295a',
        type: AnnouncementType.FESTIVAL,
        date: '25 Aug - 27 Aug',
        time: '4:30 AM onwards',
        location: 'ISKCON Vizag Temple Hall',
        official: true,
      },
      {
        title: 'Mangala Arati Timing Change',
        description: 'From tomorrow onwards, Mangala Arati will commence at 4:15 AM sharp instead of 4:30 AM due to seasonal shifts.',
        type: AnnouncementType.TEMPLE,
        date: 'Today',
        time: '4:15 AM onwards',
        location: 'Main Temple',
        official: true,
      },
      {
        title: 'Bhagavad-gita Class',
        description: 'Chapter 2, Verse 20 discourse by HG Samba Das. Welcome all.',
        type: AnnouncementType.CLASSES,
        date: 'Tomorrow',
        time: '7:00 PM',
        location: 'Seminar Hall 1',
        official: true,
      },
      {
        title: 'Sunday Feast Program',
        description: 'Special lectures, sandhya arati, and delicious prasadam distribution for all devotees.',
        type: AnnouncementType.GENERAL,
        date: 'This Sunday',
        time: '5:30 PM',
        location: 'Kalyana Mandapam',
        official: true,
      },
      {
        title: 'Youth Program (Prerna)',
        description: 'Discourse and discussion on spiritual leadership for youths.',
        type: AnnouncementType.CLASSES,
        date: 'This Sunday',
        time: '10:00 AM',
        location: 'Youth Center Room 3',
        official: true,
      },
      {
        title: 'Rath Yatra 2026 Planning meeting',
        description: 'All volunteers welcome to join for scheduling sevadhari tasks.',
        type: AnnouncementType.SEVA,
        date: '10 Sep',
        time: '6:00 PM',
        location: 'Temple Committee Room',
        official: false, // Community discussion
      },
    ];

    for (const item of defaults) {
      await this.announcementRepository.save(this.announcementRepository.create(item));
    }
  }

  async delete(id: number): Promise<void> {
    await this.announcementRepository.delete(id);
  }
}
