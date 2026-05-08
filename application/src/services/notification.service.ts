import api from './api';

export const NotificationService = {
  async analyzeNotification(data: { appName: string; title: string; content: string }) {
    const response = await api.post('/analyze/notification', data);
    return response.data;
  }
};
