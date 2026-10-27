export class DeleteAnnouncementByIdRequest {
  id: number;
  constructor(id: number) {
    this.id = id;
  }
}
export const DeleteAnnouncementRequest = DeleteAnnouncementByIdRequest;
