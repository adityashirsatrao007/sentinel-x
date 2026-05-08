import apiClient from './api';
import * as SecureStore from 'expo-secure-store';
import { ENDPOINTS, STORAGE_KEYS } from '../constants';
import { User } from '../types';

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface GoogleAuthPayload {
  idToken: string;
  email: string;
  name: string;
  picture?: string;
}

export const authService = {
  /**
   * Login with email/password — returns JWT
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(ENDPOINTS.AUTH_LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Authenticate with Google OAuth token
   */
  async googleAuth(payload: GoogleAuthPayload): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(ENDPOINTS.AUTH_GOOGLE, payload);
    return response.data;
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(): Promise<User> {
    const response = await apiClient.get<User>(ENDPOINTS.AUTH_ME);
    return response.data;
  },

  /**
   * Securely persist JWT token
   */
  async storeToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.JWT_TOKEN, token);
  },

  /**
   * Retrieve stored JWT token
   */
  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(STORAGE_KEYS.JWT_TOKEN);
  },

  /**
   * Persist user profile to SecureStore
   */
  async storeUser(user: User): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
  },

  /**
   * Get cached user profile from SecureStore
   */
  async getStoredUser(): Promise<User | null> {
    const raw = await SecureStore.getItemAsync(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  /**
   * Clear all auth credentials (logout)
   */
  async clearAuth(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.JWT_TOKEN).catch(() => {});
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_PROFILE).catch(() => {});
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ONBOARDING_DONE).catch(() => {});
  },
};
