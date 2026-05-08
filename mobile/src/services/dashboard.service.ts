import apiClient from './api';
import { ENDPOINTS } from '../constants';
import { DashboardStats } from '../types';

export const dashboardService = {
  /**
   * Fetch dashboard statistics and security overview
   */
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<DashboardStats>(ENDPOINTS.DASHBOARD_STATS);
      return response.data;
    } catch {
      // Return mock data if backend unavailable
      return {
        totalThreats: 0,
        activeAlerts: 0,
        smsScanned: 0,
        emailsScanned: 0,
        recentThreats: [],
        securityScore: 85,
        gmailConnected: false,
        monitoredApps: ['WhatsApp', 'Telegram', 'Instagram'],
        threatsByCategory: {},
      };
    }
  },
};
