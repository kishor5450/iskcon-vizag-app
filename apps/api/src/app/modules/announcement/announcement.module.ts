import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementEntity } from '../../entities/announcement.entity';
import { AnnouncementRepository } from '../../entities/repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AnnouncementEntity]), AuthModule],
  controllers: [AnnouncementController],
  providers: [AnnouncementRepository, AnnouncementService],
  exports: [AnnouncementService, AnnouncementRepository],
})
export class AnnouncementModule {}
