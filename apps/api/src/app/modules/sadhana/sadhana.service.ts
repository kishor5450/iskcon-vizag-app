import { Injectable, BadRequestException } from '@nestjs/common';
import {
  SadhanaRecordRepository,
  DevoteeRepository,
} from '../../entities/repository';
import { DevoteeEntity } from '../../entities/devotee.entity';
import { ISadhanaRecord, SadhanaLogRequestDto } from '@temple/models';

@Injectable()
export class SadhanaService {
  constructor(
    private readonly recordRepository: SadhanaRecordRepository,
    private readonly devoteeRepository: DevoteeRepository,
  ) {}

  async getSadhanaHistory(devoteeId: number): Promise<ISadhanaRecord[]> {
    return this.recordRepository.getHistoryByDevoteeId(devoteeId);
  }

  async getSadhanaRecordForDate(
    devoteeId: number,
    date: string,
  ): Promise<ISadhanaRecord | null> {
    return this.recordRepository.getRecordForDate(devoteeId, date);
  }

  async submitSadhanaRecord(
    devoteeId: number,
    dto: SadhanaLogRequestDto,
  ): Promise<ISadhanaRecord> {
    if (!dto.date) {
      throw new BadRequestException('Date is required');
    }

    const devotee = await this.devoteeRepository.findById(devoteeId);
    if (!devotee) {
      throw new BadRequestException('Devotee not found');
    }

    // Check if a record already exists for this date
    let record = await this.recordRepository.getRecordForDate(
      devoteeId,
      dto.date,
    );

    const oldRounds = record ? record.japaRoundsCount : 0;
    const newRounds = dto.japaRoundsCount ?? 0;

    if (record) {
      // Update existing record
      record.japaRoundsCount = newRounds;
      record.readingCompleted = dto.readingCompleted ?? record.readingCompleted;
      record.readingProgress = dto.readingProgress ?? record.readingProgress;
      record.mangalaArati = dto.mangalaArati ?? record.mangalaArati;
      record.morningPrayer = dto.morningPrayer ?? record.morningPrayer;
      record.spiritualLecture = dto.spiritualLecture ?? record.spiritualLecture;
      record.nbsJoined = dto.nbsJoined ?? record.nbsJoined;
    } else {
      // Create new record
      record = this.recordRepository.createRecord({
        devoteeId,
        date: dto.date,
        japaRoundsCount: newRounds,
        readingCompleted: dto.readingCompleted ?? false,
        readingProgress: dto.readingProgress ?? '',
        mangalaArati: dto.mangalaArati ?? false,
        morningPrayer: dto.morningPrayer ?? false,
        spiritualLecture: dto.spiritualLecture ?? false,
        nbsJoined: dto.nbsJoined ?? false,
      });
    }

    const savedRecord = await this.recordRepository.saveRecord(record);

    // Update Devotee Streaks & Total Rounds
    const roundsDiff = newRounds - oldRounds;
    devotee.totalRoundsChanted += roundsDiff;

    // Compute streak if this is a new day log or updating today/yesterday
    await this.updateDevoteeStreaks(devotee, dto.date);

    await this.devoteeRepository.saveDevotee(devotee);

    return savedRecord;
  }

  private async updateDevoteeStreaks(
    devotee: DevoteeEntity,
    logDateStr: string,
  ): Promise<void> {
    const logDate = new Date(logDateStr);

    // Find last logged day before logDateStr using custom repository method
    const previousLog = await this.recordRepository.getPreviousLogBeforeDate(
      devotee.id,
      logDateStr,
    );

    if (!previousLog) {
      // This is their very first log
      devotee.currentStreak = 1;
    } else {
      const lastLogDateStr = previousLog.date;
      const lastLogDate = new Date(lastLogDateStr);

      const diffTime = Math.abs(logDate.getTime() - lastLogDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Logged consecutive day, increment streak
        devotee.currentStreak += 1;
      } else if (diffDays > 1) {
        // Missed days, reset streak to 1
        devotee.currentStreak = 1;
      }
      // If diffDays === 0, updating the same day log, so streak remains unchanged
    }

    // Update best streak
    if (devotee.currentStreak > devotee.bestStreak) {
      devotee.bestStreak = devotee.currentStreak;
    }
  }

  async getCommunitySadhanaStats() {
    return this.recordRepository.getCommunityStats();
  }
}
