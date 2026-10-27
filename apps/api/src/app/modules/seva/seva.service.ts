import { Injectable, OnModuleInit } from '@nestjs/common';
import { SevaOpportunityRepository } from '../../entities/repository';
import { SevaOpportunityEntity } from '../../entities/seva-opportunity.entity';
import {
  ISevaOpportunity,
  CreateSevaRequestDto,
  ErrorResponse,
  GetAllSevasRequest,
  GetAllSevasResponse,
  CreateSevaResponse,
  RegisterForSevaByIdRequest,
  RegisterForSevaResponse,
} from '@temple/models';

@Injectable()
export class SevaService implements OnModuleInit {
  constructor(private readonly sevaRepository: SevaOpportunityRepository) {}

  async onModuleInit() {
    await this.seedDefaultSevas();
  }

  async getAllSevas(req?: GetAllSevasRequest): Promise<GetAllSevasResponse> {
    const list = await this.sevaRepository.getAllSevas();
    return new GetAllSevasResponse(
      true,
      1100,
      'Sevas retrieved successfully',
      list,
    );
  }

  async createSeva(req: CreateSevaRequestDto): Promise<CreateSevaResponse> {
    if (!req.title || !req.location) {
      throw new ErrorResponse(1101, 'Title and location are mandatory');
    }
    const item = this.sevaRepository.createSeva(req);
    const saved = await this.sevaRepository.saveSeva(item);
    return new CreateSevaResponse(
      true,
      1102,
      'Seva opportunity created successfully',
      saved,
    );
  }

  async registerForSevaById(
    req: RegisterForSevaByIdRequest | number,
  ): Promise<RegisterForSevaResponse> {
    const targetId = typeof req === 'number' ? req : req?.id;
    if (!targetId) {
      throw new ErrorResponse(1103, 'Seva ID is mandatory');
    }
    const seva = await this.sevaRepository.findById(targetId);
    if (!seva) {
      throw new ErrorResponse(1104, 'Seva opportunity not found');
    }

    if (seva.registeredDevoteesCount < seva.requiredDevoteesCount) {
      seva.registeredDevoteesCount += 1;
    }
    const saved = await this.sevaRepository.saveSeva(seva);
    return new RegisterForSevaResponse(
      true,
      1105,
      'Registered for seva successfully',
      saved,
    );
  }

  private async seedDefaultSevas(): Promise<void> {
    const count = await this.sevaRepository.countSevas();
    if (count > 0) return;

    const defaults: Partial<SevaOpportunityEntity>[] = [
      {
        title: 'Festival Garland Making',
        description:
          'Prepare beautiful fresh flower garlands for Their Lordships Sri Sri Radha Damodar.',
        date: '24 Aug',
        time: '8:00 AM - 12:00 PM',
        location: 'Temple Garland Room',
        requiredDevoteesCount: 15,
        registeredDevoteesCount: 8,
        official: true,
      },
      {
        title: 'Sunday Prasadam Distribution',
        description:
          'Serving hot, delicious prasadam to visiting devotees and pilgrims.',
        date: 'This Sunday',
        time: '6:30 PM - 8:30 PM',
        location: 'Prasadam Hall',
        requiredDevoteesCount: 10,
        registeredDevoteesCount: 3,
        official: true,
      },
      {
        title: 'Janmashtami Temple Decoration Help',
        description:
          'Putting up lights, banners, and mango leaf torans around the temple premises.',
        date: '24 Aug',
        time: '2:00 PM - 6:00 PM',
        location: 'Temple Courtyard',
        requiredDevoteesCount: 20,
        registeredDevoteesCount: 12,
        official: true,
      },
      {
        title: 'Cleanliness Seva (Swachh Mandir)',
        description:
          'Cleaning the main temple courtyard and steps before the festival day.',
        date: '23 Aug',
        time: '6:00 AM - 8:00 AM',
        location: 'Temple Exterior',
        requiredDevoteesCount: 30,
        registeredDevoteesCount: 22,
        official: true,
      },
    ];

    for (const item of defaults) {
      await this.sevaRepository.saveSeva(this.sevaRepository.createSeva(item));
    }
  }
}
