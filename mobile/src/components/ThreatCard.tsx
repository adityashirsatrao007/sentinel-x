import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';
import { Threat } from '../types';
import { RiskBadge } from './RiskBadge';
import { formatDistanceToNow } from 'date-fns';

interface ThreatCardProps {
  threat: Threat;
  onPress?: () => void;
}

const CHANNEL_ICONS: Record<string, string> = {
  sms: '📱',
  email: '📧',
  notification: '🔔',
  call: '📞',
};

export const ThreatCard: React.FC<ThreatCardProps> = ({ threat, onPress }) => {
  const icon = CHANNEL_ICONS[threat.channel] || '⚠️';
  const timeAgo = formatDistanceToNow(new Date(threat.analyzedAt), { addSuffix: true });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.channelBadge}>
          <Text style={styles.channelIcon}>{icon}</Text>
          <Text style={styles.channelText}>{threat.channel.toUpperCase()}</Text>
        </View>
        <RiskBadge level={threat.threatLevel} size="sm" />
      </View>

      <Text style={styles.sender} numberOfLines={1}>
        {threat.sender}
      </Text>
      <Text style={styles.content} numberOfLines={2}>
        {threat.content}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.time}>{timeAgo}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Risk:</Text>
          <Text style={[styles.score, { color: threat.riskScore > 60 ? COLORS.DANGER : COLORS.ACCENT }]}>
            {Math.round(threat.riskScore)}%
          </Text>
        </View>
      </View>

      {threat.reasons.length > 0 && (
        <View style={styles.reasons}>
          {threat.reasons.slice(0, 2).map((reason, idx) => (
            <View key={idx} style={styles.reasonBadge}>
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  channelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  channelIcon: { fontSize: 14 },
  channelText: {
    fontSize: 10,
    color: COLORS.MUTED,
    fontWeight: '600',
    letterSpacing: 1,
  },
  sender: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
    marginBottom: 4,
  },
  content: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 11,
    color: COLORS.MUTED,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreLabel: {
    fontSize: 11,
    color: COLORS.MUTED,
  },
  score: {
    fontSize: 13,
    fontWeight: '700',
  },
  reasons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  reasonBadge: {
    backgroundColor: '#1F2937',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  reasonText: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
  },
});
