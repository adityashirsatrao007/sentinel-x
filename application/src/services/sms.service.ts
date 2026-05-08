import api from './api';

export const SMSService = {
  async analyzeSMS(data: { sender: string; message: string; timestamp: string }) {
    const response = await api.post('/analyze/sms', data);
    return response.data;
  }
};
