import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../constants';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = COLORS.PRIMARY,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      {icon && (
        <Text style={[styles.icon, { color }]}>{icon}</Text>
      )}
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 10,
    color: COLORS.MUTED,
    marginTop: 2,
    textAlign: 'center',
  },
});
