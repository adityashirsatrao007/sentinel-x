import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

const SentinelNative = NativeModulesProxy.SentinelNative;
const emitter = SentinelNative ? new EventEmitter(SentinelNative) : null;

export interface SMSData {
  sender: string;
  message: string;
  timestamp: string;
}

export interface NotificationData {
  appName: string;
  title: string;
  content: string;
}

export function isNotificationListenerEnabled(): boolean {
  return SentinelNative?.isNotificationListenerEnabled?.() ?? false;
}

export function requestNotificationListenerPermission(): void {
  SentinelNative?.requestNotificationListenerPermission?.();
}

export function addSMSListener(listener: (event: SMSData) => void): Subscription | null {
  return emitter?.addListener('onSMSReceived', listener) || null;
}

export function addNotificationListener(listener: (event: NotificationData) => void): Subscription | null {
  return emitter?.addListener('onNotificationReceived', listener) || null;
}

export default SentinelNative;
