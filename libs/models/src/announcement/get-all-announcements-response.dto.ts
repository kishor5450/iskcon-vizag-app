import { GlobalResponseObject } from '../common';
import { IAnnouncement } from './announcement.interface';

export class GetAllAnnouncementsResponse extends GlobalResponseObject<IAnnouncement[]> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Announcements retrieved', data?: IAnnouncement[]) {
    super(status, errorCode, internalMessage, data);
  }
}
