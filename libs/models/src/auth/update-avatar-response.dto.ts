import { GlobalResponseObject } from '../common';
import { IDevotee } from './devotee.interface';

export class UpdateDevoteeAvatarResponse extends GlobalResponseObject<IDevotee> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Avatar updated successfully', data?: IDevotee) {
    super(status, errorCode, internalMessage, data);
  }
}
