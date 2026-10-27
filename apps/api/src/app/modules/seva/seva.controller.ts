import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SevaService } from './seva.service';
import { ISevaOpportunity, CreateSevaRequestDto } from '@temple/models';
import { AuthGuard } from '../auth/auth.guard';

@Controller('sevas')
@UseGuards(AuthGuard)
export class SevaController {
  constructor(private readonly sevaService: SevaService) {}

  @Post('/getAll')
  @Post('list')
  @Get()
  async getAllSevas(): Promise<ISevaOpportunity[]> {
    try {
      return await this.sevaService.getAllSevas();
    } catch (error) {
      throw error;
    }
  }

  @Post('/create')
  @Post()
  async createSeva(@Body() dto: CreateSevaRequestDto): Promise<ISevaOpportunity> {
    try {
      return await this.sevaService.createSeva(dto);
    } catch (error) {
      throw error;
    }
  }

  @Post('/register')
  @Post(':id/register')
  async registerForSeva(@Param('id') paramId?: string, @Body('id') bodyId?: number): Promise<ISevaOpportunity> {
    try {
      const id = paramId ? Number(paramId) : Number(bodyId);
      return await this.sevaService.registerForSeva(id);
    } catch (error) {
      throw error;
    }
  }
}
