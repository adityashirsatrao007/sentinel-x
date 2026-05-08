import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore, useAppStore } from '../store';
import { COLORS } from '../constants';
import { Button } from '../components/Button';

interface SettingRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  value?: boolean;
  onValueChange?: (v: boolean) => void;
  onPress?: () => void;
  isDestructive?: boolean;
  showArrow?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  onPress,
  isDestructive,
  showArrow,
}) => (
  <TouchableOpacity
    style={styles.settingRow}
    onPress={onPress}
    disabled={!onPress && value === undefined}
    activeOpacity={0.7}
  >
    <Text style={styles.settingIcon}>{icon}</Text>
    <View style={styles.settingInfo}>
      <Text style={[styles.settingTitle, isDestructive && { color: COLORS.DANGER }]}>
        {title}
      </Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {value !== undefined && onValueChange ? (
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.BORDER, true: `${COLORS.PRIMARY}80` }}
        thumbColor={value ? COLORS.PRIMARY : COLORS.MUTED}
      />
    ) : showArrow ? (
      <Text style={styles.arrow}>›</Text>
    ) : null}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { settings, updateSettings } = useAppStore();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Monitoring will stop.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleDisconnectGmail = () => {
    Alert.alert(
      'Disconnect Gmail',
      'Gmail monitoring will be disabled.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disconnect', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>
                {user?.name?.[0]?.toUpperCase() || 'S'}
              </Text>
            </View>
          )}
          <View style={styles.activeIndicator} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || 'SentinelX User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'user@sentinelx.ai'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{(user?.role || 'USER').toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Monitoring Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monitoring</Text>
        <View style={styles.card}>
          <SettingRow
            icon="📱"
            title="SMS Monitoring"
            subtitle="Scan incoming SMS messages"
            value={settings.smsMonitoringEnabled}
            onValueChange={(v) => updateSettings({ smsMonitoringEnabled: v })}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🔔"
            title="Notification Monitoring"
            subtitle="Monitor app notifications"
            value={settings.notificationMonitoringEnabled}
            onValueChange={(v) => updateSettings({ notificationMonitoringEnabled: v })}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="⚡"
            title="Auto-Analyze"
            subtitle="Instantly send to AI for analysis"
            value={settings.autoAnalyze}
            onValueChange={(v) => updateSettings({ autoAnalyze: v })}
          />
        </View>
      </View>

      {/* Connections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connections</Text>
        <View style={styles.card}>
          <SettingRow
            icon="✉️"
            title="Connect Gmail"
            subtitle="Link your Gmail for email protection"
            onPress={() => {}}
            showArrow
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🔗"
            title="Disconnect Gmail"
            subtitle="Remove Gmail access"
            onPress={handleDisconnectGmail}
            isDestructive
            showArrow
          />
        </View>
      </View>

      {/* Permissions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permissions</Text>
        <View style={styles.card}>
          <SettingRow
            icon="📨"
            title="SMS Permissions"
            subtitle="READ_SMS, RECEIVE_SMS"
            onPress={() => {}}
            showArrow
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📳"
            title="Notification Access"
            subtitle="BIND_NOTIFICATION_LISTENER_SERVICE"
            onPress={() => {}}
            showArrow
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <SettingRow icon="ℹ️" title="App Version" subtitle="SentinelX v1.0.0" />
          <View style={styles.divider} />
          <SettingRow icon="🔒" title="Privacy Policy" onPress={() => {}} showArrow />
          <View style={styles.divider} />
          <SettingRow icon="📋" title="Terms of Service" onPress={() => {}} showArrow />
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="danger"
          size="lg"
          icon="🚪"
        />
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
  },
  profileCard: {
    margin: 20,
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${COLORS.PRIMARY}30`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `${COLORS.PRIMARY}60`,
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.PRIMARY,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.ACCENT,
    borderWidth: 2,
    borderColor: COLORS.BG_CARD,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: `${COLORS.PRIMARY}20`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: `${COLORS.PRIMARY}40`,
  },
  roleText: {
    fontSize: 10,
    color: COLORS.PRIMARY,
    fontWeight: '700',
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.MUTED,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  settingIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  settingSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: COLORS.MUTED,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginLeft: 56,
  },
});
