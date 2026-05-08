import apiClient from './api';
import { ENDPOINTS } from '../constants';
import { SMSPayload, ThreatAnalysis } from '../types';

export const smsService = {
  /**
   * Send SMS metadata to backend for threat analysis
   */
  async analyzeSMS(payload: SMSPayload): Promise<ThreatAnalysis> {
    const response = await apiClient.post<ThreatAnalysis>(ENDPOINTS.ANALYZE_SMS, {
      sender: payload.sender,
      message: payload.message,
      timestamp: payload.timestamp,
    });
    return response.data;
  },

  /**
   * Batch analyze multiple SMS messages
   */
  async analyzeBatch(messages: SMSPayload[]): Promise<ThreatAnalysis[]> {
    const results = await Promise.allSettled(
      messages.map((msg) => this.analyzeSMS(msg))
    );
    return results
      .filter((r): r is PromiseFulfilledResult<ThreatAnalysis> => r.status === 'fulfilled')
      .map((r) => r.value);
  },
};
