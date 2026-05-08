import { create } from 'zustand';
import { User, AppSettings } from '../types';
import { authService } from '../services/auth.service';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),

  login: async (token, user) => {
    await authService.storeToken(token);
    await authService.storeUser(user);
    set({ token, user, isAuthenticated: true });
  },

  logout: async () => {
    await authService.clearAuth();
    set({ token: null, user: null, isAuthenticated: false });
  },

  initialize: async () => {
    try {
      const token = await authService.getToken();
      const user = await authService.getStoredUser();
      if (token && user) {
        set({ token, user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));

interface AppStore {
  settings: AppSettings;
  alertCount: number;
  isMonitoring: boolean;

  updateSettings: (settings: Partial<AppSettings>) => void;
  setAlertCount: (count: number) => void;
  incrementAlertCount: () => void;
  setMonitoring: (active: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  settings: {
    smsMonitoringEnabled: true,
    notificationMonitoringEnabled: true,
    autoAnalyze: true,
    alertThreshold: 60,
    darkMode: true,
  },
  alertCount: 0,
  isMonitoring: false,

  updateSettings: (newSettings) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  setAlertCount: (count) => set({ alertCount: count }),
  incrementAlertCount: () => set((state) => ({ alertCount: state.alertCount + 1 })),
  setMonitoring: (isMonitoring) => set({ isMonitoring }),
}));
