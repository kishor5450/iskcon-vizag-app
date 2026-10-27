import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SevaService } from './seva.service';
import {
  ISevaOpportunity,
  CreateSevaRequestDto,
  RegisterForSevaByIdRequest,
  GetAllSevasRequest,
  GetAllSevasResponse,
  CreateSevaResponse,
  RegisterForSevaResponse,
} from '@temple/models';
import { AuthGuard } from '../auth/auth.guard';
import { returnException } from '../../core/backend-utils';

@Controller('sevas')
@UseGuards(AuthGuard)
export class SevaController {
  constructor(private readonly sevaService: SevaService) {}

  @Post('/getAllSevas')
  @Post('/getAll')
  @Post('list')
  async getAllSevas(
    @Body() req: GetAllSevasRequest,
  ): Promise<GetAllSevasResponse> {
    try {
      return await this.sevaService.getAllSevas(req);
    } catch (error) {
      return returnException(GetAllSevasResponse, error);
    }
  }

  // Legacy GET for mobile compatibility
  @Get()
  async getAllSevasLegacy(): Promise<ISevaOpportunity[]> {
    const res = await this.sevaService.getAllSevas();
    return res.data || [];
  }

  @Post('/createSeva')
  @Post('/create')
  @Post()
  async createSeva(
    @Body() req: CreateSevaRequestDto,
  ): Promise<CreateSevaResponse> {
    try {
      return await this.sevaService.createSeva(req);
    } catch (error) {
      return returnException(CreateSevaResponse, error);
    }
  }

  @Post('/registerForSevaById')
  @Post('/registerForSeva')
  @Post('/register')
  @Post(':id/register')
  async registerForSevaById(
    @Param('id') paramId?: string,
    @Body() req?: RegisterForSevaByIdRequest | { id?: number },
  ): Promise<RegisterForSevaResponse> {
    try {
      const targetId = paramId ? Number(paramId) : Number(req?.id);
      return await this.sevaService.registerForSevaById({ id: targetId });
    } catch (error) {
      return returnException(RegisterForSevaResponse, error);
    }
  }
}
