import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  setAuth: async (token, user) => {
    await SecureStore.setItemAsync('auth_token', token);
    await SecureStore.setItemAsync('user_profile', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_profile');
    set({ token: null, user: null, isAuthenticated: false });
  },
  loadStoredAuth: async () => {
    const token = await SecureStore.getItemAsync('auth_token');
    const userStr = await SecureStore.getItemAsync('user_profile');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr), isAuthenticated: true });
    }
  },
}));
