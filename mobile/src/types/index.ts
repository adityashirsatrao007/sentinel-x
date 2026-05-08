// SentinelX Type Definitions

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'soc' | 'sysadmin';
  gmailConnected?: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ThreatAnalysis {
  id?: string;
  threatDetected: boolean;
  riskScore: number;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'SAFE' | 'PENDING';
  confidence: number;
  classificationLabel: string;
  reasons: string[];
  nlpScore: number;
  behaviorScore: number;
  urlScore: number;
  reputationScore: number;
  processingMode: string;
  threatId?: string;
  taskId?: string;
}

export interface Threat {
  id: string;
  userId: string;
  channel: 'sms' | 'email' | 'notification' | 'call';
  sender: string;
  content: string;
  riskScore: number;
  threatLevel: string;
  classificationLabel: string;
  reasons: string[];
  analyzedAt: string;
  isRead: boolean;
}

export interface DashboardStats {
  totalThreats: number;
  activeAlerts: number;
  smsScanned: number;
  emailsScanned: number;
  recentThreats: Threat[];
  securityScore: number;
  gmailConnected: boolean;
  monitoredApps: string[];
  threatsByCategory: Record<string, number>;
}

export interface SMSPayload {
  sender: string;
  message: string;
  timestamp: string;
}

export interface NotificationPayload {
  appName: string;
  packageName: string;
  title: string;
  body: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  threatId: string;
  userId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AppSettings {
  smsMonitoringEnabled: boolean;
  notificationMonitoringEnabled: boolean;
  autoAnalyze: boolean;
  alertThreshold: number;
  darkMode: boolean;
}
