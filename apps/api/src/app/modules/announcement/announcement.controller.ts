import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { IAnnouncement, CreateAnnouncementRequestDto } from '@temple/models';
import { AuthGuard } from '../auth/auth.guard';

@Controller('announcements')
@UseGuards(AuthGuard)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  async getAll(
    @Query('official') official?: string
  ): Promise<IAnnouncement[]> {
    const isOfficial = official === undefined ? undefined : official === 'true';
    return this.announcementService.getAll(isOfficial);
  }

  @Post()
  async create(@Body() dto: CreateAnnouncementRequestDto): Promise<IAnnouncement> {
    return this.announcementService.create(dto);
  }
}
