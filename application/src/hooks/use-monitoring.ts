import { useEffect } from 'react';
import { addSMSListener, addNotificationListener, SMSData, NotificationData, default as SentinelNative } from '../../modules/sentinel-native/src';
import api from '../services/api';
import { useThreatStore } from '../store/use-threat-store';
import { useRouter } from 'expo-router';

export function useMonitoring() {
  const { addThreat } = useThreatStore();
  const router = useRouter();

  useEffect(() => {
    // Start native monitoring
    SentinelNative.startMonitoring();

    // Listen for SMS
    const smsSub = addSMSListener(async (data: SMSData) => {
      try {
        const response = await api.post('/analyze/sms', data);
        const analysis = response.data;
        
        if (analysis.riskScore > 70) {
          router.push({
            pathname: '/alerts',
            params: { 
              type: 'SMS Phishing', 
              source: data.sender, 
              reason: analysis.reason 
            }
          });
        }
        
        addThreat({
          id: Math.random().toString(),
          type: 'SMS',
          source: data.sender,
          content: data.message,
          riskScore: analysis.riskScore,
          category: analysis.category,
          timestamp: new Date().toLocaleTimeString(),
        });
      } catch (error) {
        console.error('SMS Analysis failed', error);
      }
    });

    // Listen for Notifications
    const notificationSub = addNotificationListener(async (data: NotificationData) => {
      try {
        const response = await api.post('/analyze/notification', data);
        const analysis = response.data;
        
        if (analysis.riskScore > 70) {
          router.push({
            pathname: '/alerts',
            params: { 
              type: 'App Threat', 
              source: data.appName, 
              reason: analysis.reason 
            }
          });
        }

        addThreat({
          id: Math.random().toString(),
          type: 'NOTIFICATION',
          source: data.appName,
          content: data.content,
          riskScore: analysis.riskScore,
          category: analysis.category,
          timestamp: new Date().toLocaleTimeString(),
        });
      } catch (error) {
        console.error('Notification Analysis failed', error);
      }
    });

    return () => {
      smsSub?.remove();
      notificationSub?.remove();
    };
  }, []);
}
