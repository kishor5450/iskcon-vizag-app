import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SadhanaService } from './sadhana.service';
import { SadhanaController } from './sadhana.controller';
import { SadhanaRecordEntity } from '../../entities/sadhana-record.entity';
import { DevoteeEntity } from '../../entities/devotee.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SadhanaRecordEntity, DevoteeEntity]),
    AuthModule,
  ],
  controllers: [SadhanaController],
  providers: [SadhanaService],
})
export class SadhanaModule {}
