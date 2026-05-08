import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { COLORS, STORAGE_KEYS } from '../constants';
import { useAuthStore } from '../store';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { initialize, isAuthenticated } = useAuthStore();

  // Animations
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // After 2.5 seconds, check auth and navigate
    const timer = setTimeout(async () => {
      await initialize();
      const onboardingDone = await SecureStore.getItemAsync(STORAGE_KEYS.ONBOARDING_DONE);

      if (isAuthenticated) {
        router.replace('/(tabs)/dashboard');
      } else if (onboardingDone) {
        router.replace('/(auth)/login');
      } else {
        router.replace('/onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background glow effect */}
      <Animated.View
        style={[
          styles.glowCircle,
          { transform: [{ scale: pulseAnim }] },
        ]}
      />

      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        {/* Shield Icon */}
        <View style={styles.shieldOuter}>
          <View style={styles.shieldInner}>
            <Text style={styles.shieldIcon}>🛡️</Text>
          </View>
        </View>

        <Text style={styles.logoText}>SentinelX</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>AI THREAT MONITOR</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.tagline, { opacity: taglineOpacity }]}>
        <Text style={styles.taglineText}>
          Real-time protection against phishing,{'\n'}scams & cyber threats
        </Text>
      </Animated.View>

      {/* Loading dots */}
      <View style={styles.loadingContainer}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, { opacity: 0.3 + i * 0.25 }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.PRIMARY,
    opacity: 0.05,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  shieldOuter: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: `${COLORS.PRIMARY}20`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.PRIMARY}40`,
    marginBottom: 20,
  },
  shieldInner: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: `${COLORS.PRIMARY}30`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIcon: {
    fontSize: 36,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -1,
  },
  versionBadge: {
    marginTop: 8,
    backgroundColor: `${COLORS.PRIMARY}20`,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${COLORS.PRIMARY}40`,
  },
  versionText: {
    fontSize: 11,
    color: COLORS.PRIMARY,
    fontWeight: '700',
    letterSpacing: 2,
  },
  tagline: {
    paddingHorizontal: 40,
  },
  taglineText: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.PRIMARY,
  },
});
