import apiClient from './api';
import { ENDPOINTS } from '../constants';
import { NotificationPayload, ThreatAnalysis } from '../types';

export const notificationService = {
  /**
   * Send notification metadata to backend for analysis
   */
  async analyzeNotification(payload: NotificationPayload): Promise<ThreatAnalysis> {
    // Backend uses /analyze/email or /analyze/sms — we map notification to SMS endpoint
    // as a general message analysis channel
    const response = await apiClient.post<ThreatAnalysis>(ENDPOINTS.ANALYZE_SMS, {
      sender: `${payload.appName} - ${payload.title}`,
      message: payload.body,
      timestamp: payload.timestamp,
    });
    return response.data;
  },
};
