import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SevaService } from './seva.service';
import { SevaOpportunityEntity } from '../../entities/seva-opportunity.entity';
import { ISevaOpportunity } from '@temple/models';
import { AuthGuard } from '../auth/auth.guard';

@Controller('sevas')
@UseGuards(AuthGuard)
export class SevaController {
  constructor(private readonly sevaService: SevaService) {}

  @Get()
  async getAll(): Promise<ISevaOpportunity[]> {
    return this.sevaService.getAll();
  }

  @Post()
  async create(@Body() dto: Partial<SevaOpportunityEntity>): Promise<ISevaOpportunity> {
    return this.sevaService.create(dto);
  }

  @Post(':id/register')
  async register(@Param('id', ParseIntPipe) id: number): Promise<ISevaOpportunity> {
    return this.sevaService.register(id);
  }
}
