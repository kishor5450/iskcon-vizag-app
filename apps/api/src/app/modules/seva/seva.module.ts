import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SevaService } from './seva.service';
import { SevaController } from './seva.controller';
import { SevaOpportunityEntity } from '../../entities/seva-opportunity.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SevaOpportunityEntity]),
    AuthModule,
  ],
  controllers: [SevaController],
  providers: [SevaService],
})
export class SevaModule {}
