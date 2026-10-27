import { ISevaOpportunity, CreateSevaRequestDto } from '@temple/models';
import { AxiosRequestConfig } from 'axios';
import { CommonAxiosService } from '../core';

export class SevaService extends CommonAxiosService {
  private getURLwithMainEndPoint(childUrl: string) {
    return '/sevas/' + childUrl;
  }

  async getAll(config?: AxiosRequestConfig): Promise<ISevaOpportunity[]> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getAll'), {}, config);
  }

  // Alias for backward compatibility
  async getSevas(config?: AxiosRequestConfig): Promise<ISevaOpportunity[]> {
    return this.getAll(config);
  }

  async create(reqModel: CreateSevaRequestDto, config?: AxiosRequestConfig): Promise<ISevaOpportunity> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('create'), reqModel, config);
  }

  // Alias for backward compatibility
  async createSeva(reqModel: CreateSevaRequestDto, config?: AxiosRequestConfig): Promise<ISevaOpportunity> {
    return this.create(reqModel, config);
  }

  async register(id: number, config?: AxiosRequestConfig): Promise<ISevaOpportunity> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('register'), { id }, config);
  }

  // Alias for backward compatibility
  async registerForSeva(id: number, config?: AxiosRequestConfig): Promise<ISevaOpportunity> {
    return this.register(id, config);
  }
}
