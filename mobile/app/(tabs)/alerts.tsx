import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { alertService } from '../../src/services/alert.service';
import { COLORS } from '../../src/constants';
import { Threat } from '../../src/types';
import { ThreatCard } from '../../src/components/ThreatCard';
import { useAppStore } from '../../src/store';

const MOCK_ALERTS: Threat[] = [
  {
    id: 'a1',
    userId: 'demo',
    channel: 'sms',
    sender: '+91 98765 43210',
    content: 'URGENT: Your SBI account is blocked. Click to verify: bit.ly/verify-now',
    riskScore: 94,
    threatLevel: 'CRITICAL',
    classificationLabel: 'phishing',
    reasons: ['Credential theft', 'Suspicious URL', 'Urgency manipulation'],
    analyzedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isRead: false,
  },
  {
    id: 'a2',
    userId: 'demo',
    channel: 'notification',
    sender: 'WhatsApp — Unknown',
    content: 'Win ₹50,000! You are selected. Claim: shorturl.at/prize',
    riskScore: 88,
    threatLevel: 'HIGH',
    classificationLabel: 'scam',
    reasons: ['Prize scam', 'Malicious link'],
    analyzedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isRead: false,
  },
];

export default function AlertsTab() {
  const [alerts, setAlerts] = useState<Threat[]>(MOCK_ALERTS);
  const [refreshing, setRefreshing] = useState(false);
  const { setAlertCount } = useAppStore();

  const loadAlerts = useCallback(async () => {
    try {
      const result = await alertService.getAlerts();
      if (result.items?.length > 0) {
        const mapped = result.items.map((a: any) => ({
          id: a.id,
          userId: a.userId || '',
          channel: 'sms' as const,
          sender: a.sender || 'Unknown',
          content: a.message || '',
          riskScore: a.riskScore || 0,
          threatLevel: a.severity || 'LOW',
          classificationLabel: '',
          reasons: [],
          analyzedAt: a.createdAt || new Date().toISOString(),
          isRead: a.isRead || false,
        }));
        setAlerts(mapped);
        const unread = mapped.filter((a: Threat) => !a.isRead).length;
        setAlertCount(unread);
      }
    } catch {
      setAlertCount(MOCK_ALERTS.filter((a) => !a.isRead).length);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
    setAlertCount(MOCK_ALERTS.filter((a) => !a.isRead).length);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  }, [loadAlerts]);

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Alerts</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount} unread</Text>
          </View>
        )}
      </View>

      {/* High risk banner */}
      {alerts.some((a) => a.threatLevel === 'CRITICAL') && (
        <View style={styles.criticalBanner}>
          <Text style={styles.criticalBannerText}>
            🚨  CRITICAL THREAT DETECTED — Immediate action required
          </Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.PRIMARY}
          />
        }
      >
        {alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>No active alerts</Text>
            <Text style={styles.emptyText}>You are protected. No threats detected.</Text>
          </View>
        ) : (
          alerts.map((alert) => (
            <View key={alert.id} style={styles.alertWrapper}>
              {!alert.isRead && <View style={styles.unreadDot} />}
              <ThreatCard threat={alert} />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  unreadBadge: {
    backgroundColor: `${COLORS.DANGER}20`,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${COLORS.DANGER}40`,
  },
  unreadText: {
    color: COLORS.DANGER,
    fontSize: 11,
    fontWeight: '700',
  },
  criticalBanner: {
    marginHorizontal: 20,
    backgroundColor: COLORS.DANGER,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  criticalBannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  alertWrapper: {
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    left: -8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.PRIMARY,
    zIndex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});
