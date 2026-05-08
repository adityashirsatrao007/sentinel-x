import api from './api';

export const DashboardService = {
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  
  async getHistory() {
    const response = await api.get('/threats/history');
    return response.data;
  }
};
