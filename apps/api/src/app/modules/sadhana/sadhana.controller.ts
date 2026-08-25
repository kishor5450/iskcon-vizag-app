import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { SadhanaService } from './sadhana.service';
import { ISadhanaRecord, SadhanaLogRequestDto } from '@temple/models';
import { AuthGuard } from '../auth/auth.guard';

@Controller('sadhana')
@UseGuards(AuthGuard)
export class SadhanaController {
  constructor(private readonly sadhanaService: SadhanaService) {}

  @Get('history')
  async getHistory(@Request() req): Promise<ISadhanaRecord[]> {
    return this.sadhanaService.getHistory(req.user.sub);
  }

  @Get('today')
  async getTodayRecord(
    @Request() req,
    @Query('date') date: string
  ): Promise<ISadhanaRecord | null> {
    return this.sadhanaService.getRecordForDate(req.user.sub, date);
  }

  @Post('log')
  async logSadhana(
    @Request() req,
    @Body() recordDto: SadhanaLogRequestDto
  ): Promise<ISadhanaRecord> {
    return this.sadhanaService.submitRecord(req.user.sub, recordDto);
  }
}
