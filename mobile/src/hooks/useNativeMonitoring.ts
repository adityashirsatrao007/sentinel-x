import { useEffect, useRef } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { smsService } from '../services/sms.service';
import { notificationService } from '../services/notification.service';
import { useAppStore, useAuthStore } from '../store';

const { SmsReceiverModule, NotificationListenerModule, CallStateModule } = NativeModules;

/**
 * Hook that initializes and manages all native module listeners.
 * Should be mounted once at the app root level.
 */
export function useNativeMonitoring() {
  const { settings, isMonitoring, setMonitoring, incrementAlertCount } = useAppStore();
  const { isAuthenticated } = useAuthStore();
  const smsEmitter = useRef<NativeEventEmitter | null>(null);
  const notifEmitter = useRef<NativeEventEmitter | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'android' || !isAuthenticated) return;

    // Start SMS monitoring
    if (settings.smsMonitoringEnabled && SmsReceiverModule) {
      try {
        SmsReceiverModule.startListening();
        const emitter = new NativeEventEmitter(SmsReceiverModule);
        smsEmitter.current = emitter;

        emitter.addListener('onSmsReceived', async (data: {
          sender: string;
          message: string;
          isoTimestamp: string;
        }) => {
          if (!settings.autoAnalyze) return;
          try {
            const result = await smsService.analyzeSMS({
              sender: data.sender,
              message: data.message,
              timestamp: data.isoTimestamp,
            });

            if (result.riskScore >= settings.alertThreshold) {
              incrementAlertCount();
              // Show local notification
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: `🚨 ${result.threatLevel} THREAT Detected`,
                  body: `SMS from ${data.sender}: ${result.classificationLabel}`,
                  data: { threatId: result.threatId, type: 'sms' },
                },
                trigger: null,
              });
            }
          } catch {
            // Analysis failed silently
          }
        });
      } catch {
        // Native module not available in Expo Go
      }
    }

    // Start Notification monitoring
    if (settings.notificationMonitoringEnabled && NotificationListenerModule) {
      try {
        const emitter = new NativeEventEmitter(NotificationListenerModule);
        notifEmitter.current = emitter;

        emitter.addListener('onNotificationReceived', async (data: {
          packageName: string;
          appName: string;
          title: string;
          body: string;
          timestamp: string;
        }) => {
          if (!settings.autoAnalyze || !data.body) return;
          try {
            const result = await notificationService.analyzeNotification({
              appName: data.appName,
              packageName: data.packageName,
              title: data.title,
              body: data.body,
              timestamp: data.timestamp,
            });

            if (result.riskScore >= settings.alertThreshold) {
              incrementAlertCount();
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: `⚠️ ${result.threatLevel} ALERT`,
                  body: `${data.appName}: ${result.classificationLabel}`,
                  data: { threatId: result.threatId, type: 'notification' },
                },
                trigger: null,
              });
            }
          } catch {
            // Analysis failed silently
          }
        });
      } catch {
        // Native module not available in Expo Go
      }
    }

    // Start Call State monitoring
    if (CallStateModule) {
      try {
        CallStateModule.startCallStateListener();
      } catch {
        // Not available
      }
    }

    setMonitoring(true);

    return () => {
      // Cleanup listeners on unmount
      try {
        smsEmitter.current?.removeAllListeners('onSmsReceived');
        notifEmitter.current?.removeAllListeners('onNotificationReceived');
        CallStateModule?.stopCallStateListener();
      } catch {
        // ignore
      }
      setMonitoring(false);
    };
  }, [isAuthenticated, settings.smsMonitoringEnabled, settings.notificationMonitoringEnabled]);
}
