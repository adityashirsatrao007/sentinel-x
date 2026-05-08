import axios from 'axios';
import { useAuthStore } from '../store/use-auth-store';

const API_BASE_URL = 'https://api.sentinelx.ai/v1'; // Example base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (logout or refresh token)
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
