import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
http.interceptors.request.use(
  (config) => {
    // Lấy token từ nơi lưu trữ (localStorage, state manager, etc.)
    const token = localStorage.getItem('access_token');

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    const errResponse = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    };

    switch (error.response?.status) {
      case 401:
        // Đứt token -> Xử lý logout hoặc refresh token ở đây
        console.error('Unauthorized - Redirecting to login...');
        break;
      case 403:
        console.error("Forbidden - You don't have permission");
        break;
      case 404:
        console.error('Resource not found');
        break;
      case 500:
        console.error('Internal Server Error from Server');
        break;
      default:
        console.error('An unexpected error occurred:', error.message);
    }

    return Promise.reject(errResponse);
  }
);

interface RequestConfig extends AxiosRequestConfig {
  /** milliseconds */
  ttl?: number;
}

const internalMemoryCache = new Map<string, { data: any; timestamp: number }>();

export const httpWithCache = {
  /**
   * @desc cache 3 minutes by default
   * */
  get: async <T>(url: string, config?: RequestConfig): Promise<{ data: T }> => {
    const ttl = config?.ttl ?? 3 * 60 * 1000;

    const cached = internalMemoryCache.get(url);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return { data: cached.data as T };
    }

    const response = await http.get<T>(url, config);
    internalMemoryCache.set(url, { data: response.data, timestamp: Date.now() });

    return response;
  },

  clear: (url: string) => internalMemoryCache.delete(url),
};

export { http };
