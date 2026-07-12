import type { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { store } from 'src/store';

// ----------------------------------------------------------------------

// Base URL from environment variables — always the full backend URL, in both
// dev and prod (mirrors mrkoon-admin, which calls the backend directly rather
// than proxying through the dev server).
const BASE_URL =
  import.meta.env.VITE_HOST_API ||
  import.meta.env.VITE_BASE_URL ||
  import.meta.env.VITE_SERVER_URL;

// Website API (for public endpoints like countries in login/register screens)
// Mirrors mrkoon-admin: replace /apiAdmin with /apiWebsite
const WEBSITE_API_URL = BASE_URL.replace('/apiAdmin', '/apiWebsite');

// TODO: TEMPORARY — hardcoded dev token. Remove before shipping.

// Create axios instance for admin API
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for website API (public endpoints)
export const websiteAxiosInstance = axios.create({
  baseURL: WEBSITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------------------------------------------------

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from localStorage
    const token = store.getState().user.token || localStorage.getItem('accessToken');

    // Add authorization header
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    // Send current language to backend (i18next persists to localStorage)
    const lang = localStorage.getItem('i18nextLng');
    if (lang) {
      config.headers.set('lang', lang);
    }

    // Add country header from user's country global code
    const countryCode = store.getState().user.country?.global_code;
    if (countryCode) {
      config.headers.set('Country', countryCode);
    }

    // Add API security header
    config.headers.set('api_sec', 'qJB0rGtIn5UB1xG03efyCp');

    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------

const extractMessage = (data: any, fallback: string): string => {
  if (!data || typeof data !== 'object') return fallback;

  // 1. Try to get first error from errors array/object
  if (data.errors && typeof data.errors === 'object') {
    const firstError = Object.values(data.errors)[0];
    if (Array.isArray(firstError) && firstError.length > 0) {
      return String(firstError[0]);
    }
    if (typeof firstError === 'string') {
      return firstError;
    }
  }
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return String(data.errors[0]);
  }

  // 2. Try to get nested msg: data.data.msg
  if (data.data && typeof data.data === 'object' && data.data.msg) {
    return data.data.msg;
  }

  // 3. Try to get first validation error: data.data.phone[0]
  if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    const firstErrorField = Object.values(data.data)[0];
    if (Array.isArray(firstErrorField) && firstErrorField.length > 0) {
      return String(firstErrorField[0]);
    }
    if (typeof firstErrorField === 'string') {
      return firstErrorField;
    }
  }

  // 4. Fallback to root message
  return data.message || fallback;
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle backend business logic errors (HTTP 200 but status !== 1)
    const data = response.data;
    if (data && typeof data === 'object' && 'status' in data && data.status === 0) {
      const message = extractMessage(data, 'Something went wrong');
      return Promise.reject(new Error(message));
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear token
      localStorage.removeItem('accessToken');

      // Redirect to login — but only if not already on the sign-in or callback page,
      // and never from public pages (e.g. the CEO preview, which self-gates with a
      // password and must surface its own error state instead of bouncing to login).
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/sign-in') &&
        !window.location.pathname.includes('/callback') &&
        !window.location.pathname.startsWith('/public/')
      ) {
        const currentPath = window.location.pathname + window.location.search;
        const returnUrl = encodeURIComponent(currentPath);
        window.location.href = `/auth/jwt/sign-in?returnUrl=${returnUrl}`;
      }

      return Promise.reject(error);
    }

    // Extract error message from response data if available
    const responseData = error.response?.data as any;
    if (responseData) {
      const message = extractMessage(responseData, error.message);

      // Create a modified error with the picked message
      const customError = new Error(message) as any;
      customError.response = error.response;
      customError.config = error.config;
      customError.code = error.code;
      customError.status = error.response?.status;

      // Generic extraction of field validation errors for form handling
      if (responseData.errors && typeof responseData.errors === 'object') {
        customError.fieldErrors = Object.fromEntries(
          Object.entries(responseData.errors).map(([k, v]) => [
            k,
            Array.isArray(v) ? v[0] : (v as string),
          ])
        );
      }

      return Promise.reject(customError);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    // Handle 500+ Server errors
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error:', error.response.data);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------

// SWR fetcher
export const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

// Export the configured axios instance
export default axiosInstance;

// Export types for use in other modules
export type { AxiosError, AxiosResponse, AxiosRequestConfig };

// ----------------------------------------------------------------------

// Export utility functions
export const createApiRequest = (config: AxiosRequestConfig) => axiosInstance(config);

export const get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
  axiosInstance.get<T>(url, config);

export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => axiosInstance.post<T>(url, data, config);

export const put = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => axiosInstance.put<T>(url, data, config);

export const patch = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => axiosInstance.patch<T>(url, data, config);

export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
  axiosInstance.delete<T>(url, config);

// Export the base URL for use in other modules
export { BASE_URL };

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
