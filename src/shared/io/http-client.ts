import type { AxiosError } from 'axios';
import axios from 'axios';

// 1. Tạo instance riêng biệt giống như một HttpService độc lập
const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 2. Request Interceptor: Giống HttpInterceptor gắn Authorization Header
 */
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

/**
 * 3. Response Interceptor: Unwrapping & Global Error Handling
 * Bắt chước Angular HttpClient: Trả về trực tiếp data sạch, gom lỗi về một mối
 */
http.interceptors.response.use(
  (response) => {
    // Angular HttpClient tự động bọc data và trả về thẳng `body` (response.data)
    // Giúp bạn gọi api.get('/users') là nhận về User[] luôn, không cần .data nữa
    return response.data;
  },
  (error: AxiosError) => {
    // Cấu hình xử lý lỗi tập trung (HttpErrorResponse)
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

    // Trả về một rejected promise để phía component vẫn catch được nếu cần handle riêng
    return Promise.reject(errResponse);
  }
);

export { http };
