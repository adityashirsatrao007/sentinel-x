import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { alertService } from '../services/alert.service';
import { COLORS } from '../constants';
import { Threat } from '../types';
import { ThreatCard } from '../components/ThreatCard';

const FILTERS = ['All', 'SMS', 'Email', 'Notification'] as const;
type Filter = typeof FILTERS[number];

// Mock threat history for demo
const MOCK_THREATS: Threat[] = [
  {
    id: '1',
    userId: 'demo',
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
    userId: 'demo',
    channel: 'notification',
    sender: 'WhatsApp — Unknown Number',
    content: 'You won ₹50,000! Claim your prize now: http://prize.win/claim-now',
    riskScore: 87,
    threatLevel: 'HIGH',
    classificationLabel: 'scam',
    reasons: ['Prize scam pattern', 'Malicious link detected'],
    analyzedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isRead: true,
  },
  {
    id: '3',
    userId: 'demo',
    channel: 'sms',
    sender: 'HDFC-BANK',
    content: 'Dear customer, your OTP is 847291 for transaction of Rs.15,000 at Amazon.',
    riskScore: 22,
    threatLevel: 'SAFE',
    classificationLabel: 'legitimate',
    reasons: ['Verified sender', 'Standard OTP pattern'],
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isRead: true,
  },
  {
    id: '4',
    userId: 'demo',
    channel: 'email',
    sender: 'security@paypa1-alert.com',
    content: 'Your PayPal account has been limited. Verify now to restore access.',
    riskScore: 96,
    threatLevel: 'CRITICAL',
    classificationLabel: 'phishing',
    reasons: ['Domain spoofing', 'Account suspension threat', 'Fake sender'],
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    isRead: false,
  },
  {
    id: '5',
    userId: 'demo',
    channel: 'notification',
    sender: 'Telegram — Group',
    content: 'Free crypto airdrop! Join now and earn 0.5 BTC. Limited time offer.',
    riskScore: 79,
    threatLevel: 'HIGH',
    classificationLabel: 'scam',
    reasons: ['Cryptocurrency scam', 'Unrealistic promises'],
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
  },
];

export default function HistoryScreen() {
  const [threats, setThreats] = useState<Threat[]>(MOCK_THREATS);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const channel =
        activeFilter === 'All' ? undefined : activeFilter.toLowerCase();
      const result = await alertService.getHistory(channel);
      if (result.items?.length > 0) {
        // Map backend Alert → Threat shape
        const mapped: Threat[] = result.items.map((a: any) => ({
          id: a.id,
          userId: a.userId || '',
          channel: a.channel || 'sms',
          sender: a.sender || 'Unknown',
          content: a.message || a.content || '',
          riskScore: a.riskScore || 0,
          threatLevel: a.severity || a.threatLevel || 'LOW',
          classificationLabel: a.classificationLabel || '',
          reasons: a.reasons || [],
          analyzedAt: a.createdAt || new Date().toISOString(),
          isRead: a.isRead || false,
        }));
        setThreats(mapped);
      }
    } catch {
      // Use mock data
    }
  }, [activeFilter]);

  useEffect(() => {
    loadHistory();
  }, [activeFilter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  const filteredThreats =
    activeFilter === 'All'
      ? threats
      : threats.filter((t) => t.channel === activeFilter.toLowerCase());

  const criticalCount = filteredThreats.filter(
    (t) => t.threatLevel === 'CRITICAL' || t.threatLevel === 'HIGH'
  ).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Threat History</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filteredThreats.length}</Text>
        </View>
      </View>

      {/* Alert summary */}
      {criticalCount > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertBannerIcon}>🚨</Text>
          <Text style={styles.alertBannerText}>
            {criticalCount} high-severity threat{criticalCount > 1 ? 's' : ''} detected
          </Text>
        </View>
      )}

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersRow}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
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
        {filteredThreats.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No threats found</Text>
            <Text style={styles.emptyText}>No {activeFilter.toLowerCase()} threats detected yet.</Text>
          </View>
        ) : (
          filteredThreats.map((threat) => (
            <ThreatCard key={threat.id} threat={threat} />
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
  countBadge: {
    backgroundColor: COLORS.DANGER,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  alertBanner: {
    marginHorizontal: 20,
    backgroundColor: `${COLORS.DANGER}15`,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: `${COLORS.DANGER}30`,
    marginBottom: 12,
  },
  alertBannerIcon: {
    fontSize: 16,
  },
  alertBannerText: {
    color: COLORS.DANGER,
    fontSize: 13,
    fontWeight: '600',
  },
  filtersRow: {
    maxHeight: 52,
    marginBottom: 12,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.BG_CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  filterChipActive: {
    backgroundColor: `${COLORS.PRIMARY}20`,
    borderColor: COLORS.PRIMARY,
  },
  filterText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.PRIMARY,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});
