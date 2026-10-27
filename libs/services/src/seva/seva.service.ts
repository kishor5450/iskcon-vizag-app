import {
  CreateSevaRequestDto,
  RegisterForSevaByIdRequest,
  GetAllSevasRequest,
  GetAllSevasResponse,
  CreateSevaResponse,
  RegisterForSevaResponse,
} from '@temple/models';
import { AxiosRequestConfig } from 'axios';
import { CommonAxiosService } from '../core';

export class SevaService extends CommonAxiosService {
  private getURLwithMainEndPoint(childUrl: string): string {
    return '/sevas/' + childUrl;
  }

  async getAllSevas(
    reqModel: GetAllSevasRequest = {},
    config?: AxiosRequestConfig,
  ): Promise<GetAllSevasResponse> {
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('getAllSevas'),
      reqModel,
      config,
    );
  }

  async createSeva(
    reqModel: CreateSevaRequestDto,
    config?: AxiosRequestConfig,
  ): Promise<CreateSevaResponse> {
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('createSeva'),
      reqModel,
      config,
    );
  }

  async registerForSevaById(
    reqModel: RegisterForSevaByIdRequest | { id: number } | number,
    config?: AxiosRequestConfig,
  ): Promise<RegisterForSevaResponse> {
    const payload = typeof reqModel === 'number' ? { id: reqModel } : reqModel;
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('registerForSevaById'),
      payload,
      config,
    );
  }
}
