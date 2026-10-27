import { GlobalResponseObject } from '../common';

export class DeleteAnnouncementResponse extends GlobalResponseObject {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Announcement deleted successfully', data?: any) {
    super(status, errorCode, internalMessage, data);
  }
}
