import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SevaService } from './seva.service';
import { SevaController } from './seva.controller';
import { SevaOpportunityEntity } from '../../entities/seva-opportunity.entity';
import { SevaOpportunityRepository } from '../../entities/repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SevaOpportunityEntity]),
    AuthModule,
  ],
  controllers: [SevaController],
  providers: [SevaOpportunityRepository, SevaService],
  exports: [SevaService, SevaOpportunityRepository],
})
export class SevaModule {}
