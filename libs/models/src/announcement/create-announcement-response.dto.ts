import { GlobalResponseObject } from '../common';
import { IAnnouncement } from './announcement.interface';

export class CreateAnnouncementResponse extends GlobalResponseObject<IAnnouncement> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Announcement created successfully', data?: IAnnouncement) {
    super(status, errorCode, internalMessage, data);
  }
}
