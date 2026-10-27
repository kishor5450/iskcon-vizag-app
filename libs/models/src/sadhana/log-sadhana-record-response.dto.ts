import { GlobalResponseObject } from '../common';
import { ISadhanaRecord } from './sadhana-record.interface';

export class LogSadhanaRecordResponse extends GlobalResponseObject<ISadhanaRecord> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Sadhana record logged successfully', data?: ISadhanaRecord) {
    super(status, errorCode, internalMessage, data);
  }
}
