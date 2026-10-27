import { GlobalResponseObject } from '../common';
import { IDevotee } from './devotee.interface';

export class GetDevoteeProfileResponse extends GlobalResponseObject<IDevotee> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Devotee profile retrieved successfully', data?: IDevotee) {
    super(status, errorCode, internalMessage, data);
  }
}
