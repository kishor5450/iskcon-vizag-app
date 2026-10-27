import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SevaOpportunityEntity } from '../seva-opportunity.entity';

@Injectable()
export class SevaOpportunityRepository extends Repository<SevaOpportunityEntity> {
  constructor(private dataSource: DataSource) {
    super(SevaOpportunityEntity, dataSource.createEntityManager());
  }

  async getAllSevas(): Promise<SevaOpportunityEntity[]> {
    return this.find({
      order: { date: 'ASC' },
    });
  }

  async findById(id: number): Promise<SevaOpportunityEntity | null> {
    return this.findOne({ where: { id } });
  }

  createSeva(data: Partial<SevaOpportunityEntity>): SevaOpportunityEntity {
    return this.create(data);
  }

  async saveSeva(seva: SevaOpportunityEntity): Promise<SevaOpportunityEntity> {
    return this.save(seva);
  }

  async countSevas(): Promise<number> {
    return this.count();
  }
}
