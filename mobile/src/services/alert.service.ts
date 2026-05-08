import apiClient from './api';
import { ENDPOINTS } from '../constants';
import { Alert } from '../types';

interface AlertsResponse {
  items: Alert[];
  total: number;
  page: number;
  pages: number;
}

export const alertService = {
  /**
   * Fetch all alerts for the current user
   */
  async getAlerts(page: number = 1, limit: number = 20): Promise<AlertsResponse> {
    const response = await apiClient.get<AlertsResponse>(
      `${ENDPOINTS.THREATS_HISTORY}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Mark an alert as read
   */
  async markRead(alertId: string): Promise<void> {
    await apiClient.patch(`${ENDPOINTS.THREATS_HISTORY}/${alertId}/read`);
  },

  /**
   * Get threat history with optional filters
   */
  async getHistory(channel?: string, page: number = 1): Promise<AlertsResponse> {
    const params = new URLSearchParams({ page: String(page) });
    if (channel) params.set('channel', channel);
    const response = await apiClient.get<AlertsResponse>(
      `${ENDPOINTS.THREATS_HISTORY}?${params.toString()}`
    );
    return response.data;
  },
};
