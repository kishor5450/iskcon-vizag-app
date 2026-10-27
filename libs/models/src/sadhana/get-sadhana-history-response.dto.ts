import { GlobalResponseObject } from '../common';
import { ISadhanaRecord } from './sadhana-record.interface';

export class GetSadhanaHistoryResponse extends GlobalResponseObject<ISadhanaRecord[]> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Sadhana history retrieved successfully', data?: ISadhanaRecord[]) {
    super(status, errorCode, internalMessage, data);
  }
}
