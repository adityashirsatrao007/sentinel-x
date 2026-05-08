import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { COLORS, STORAGE_KEYS } from '../constants';
import { Button } from '../components/Button';

const STEPS = [
  {
    id: 1,
    icon: '🛡️',
    title: 'Welcome to SentinelX',
    subtitle: 'Your AI-powered cybersecurity guardian',
    description:
      'SentinelX monitors your SMS, notifications, and emails in real-time to protect you from phishing, scams, and cyber threats.',
  },
  {
    id: 2,
    icon: '🔐',
    title: 'Sign in Securely',
    subtitle: 'Google Sign-In — no password needed',
    description:
      'Use your existing Google account for instant, secure authentication. We never store your Google password.',
  },
  {
    id: 3,
    icon: '📱',
    title: 'Grant Permissions',
    subtitle: 'SMS & Notification Access',
    description:
      'To monitor threats, SentinelX needs access to your SMS messages and notification stream. All data is encrypted and never shared.',
  },
  {
    id: 4,
    icon: '✉️',
    title: 'Connect Gmail',
    subtitle: 'Optional but recommended',
    description:
      'Link your Gmail to detect phishing emails automatically. Our AI scans for threats without reading your private emails.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      await finishOnboarding();
    } else {
      if (currentStep === 2) {
        await requestPermissions();
      }
      setCurrentStep((s) => s + 1);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'android') return;
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);
    } catch {
      // Permissions will be requested again when needed
    }
  };

  const finishOnboarding = async () => {
    setIsLoading(true);
    await SecureStore.setItemAsync(STORAGE_KEYS.ONBOARDING_DONE, 'true');
    router.replace('/(auth)/login');
    setIsLoading(false);
  };

  const handleSkip = async () => {
    await SecureStore.setItemAsync(STORAGE_KEYS.ONBOARDING_DONE, 'true');
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      {/* Progress Dots */}
      <View style={styles.progressContainer}>
        {STEPS.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.progressDot,
              idx === currentStep && styles.progressDotActive,
              idx < currentStep && styles.progressDotDone,
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBg}>
            <Text style={styles.icon}>{step.icon}</Text>
          </View>
          {/* Decorative rings */}
          <View style={styles.ring1} />
          <View style={styles.ring2} />
        </View>

        <Text style={styles.title}>{step.title}</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>{step.subtitle}</Text>
        </View>
        <Text style={styles.description}>{step.description}</Text>

        {/* Feature list for first step */}
        {currentStep === 0 && (
          <View style={styles.featureList}>
            {[
              { icon: '🔍', text: 'AI-powered phishing detection' },
              { icon: '⚡', text: 'Real-time threat alerts' },
              { icon: '🔒', text: 'End-to-end encrypted data' },
              { icon: '📊', text: 'Personal threat dashboard' },
            ].map((feature, idx) => (
              <View key={idx} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={isLastStep ? 'Get Started' : 'Continue'}
          onPress={handleNext}
          isLoading={isLoading}
          size="lg"
          style={styles.nextButton}
        />
        {!isLastStep && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip setup</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
    paddingTop: 60,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.BORDER,
  },
  progressDotActive: {
    width: 24,
    backgroundColor: COLORS.PRIMARY,
  },
  progressDotDone: {
    backgroundColor: COLORS.ACCENT,
  },
  content: {
    paddingHorizontal: 28,
    alignItems: 'center',
    flexGrow: 1,
  },
  iconContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  iconBg: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: `${COLORS.PRIMARY}20`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.PRIMARY}40`,
    zIndex: 1,
  },
  ring1: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: `${COLORS.PRIMARY}20`,
  },
  ring2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: `${COLORS.PRIMARY}10`,
  },
  icon: {
    fontSize: 44,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitleContainer: {
    backgroundColor: `${COLORS.PRIMARY}15`,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${COLORS.PRIMARY}30`,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 23,
  },
  featureList: {
    marginTop: 28,
    width: '100%',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  actions: {
    paddingHorizontal: 28,
    gap: 12,
  },
  nextButton: {
    width: '100%',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    color: COLORS.MUTED,
    fontSize: 14,
    fontWeight: '500',
  },
});
