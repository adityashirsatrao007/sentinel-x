import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../src/constants';
import { useAppStore } from '../../src/store';

interface TabIconProps {
  icon: string;
  focused: boolean;
  badgeCount?: number;
}

function TabIcon({ icon, focused, badgeCount }: TabIconProps) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
      {badgeCount && badgeCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount > 9 ? '9+' : badgeCount}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function TabsLayout() {
  const { alertCount } = useAppStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.MUTED,
        tabBarLabelStyle: styles.tabLabel,
        tabBarBackground: () => <View style={styles.tabBarBg} />,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={focused ? '🏠' : '🏠'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Threats',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🎯" focused={focused} badgeCount={alertCount} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🔔" focused={focused} badgeCount={alertCount} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⚙️" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    height: 80,
    paddingBottom: 20,
  },
  tabBarBg: {
    flex: 1,
    backgroundColor: COLORS.BG_CARD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.DANGER,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
