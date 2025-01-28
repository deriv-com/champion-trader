import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ApiError } from './types';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Transform successful responses
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const apiError: ApiError = {
        code: error.response.data.code || 'UNKNOWN_ERROR',
        message: error.response.data.message || 'An unknown error occurred',
        status: error.response.status,
      };
      return Promise.reject(apiError);
    } else if (error.request) {
      // The request was made but no response was received
      const apiError: ApiError = {
        code: 'NETWORK_ERROR',
        message: 'Network error occurred',
        status: 0,
      };
      return Promise.reject(apiError);
    } else {
      // Something happened in setting up the request that triggered an Error
      const apiError: ApiError = {
        code: 'REQUEST_SETUP_ERROR',
        message: error.message || 'Error setting up the request',
        status: 0,
      };
      return Promise.reject(apiError);
    }
  }
);

export { apiClient };
