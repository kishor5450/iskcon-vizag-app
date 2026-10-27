import { GlobalResponseObject } from '../common';
import { IDevotee } from './devotee.interface';

export class GetAllDevoteesResponse extends GlobalResponseObject<IDevotee[]> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Devotees list retrieved successfully', data?: IDevotee[]) {
    super(status, errorCode, internalMessage, data);
  }
}
