import {
  CreateAnnouncementRequestDto,
  DeleteAnnouncementByIdRequest,
  GetAllAnnouncementsRequest,
  GetAllAnnouncementsResponse,
  CreateAnnouncementResponse,
  DeleteAnnouncementResponse,
} from '@temple/models';
import { AxiosRequestConfig } from 'axios';
import { CommonAxiosService } from '../core';

export class AnnouncementService extends CommonAxiosService {
  private getURLwithMainEndPoint(childUrl: string): string {
    return '/announcements/' + childUrl;
  }

  async getAllAnnouncements(
    reqModel: GetAllAnnouncementsRequest = {},
    config?: AxiosRequestConfig,
  ): Promise<GetAllAnnouncementsResponse> {
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('getAllAnnouncements'),
      reqModel,
      config,
    );
  }

  async createAnnouncement(
    reqModel: CreateAnnouncementRequestDto,
    config?: AxiosRequestConfig,
  ): Promise<CreateAnnouncementResponse> {
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('createAnnouncement'),
      reqModel,
      config,
    );
  }

  async deleteAnnouncementById(
    reqModel: DeleteAnnouncementByIdRequest | { id: number } | number,
    config?: AxiosRequestConfig,
  ): Promise<DeleteAnnouncementResponse> {
    const payload = typeof reqModel === 'number' ? { id: reqModel } : reqModel;
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('deleteAnnouncementById'),
      payload,
      config,
    );
  }

  async uploadAnnouncementFile(
    formData: any,
    config?: AxiosRequestConfig,
  ): Promise<{ url: string }> {
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('upload'),
      formData,
      {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      },
    );
  }
}
