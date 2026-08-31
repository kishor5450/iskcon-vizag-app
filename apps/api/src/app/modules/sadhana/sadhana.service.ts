import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SadhanaRecordEntity } from '../../entities/sadhana-record.entity';
import { DevoteeEntity } from '../../entities/devotee.entity';
import { ISadhanaRecord, SadhanaLogRequestDto } from '@temple/models';

@Injectable()
export class SadhanaService {
  constructor(
    @InjectRepository(SadhanaRecordEntity)
    private readonly recordRepository: Repository<SadhanaRecordEntity>,
    @InjectRepository(DevoteeEntity)
    private readonly devoteeRepository: Repository<DevoteeEntity>
  ) {}

  async getHistory(devoteeId: number): Promise<ISadhanaRecord[]> {
    return this.recordRepository.find({
      where: { devoteeId },
      order: { date: 'DESC' },
      take: 30, // Last 30 logs
    });
  }

  async getRecordForDate(devoteeId: number, date: string): Promise<ISadhanaRecord | null> {
    return this.recordRepository.findOne({
      where: { devoteeId, date },
    });
  }

  async submitRecord(devoteeId: number, dto: SadhanaLogRequestDto): Promise<ISadhanaRecord> {
    if (!dto.date) {
      throw new BadRequestException('Date is required');
    }

    const devotee = await this.devoteeRepository.findOne({ where: { id: devoteeId } });
    if (!devotee) {
      throw new BadRequestException('Devotee not found');
    }

    // Check if a record already exists for this date
    let record = await this.recordRepository.findOne({
      where: { devoteeId, date: dto.date },
    });

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
      record = this.recordRepository.create({
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

    const savedRecord = await this.recordRepository.save(record);

    // Update Devotee Streaks & Total Rounds
    // Accumulate total rounds difference
    const roundsDiff = newRounds - oldRounds;
    devotee.totalRoundsChanted += roundsDiff;

    // Compute streak if this is a new day log or updating today/yesterday
    await this.updateDevoteeStreaks(devotee, dto.date);

    await this.devoteeRepository.save(devotee);

    return savedRecord;
  }

  private async updateDevoteeStreaks(devotee: DevoteeEntity, logDateStr: string): Promise<void> {
    // Standard format YYYY-MM-DD
    const logDate = new Date(logDateStr);
    
    // Find last logged day before logDateStr
    const previousLogs = await this.recordRepository.createQueryBuilder('record')
      .where('record.devoteeId = :devoteeId', { devoteeId: devotee.id })
      .andWhere('record.date < :logDateStr', { logDateStr })
      .orderBy('record.date', 'DESC')
      .take(1)
      .getMany();

    if (previousLogs.length === 0) {
      // This is their very first log
      devotee.currentStreak = 1;
    } else {
      const lastLogDateStr = previousLogs[0].date;
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

  async getCommunityStats() {
    const roundsResult = await this.recordRepository
      .createQueryBuilder('record')
      .select('SUM(record.japaRoundsCount)', 'totalJapaRounds')
      .getRawOne();
      
    const nbsResult = await this.recordRepository
      .createQueryBuilder('record')
      .where('record.nbsJoined = :nbsJoined', { nbsJoined: true })
      .select('COUNT(record.id)', 'totalNbsAttended')
      .getRawOne();
      
    const readingResult = await this.recordRepository
      .createQueryBuilder('record')
      .where('record.readingCompleted = :readingCompleted', { readingCompleted: true })
      .select('COUNT(record.id)', 'totalReadingSessions')
      .getRawOne();

    const aratiResult = await this.recordRepository
      .createQueryBuilder('record')
      .where('record.mangalaArati = :mangalaArati', { mangalaArati: true })
      .select('COUNT(record.id)', 'totalAratis')
      .getRawOne();

    return {
      totalJapaRounds: parseInt(roundsResult?.totalJapaRounds || '0', 10),
      totalNbsAttended: parseInt(nbsResult?.totalNbsAttended || '0', 10),
      totalReadingSessions: parseInt(readingResult?.totalReadingSessions || '0', 10),
      totalAratis: parseInt(aratiResult?.totalAratis || '0', 10)
    };
  }
}
