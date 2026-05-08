import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RISK_LEVELS } from '../constants';

interface RiskBadgeProps {
  level: keyof typeof RISK_LEVELS | string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const risk = RISK_LEVELS[level as keyof typeof RISK_LEVELS] || {
    label: level,
    color: COLORS.MUTED,
    bg: '#1F2937',
  };

  const padding = size === 'sm' ? { paddingHorizontal: 8, paddingVertical: 2 } 
    : size === 'lg' ? { paddingHorizontal: 16, paddingVertical: 6 } 
    : { paddingHorizontal: 12, paddingVertical: 4 };
  
  const fontSize = size === 'sm' ? 10 : size === 'lg' ? 14 : 12;

  return (
    <View style={[styles.badge, padding, { backgroundColor: risk.bg }]}>
      <View style={[styles.dot, { backgroundColor: risk.color }]} />
      <Text style={[styles.text, { color: risk.color, fontSize }]}>{risk.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
