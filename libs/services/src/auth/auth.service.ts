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
  private getURLwithMainEndPoint(childUrl: string) {
    return '/auth/' + childUrl;
  }

  async register(reqModel: RegisterRequestDto, config?: AxiosRequestConfig): Promise<IDevotee> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('register'), reqModel, config);
  }

  async login(reqModel: LoginRequestDto, config?: AxiosRequestConfig): Promise<LoginResponseDto> {
    const res = await this.axiosPostCall<LoginResponseDto>(
      this.getURLwithMainEndPoint('login'),
      reqModel,
      config
    );
    if (res?.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async getProfile(config?: AxiosRequestConfig): Promise<IDevotee> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getProfile'), {}, config);
  }

  async updatePreferences(
    reqModel: UpdatePreferencesRequestDto,
    config?: AxiosRequestConfig
  ): Promise<IDevotee> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('updatePreferences'), reqModel, config);
  }

  async getAllDevotees(config?: AxiosRequestConfig): Promise<IDevotee[]> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllDevotees'), {}, config);
  }

  async updateAvatar(avatarUrl: string, config?: AxiosRequestConfig): Promise<IDevotee> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('updateAvatar'), { avatarUrl }, config);
  }
}
