import { Injectable, OnModuleInit } from '@nestjs/common';
import { AnnouncementRepository } from '../../entities/repository';
import { AnnouncementEntity } from '../../entities/announcement.entity';
import { IAnnouncement, CreateAnnouncementRequestDto, AnnouncementType } from '@temple/models';

@Injectable()
export class AnnouncementService implements OnModuleInit {
  constructor(
    private readonly announcementRepository: AnnouncementRepository
  ) {}

  async onModuleInit() {
    await this.seedDefaultAnnouncements();
  }

  async getAllAnnouncements(official?: boolean): Promise<IAnnouncement[]> {
    return this.announcementRepository.getAllAnnouncements(official);
  }

  // Alias for backward compatibility
  async getAll(official?: boolean): Promise<IAnnouncement[]> {
    return this.getAllAnnouncements(official);
  }

  async createAnnouncement(dto: CreateAnnouncementRequestDto): Promise<IAnnouncement> {
    const item = this.announcementRepository.createAnnouncement(dto);
    return this.announcementRepository.saveAnnouncement(item);
  }

  // Alias for backward compatibility
  async create(dto: CreateAnnouncementRequestDto): Promise<IAnnouncement> {
    return this.createAnnouncement(dto);
  }

  private async seedDefaultAnnouncements(): Promise<void> {
    const count = await this.announcementRepository.countAnnouncements();
    if (count > 0) return;

    const defaults: Partial<AnnouncementEntity>[] = [
      {
        title: 'Janmashtami Celebrations',
        description: 'Special program, abhishek, and kirtan for Krishna Janmashtami from 25 Aug - 27 Aug.',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363',
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
        official: false,
      },
    ];

    for (const item of defaults) {
      await this.announcementRepository.saveAnnouncement(this.announcementRepository.createAnnouncement(item));
    }
  }

  async deleteAnnouncement(id: number): Promise<void> {
    await this.announcementRepository.deleteAnnouncement(id);
  }

  // Alias for backward compatibility
  async delete(id: number): Promise<void> {
    return this.deleteAnnouncement(id);
  }
}
