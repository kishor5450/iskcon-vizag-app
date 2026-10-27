import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SevaService } from './seva.service';
import {
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
  async getAllSevas(
    @Body() req: GetAllSevasRequest,
  ): Promise<GetAllSevasResponse> {
    try {
      return await this.sevaService.getAllSevas(req);
    } catch (error) {
      return returnException(GetAllSevasResponse, error);
    }
  }

  @Post('/createSeva')
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
  async registerForSevaById(
    @Body() req: RegisterForSevaByIdRequest,
  ): Promise<RegisterForSevaResponse> {
    try {
      return await this.sevaService.registerForSevaById(req);
    } catch (error) {
      return returnException(RegisterForSevaResponse, error);
    }
  }
}
