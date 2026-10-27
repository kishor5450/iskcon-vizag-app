import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SadhanaService } from './sadhana.service';
import { ISadhanaRecord, SadhanaLogRequestDto } from '@temple/models';
import { AuthGuard } from '../auth/auth.guard';

@Controller('sadhana')
@UseGuards(AuthGuard)
export class SadhanaController {
  constructor(private readonly sadhanaService: SadhanaService) {}

  @Post('/getSadhanaHistory')
  async getSadhanaHistory(@Request() req: any): Promise<ISadhanaRecord[]> {
    try {
      return await this.sadhanaService.getSadhanaHistory(req.user.sub);
    } catch (error) {
      throw error;
    }
  }

  @Post('/getTodaySadhanaRecord')
  async getTodaySadhanaRecord(
    @Request() req: any,
    @Body('date') bodyDate?: string,
    @Query('date') queryDate?: string,
  ): Promise<ISadhanaRecord | null> {
    try {
      const date = bodyDate || queryDate || '';
      return await this.sadhanaService.getSadhanaRecordForDate(
        req.user.sub,
        date,
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('/getCommunitySadhanaStats')
  async getCommunitySadhanaStats() {
    try {
      return await this.sadhanaService.getCommunitySadhanaStats();
    } catch (error) {
      throw error;
    }
  }

  @Post('/logSadhanaRecord')
  async logSadhanaRecord(
    @Request() req: any,
    @Body() recordDto: SadhanaLogRequestDto,
  ): Promise<ISadhanaRecord> {
    try {
      return await this.sadhanaService.submitSadhanaRecord(
        req.user.sub,
        recordDto,
      );
    } catch (error) {
      throw error;
    }
  }
}
