import api from './api';
import { useAuthStore } from '../store/use-auth-store';

export const AuthService = {
  async loginWithGoogle(googleToken: string) {
    try {
      const response = await api.post('/auth/google', { token: googleToken });
      const { jwt, user } = response.data;
      
      await useAuthStore.getState().setAuth(jwt, user);
      return { success: true, user };
    } catch (error) {
      console.error('Google Auth Backend sync failed', error);
      throw error;
    }
  },

  async logout() {
    await useAuthStore.getState().logout();
  }
};
