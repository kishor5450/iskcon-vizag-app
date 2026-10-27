import axios, { AxiosInstance as AxiosInstanceType } from 'axios';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete AxiosInstance.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = (): string | null => {
  return authToken;
};

export const AxiosInstance: AxiosInstanceType = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to ensure Authorization header is always attached if token exists
AxiosInstance.interceptors.request.use(
  (config) => {
    if (authToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const axiosInstance = AxiosInstance;
