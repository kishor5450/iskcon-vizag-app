import { GlobalResponseObject } from '../common';

export interface ICommunityStats {
  totalJapaRounds: number;
  totalNbsAttended: number;
  totalReadingSessions: number;
  totalAratis: number;
}

export class GetCommunitySadhanaStatsResponse extends GlobalResponseObject<ICommunityStats> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Community stats retrieved successfully', data?: ICommunityStats) {
    super(status, errorCode, internalMessage, data);
  }
}
