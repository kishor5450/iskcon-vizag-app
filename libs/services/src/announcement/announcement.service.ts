import { IAnnouncement, CreateAnnouncementRequestDto } from '@temple/models';
import { AxiosRequestConfig } from 'axios';
import { CommonAxiosService } from '../core';

export class AnnouncementService extends CommonAxiosService {
  private getURLwithMainEndPoint(childUrl: string) {
    return '/announcements/' + childUrl;
  }

  async getAll(official?: boolean, config?: AxiosRequestConfig): Promise<IAnnouncement[]> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getAll'), { official }, config);
  }

  // Alias for backward compatibility
  async getAnnouncements(official?: boolean, config?: AxiosRequestConfig): Promise<IAnnouncement[]> {
    return this.getAll(official, config);
  }

  async create(reqModel: CreateAnnouncementRequestDto, config?: AxiosRequestConfig): Promise<IAnnouncement> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('create'), reqModel, config);
  }

  // Alias for backward compatibility
  async createAnnouncement(reqModel: CreateAnnouncementRequestDto, config?: AxiosRequestConfig): Promise<IAnnouncement> {
    return this.create(reqModel, config);
  }

  async delete(id: number, config?: AxiosRequestConfig): Promise<void> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('delete'), { id }, config);
  }

  async uploadFile(formData: any, config?: AxiosRequestConfig): Promise<{ url: string }> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('upload'), formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }
}
