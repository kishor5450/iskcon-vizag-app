import { GlobalResponseObject } from '../common';
import { IDevotee } from './devotee.interface';

export class RegisterDevoteeResponse extends GlobalResponseObject<IDevotee> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Devotee registered successfully', data?: IDevotee) {
    super(status, errorCode, internalMessage, data);
  }
}
