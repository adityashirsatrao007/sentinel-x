import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor — inject JWT
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.JWT_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Token not available — continue unauthenticated
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Clear stored credentials
      await SecureStore.deleteItemAsync(STORAGE_KEYS.JWT_TOKEN).catch(() => {});
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_PROFILE).catch(() => {});
      // Caller handles redirect to login
    }

    return Promise.reject(error);
  }
);

export default apiClient;
