// SentinelX App Constants

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/api/v1';

// Backend uses /api/v1 prefix
export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_ME: '/auth/me',
  AUTH_GOOGLE: '/auth/google',

  // Analysis
  ANALYZE_SMS: '/analyze/sms',
  ANALYZE_EMAIL: '/analyze/email',
  ANALYZE_NOTIFICATION: '/analyze/notification',

  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',

  // Threats
  THREATS_HISTORY: '/alerts',

  // Gmail
  GMAIL_CONNECT: '/gmail/connect',
  GMAIL_STATUS: '/gmail/status',
  GMAIL_DISCONNECT: '/gmail/disconnect',
} as const;

export const STORAGE_KEYS = {
  JWT_TOKEN: 'sentinelx_jwt_token',
  USER_PROFILE: 'sentinelx_user_profile',
  APP_SETTINGS: 'sentinelx_app_settings',
  ONBOARDING_DONE: 'sentinelx_onboarding_done',
} as const;

export const COLORS = {
  BG_PRIMARY: '#0A0E1A',
  BG_CARD: '#111827',
  BG_CARD_ELEVATED: '#1A2332',
  BORDER: '#1F2937',
  PRIMARY: '#00D4FF',
  SECONDARY: '#7C3AED',
  ACCENT: '#10B981',
  DANGER: '#EF4444',
  WARNING: '#F59E0B',
  MUTED: '#6B7280',
  TEXT_PRIMARY: '#F9FAFB',
  TEXT_SECONDARY: '#9CA3AF',
  TEXT_MUTED: '#4B5563',
  GRADIENT_START: '#0A0E1A',
  GRADIENT_END: '#111827',
} as const;

export const RISK_LEVELS = {
  SAFE: { label: 'SAFE', color: '#10B981', bg: '#064E3B' },
  LOW: { label: 'LOW', color: '#F59E0B', bg: '#78350F' },
  MEDIUM: { label: 'MEDIUM', color: '#F97316', bg: '#7C2D12' },
  HIGH: { label: 'HIGH', color: '#EF4444', bg: '#7F1D1D' },
  CRITICAL: { label: 'CRITICAL', color: '#DC2626', bg: '#450A0A' },
} as const;

export const MONITORED_APPS = [
  'WhatsApp',
  'Telegram',
  'Instagram',
  'HDFC Bank',
  'SBI YONO',
  'Google Messages',
  'Signal',
];

export const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';
