import { AxiosRequestConfig } from 'axios';
import { AxiosInstance, setAuthToken } from './axios-instance';
import { configVariables } from './config';

export class CommonAxiosService {
  URL: string = configVariables.API_BASE_URL;

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.URL = baseUrl;
    }
  }

  setToken(token: string | null): void {
    setAuthToken(token);
  }

  setBaseUrl(url: string): void {
    this.URL = url;
  }

  axiosPostCall = async <T = any>(
    urlEndPoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    console.log('API URL:', this.URL + '' + urlEndPoint);
    return await AxiosInstance.post(this.URL + '' + urlEndPoint, data, config)
      .then((response) => {
        if (response && response.status >= 200 && response.status < 300) {
          return response.data;
        } else {
          throw response;
        }
      })
      .catch((err) => {
        const message = err.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(', ')
            : err.response.data.message
          : err.message;
        throw new Error(`Error: ${message}, URL: ${this.URL}`);
      });
  };
}

export const TempleCommonAxiosService = CommonAxiosService;
