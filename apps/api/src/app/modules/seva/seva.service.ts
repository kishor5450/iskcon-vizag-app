import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SevaOpportunityEntity } from '../../entities/seva-opportunity.entity';
import { ISevaOpportunity } from '@temple/models';

@Injectable()
export class SevaService implements OnModuleInit {
  constructor(
    @InjectRepository(SevaOpportunityEntity)
    private readonly sevaRepository: Repository<SevaOpportunityEntity>
  ) {}

  async onModuleInit() {
    await this.seedDefaultSevas();
  }

  async getAll(): Promise<ISevaOpportunity[]> {
    return this.sevaRepository.find({
      order: { date: 'ASC' },
    });
  }

  async create(dto: Partial<SevaOpportunityEntity>): Promise<ISevaOpportunity> {
    const item = this.sevaRepository.create(dto);
    return this.sevaRepository.save(item);
  }

  async register(id: number): Promise<ISevaOpportunity> {
    const seva = await this.sevaRepository.findOne({ where: { id } });
    if (!seva) {
      throw new NotFoundException('Seva opportunity not found');
    }

    if (seva.registeredDevoteesCount < seva.requiredDevoteesCount) {
      seva.registeredDevoteesCount += 1;
    }
    return this.sevaRepository.save(seva);
  }

  private async seedDefaultSevas(): Promise<void> {
    const count = await this.sevaRepository.count();
    if (count > 0) return;

    const defaults: Partial<SevaOpportunityEntity>[] = [
      {
        title: 'Festival Garland Making',
        description: 'Prepare beautiful fresh flower garlands for Their Lordships Sri Sri Radha Damodar.',
        date: '24 Aug',
        time: '8:00 AM - 12:00 PM',
        location: 'Temple Garland Room',
        requiredDevoteesCount: 15,
        registeredDevoteesCount: 8,
        official: true,
      },
      {
        title: 'Sunday Prasadam Distribution',
        description: 'Serving hot, delicious prasadam to visiting devotees and pilgrims.',
        date: 'This Sunday',
        time: '6:30 PM - 8:30 PM',
        location: 'Prasadam Hall',
        requiredDevoteesCount: 10,
        registeredDevoteesCount: 3,
        official: true,
      },
      {
        title: 'Janmashtami Temple Decoration Help',
        description: 'Putting up lights, banners, and mango leaf torans around the temple premises.',
        date: '24 Aug',
        time: '2:00 PM - 6:00 PM',
        location: 'Temple Courtyard',
        requiredDevoteesCount: 20,
        registeredDevoteesCount: 12,
        official: true,
      },
      {
        title: 'Cleanliness Seva (Swachh Mandir)',
        description: 'Cleaning the main temple courtyard and steps before the festival day.',
        date: '23 Aug',
        time: '6:00 AM - 8:00 AM',
        location: 'Temple Exterior',
        requiredDevoteesCount: 30,
        registeredDevoteesCount: 22,
        official: true,
      },
    ];

    for (const item of defaults) {
      await this.sevaRepository.save(this.sevaRepository.create(item));
    }
  }
}
