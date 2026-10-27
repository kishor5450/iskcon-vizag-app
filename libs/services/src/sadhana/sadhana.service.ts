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
  private getURLwithMainEndPoint(childUrl: string): string {
    return '/sadhana/' + childUrl;
  }

  async getSadhanaHistory(
    reqModel?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<ISadhanaRecord[]> {
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('getSadhanaHistory'),
      reqModel || {},
      config,
    );
  }

  async getTodaySadhanaRecord(
    reqModel: { date: string } | string,
    config?: AxiosRequestConfig,
  ): Promise<ISadhanaRecord | null> {
    const payload =
      typeof reqModel === 'string' ? { date: reqModel } : reqModel;
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('getTodaySadhanaRecord'),
      payload,
      config,
    );
  }

  async getCommunitySadhanaStats(
    reqModel?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<CommunityStats> {
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('getCommunitySadhanaStats'),
      reqModel || {},
      config,
    );
  }

  async logSadhanaRecord(
    reqModel: SadhanaLogRequestDto,
    config?: AxiosRequestConfig,
  ): Promise<ISadhanaRecord> {
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('logSadhanaRecord'),
      reqModel,
      config,
    );
  }
}
