import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SadhanaRecordEntity } from '../sadhana-record.entity';

@Injectable()
export class SadhanaRecordRepository extends Repository<SadhanaRecordEntity> {
  constructor(private dataSource: DataSource) {
    super(SadhanaRecordEntity, dataSource.createEntityManager());
  }

  async getHistoryByDevoteeId(devoteeId: number, limit = 30): Promise<SadhanaRecordEntity[]> {
    return this.find({
      where: { devoteeId },
      order: { date: 'DESC' },
      take: limit,
    });
  }

  async getRecordForDate(devoteeId: number, date: string): Promise<SadhanaRecordEntity | null> {
    return this.findOne({
      where: { devoteeId, date },
    });
  }

  async getPreviousLogBeforeDate(devoteeId: number, logDateStr: string): Promise<SadhanaRecordEntity | null> {
    const previousLogs = await this.createQueryBuilder('record')
      .where('record.devoteeId = :devoteeId', { devoteeId })
      .andWhere('record.date < :logDateStr', { logDateStr })
      .orderBy('record.date', 'DESC')
      .take(1)
      .getMany();

    return previousLogs.length > 0 ? previousLogs[0] : null;
  }

  async getCommunityStats() {
    const roundsResult = await this.createQueryBuilder('record')
      .select('SUM(record.japaRoundsCount)', 'totalJapaRounds')
      .getRawOne();

    const nbsResult = await this.createQueryBuilder('record')
      .where('record.nbsJoined = :nbsJoined', { nbsJoined: true })
      .select('COUNT(record.id)', 'totalNbsAttended')
      .getRawOne();

    const readingResult = await this.createQueryBuilder('record')
      .where('record.readingCompleted = :readingCompleted', { readingCompleted: true })
      .select('COUNT(record.id)', 'totalReadingSessions')
      .getRawOne();

    const aratiResult = await this.createQueryBuilder('record')
      .where('record.mangalaArati = :mangalaArati', { mangalaArati: true })
      .select('COUNT(record.id)', 'totalAratis')
      .getRawOne();

    return {
      totalJapaRounds: Number(roundsResult?.totalJapaRounds || 0),
      totalNbsAttended: Number(nbsResult?.totalNbsAttended || 0),
      totalReadingSessions: Number(readingResult?.totalReadingSessions || 0),
      totalAratis: Number(aratiResult?.totalAratis || 0),
    };
  }

  createRecord(data: Partial<SadhanaRecordEntity>): SadhanaRecordEntity {
    return this.create(data);
  }

  async saveRecord(record: SadhanaRecordEntity): Promise<SadhanaRecordEntity> {
    return this.save(record);
  }
}
