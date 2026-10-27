import { GlobalResponseObject } from '../common';
import { ISadhanaRecord } from './sadhana-record.interface';

export class GetTodaySadhanaRecordResponse extends GlobalResponseObject<ISadhanaRecord | null> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Today sadhana record retrieved successfully', data?: ISadhanaRecord | null) {
    super(status, errorCode, internalMessage, data);
  }
}
