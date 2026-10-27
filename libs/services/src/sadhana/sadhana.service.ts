import { ISadhanaRecord, SadhanaLogRequestDto } from '@temple/models';
import { AxiosRequestConfig } from 'axios';
import { CommonAxiosService } from '../core';

export interface CommunityStats {
  totalJapaRounds: number;
  totalNbsAttended: number;
  totalReadingSessions: number;
  totalAratis: number;
}

export class SadhanaService extends CommonAxiosService {
  private getURLwithMainEndPoint(childUrl: string) {
    return '/sadhana/' + childUrl;
  }

  async getHistory(config?: AxiosRequestConfig): Promise<ISadhanaRecord[]> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getHistory'), {}, config);
  }

  async getTodaySadhana(date: string, config?: AxiosRequestConfig): Promise<ISadhanaRecord | null> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getTodayRecord'), { date }, config);
  }

  async getCommunityStats(config?: AxiosRequestConfig): Promise<CommunityStats> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getCommunityStats'), {}, config);
  }

  async logSadhana(reqModel: SadhanaLogRequestDto, config?: AxiosRequestConfig): Promise<ISadhanaRecord> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('logSadhana'), reqModel, config);
  }
}
