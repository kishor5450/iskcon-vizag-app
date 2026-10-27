import {
  IDevotee,
  LoginResponseDto,
  RegisterRequestDto,
  LoginRequestDto,
  UpdatePreferencesRequestDto,
} from '@temple/models';
import { AxiosRequestConfig } from 'axios';
import { CommonAxiosService } from '../core';

export class AuthService extends CommonAxiosService {
  private getURLwithMainEndPoint(childUrl: string): string {
    return '/auth/' + childUrl;
  }

  async registerDevotee(
    reqModel: RegisterRequestDto,
    config?: AxiosRequestConfig,
  ): Promise<IDevotee> {
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('registerDevotee'),
      reqModel,
      config,
    );
  }

  async loginDevotee(
    reqModel: LoginRequestDto,
    config?: AxiosRequestConfig,
  ): Promise<LoginResponseDto> {
    const res = await this.axiosPostCall<LoginResponseDto>(
      this.getURLwithMainEndPoint('loginDevotee'),
      reqModel,
      config,
    );
    if (res?.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async getDevoteeProfile(
    reqModel?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<IDevotee> {
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('getDevoteeProfile'),
      reqModel || {},
      config,
    );
  }

  async updateDevoteePreferences(
    reqModel: UpdatePreferencesRequestDto,
    config?: AxiosRequestConfig,
  ): Promise<IDevotee> {
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('updateDevoteePreferences'),
      reqModel,
      config,
    );
  }

  async getAllDevotees(
    reqModel?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<IDevotee[]> {
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('getAllDevotees'),
      reqModel || {},
      config,
    );
  }

  async updateDevoteeAvatar(
    reqModel: { avatarUrl: string } | string,
    config?: AxiosRequestConfig,
  ): Promise<IDevotee> {
    const payload =
      typeof reqModel === 'string' ? { avatarUrl: reqModel } : reqModel;
    return await this.axiosPostCall(
      this.getURLwithMainEndPoint('updateDevoteeAvatar'),
      payload,
      config,
    );
  }
}
