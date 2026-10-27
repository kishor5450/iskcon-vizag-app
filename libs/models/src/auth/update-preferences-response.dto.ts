import { GlobalResponseObject } from '../common';
import { IDevotee } from './devotee.interface';

export class UpdateDevoteePreferencesResponse extends GlobalResponseObject<IDevotee> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Preferences updated successfully', data?: IDevotee) {
    super(status, errorCode, internalMessage, data);
  }
}
