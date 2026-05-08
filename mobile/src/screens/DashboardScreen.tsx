import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuthStore, useAppStore } from '../store';
import { dashboardService } from '../services/dashboard.service';
import { COLORS, MONITORED_APPS } from '../constants';
import { DashboardStats } from '../types';
import { StatCard } from '../components/StatCard';
import { ThreatCard } from '../components/ThreatCard';
import { Button } from '../components/Button';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { isMonitoring, setMonitoring, alertCount } = useAppStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch {
      // Use mock data for demo
      setStats({
        totalThreats: 14,
        activeAlerts: alertCount,
        smsScanned: 127,
        emailsScanned: 43,
        recentThreats: [
          {
            id: '1',
            userId: user?.id || '',
            channel: 'sms',
            sender: '+91 98765 43210',
            content: 'URGENT: Your SBI account is blocked. Click here to verify: bit.ly/sbi-verify',
            riskScore: 94,
            threatLevel: 'CRITICAL',
            classificationLabel: 'phishing',
            reasons: ['Credential theft attempt', 'Suspicious URL', 'Urgency manipulation'],
            analyzedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            isRead: false,
          },
          {
            id: '2',
            userId: user?.id || '',
            channel: 'notification',
            sender: 'WhatsApp — Unknown',
            content: 'You won ₹50,000! Claim now: http://prize.win/claim',
            riskScore: 87,
            threatLevel: 'HIGH',
            classificationLabel: 'scam',
            reasons: ['Prize scam', 'Malicious link'],
            analyzedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            isRead: true,
          },
        ],
        securityScore: 78,
        gmailConnected: false,
        monitoredApps: MONITORED_APPS,
        threatsByCategory: {
          phishing: 8,
          scam: 4,
          malware: 2,
        },
      });
    } finally {
      setLoading(false);
    }
  }, [alertCount, user?.id]);

  useEffect(() => {
    loadStats();
    setMonitoring(true);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }, [loadStats]);

  const securityScore = stats?.securityScore ?? 0;
  const scoreColor =
    securityScore >= 80
      ? COLORS.ACCENT
      : securityScore >= 60
      ? COLORS.WARNING
      : COLORS.DANGER;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.PRIMARY}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Good {getTimeOfDay()},
          </Text>
          <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'User'} 👋</Text>
        </View>
        <View style={[styles.monitorBadge, isMonitoring && styles.monitorBadgeActive]}>
          <View style={[styles.monitorDot, isMonitoring && styles.monitorDotActive]} />
          <Text style={[styles.monitorText, isMonitoring && styles.monitorTextActive]}>
            {isMonitoring ? 'ACTIVE' : 'PAUSED'}
          </Text>
        </View>
      </View>

      {/* Security Score Card */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreLeft}>
          <Text style={styles.scoreLabel}>Security Score</Text>
          <Text style={[styles.scoreValue, { color: scoreColor }]}>
            {securityScore}
            <Text style={styles.scoreUnit}>/100</Text>
          </Text>
          <Text style={styles.scoreSubtitle}>
            {securityScore >= 80
              ? '✅ You are well protected'
              : securityScore >= 60
              ? '⚠️ Some risks detected'
              : '🚨 Immediate action needed'}
          </Text>
        </View>
        <View style={styles.scoreRight}>
          <View style={styles.scoreRing}>
            <Text style={styles.scoreRingText}>{securityScore}</Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Threats Found"
          value={stats?.totalThreats ?? '—'}
          icon="🎯"
          color={COLORS.DANGER}
          style={styles.statCard}
        />
        <StatCard
          title="Alerts"
          value={stats?.activeAlerts ?? alertCount}
          icon="🔔"
          color={COLORS.WARNING}
          style={styles.statCard}
        />
        <StatCard
          title="SMS Scanned"
          value={stats?.smsScanned ?? '—'}
          icon="📱"
          color={COLORS.PRIMARY}
          style={styles.statCard}
        />
        <StatCard
          title="Emails Scanned"
          value={stats?.emailsScanned ?? '—'}
          icon="📧"
          color={COLORS.SECONDARY}
          style={styles.statCard}
        />
      </View>

      {/* Gmail Status */}
      <View style={[styles.gmailCard, stats?.gmailConnected && styles.gmailCardConnected]}>
        <Text style={styles.gmailIcon}>✉️</Text>
        <View style={styles.gmailInfo}>
          <Text style={styles.gmailTitle}>Gmail Protection</Text>
          <Text style={styles.gmailStatus}>
            {stats?.gmailConnected ? '✅ Connected — Monitoring active' : '⚪ Not connected'}
          </Text>
        </View>
        {!stats?.gmailConnected && (
          <TouchableOpacity style={styles.gmailConnectBtn}>
            <Text style={styles.gmailConnectText}>Connect</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Monitored Apps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monitored Apps</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.appsRow}>
            {MONITORED_APPS.map((app) => (
              <View key={app} style={styles.appChip}>
                <View style={styles.appDot} />
                <Text style={styles.appName}>{app}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Recent Threats */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Threats</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>
        {stats?.recentThreats && stats.recentThreats.length > 0 ? (
          stats.recentThreats.map((threat) => (
            <ThreatCard key={threat.id} threat={threat} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>No recent threats</Text>
            <Text style={styles.emptyText}>Your communications look clean!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.MUTED,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  monitorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  monitorBadgeActive: {
    borderColor: `${COLORS.ACCENT}60`,
    backgroundColor: `${COLORS.ACCENT}10`,
  },
  monitorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.MUTED,
  },
  monitorDotActive: {
    backgroundColor: COLORS.ACCENT,
  },
  monitorText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.MUTED,
    letterSpacing: 1,
  },
  monitorTextActive: {
    color: COLORS.ACCENT,
  },
  scoreCard: {
    marginHorizontal: 20,
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLeft: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 13,
    color: COLORS.MUTED,
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -2,
  },
  scoreUnit: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.MUTED,
  },
  scoreSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  scoreRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.PRIMARY}10`,
  },
  scoreRingText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.PRIMARY,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    width: '47%',
  },
  gmailCard: {
    marginHorizontal: 20,
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: 24,
  },
  gmailCardConnected: {
    borderColor: `${COLORS.ACCENT}40`,
  },
  gmailIcon: {
    fontSize: 24,
  },
  gmailInfo: {
    flex: 1,
  },
  gmailTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  gmailStatus: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  gmailConnectBtn: {
    backgroundColor: `${COLORS.PRIMARY}20`,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: `${COLORS.PRIMARY}40`,
  },
  gmailConnectText: {
    color: COLORS.PRIMARY,
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  appsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  appChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  appDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.ACCENT,
  },
  appName: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});
