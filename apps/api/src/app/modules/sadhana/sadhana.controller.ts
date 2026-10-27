import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { SadhanaService } from './sadhana.service';
import { ISadhanaRecord, SadhanaLogRequestDto } from '@temple/models';
import { AuthGuard } from '../auth/auth.guard';

@Controller('sadhana')
@UseGuards(AuthGuard)
export class SadhanaController {
  constructor(private readonly sadhanaService: SadhanaService) {}

  @Post('/getHistory')
  @Post('history')
  @Get('history')
  async getSadhanaHistory(@Request() req: any): Promise<ISadhanaRecord[]> {
    try {
      return await this.sadhanaService.getSadhanaHistory(req.user.sub);
    } catch (error) {
      throw error;
    }
  }

  @Post('/getTodayRecord')
  @Post('today')
  @Get('today')
  async getTodaySadhanaRecord(
    @Request() req: any,
    @Query('date') queryDate?: string,
    @Body('date') bodyDate?: string
  ): Promise<ISadhanaRecord | null> {
    try {
      const date = bodyDate || queryDate || '';
      return await this.sadhanaService.getSadhanaRecordForDate(req.user.sub, date);
    } catch (error) {
      throw error;
    }
  }

  @Post('/getCommunityStats')
  @Post('community-stats')
  @Get('community-stats')
  async getCommunitySadhanaStats() {
    try {
      return await this.sadhanaService.getCommunitySadhanaStats();
    } catch (error) {
      throw error;
    }
  }

  @Post('/logSadhana')
  @Post('log')
  async logSadhanaRecord(
    @Request() req: any,
    @Body() recordDto: SadhanaLogRequestDto
  ): Promise<ISadhanaRecord> {
    try {
      return await this.sadhanaService.submitSadhanaRecord(req.user.sub, recordDto);
    } catch (error) {
      throw error;
    }
  }
}
