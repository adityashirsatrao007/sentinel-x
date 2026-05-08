import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Smartphone, Bell, Mail, Lock } from 'lucide-react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../../src/store/use-auth-store';

WebBrowser.maybeCompleteAuthSession();

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'SentinelX',
    subtitle: 'AI-Powered Threat Intelligence',
    description: 'Real-time protection against phishing, scams, and malicious communication.',
    icon: Shield,
  },
  {
    id: 'auth',
    title: 'Secure Access',
    subtitle: 'Google Authentication',
    description: 'We use secure Google Login to identify and protect your accounts.',
    icon: Lock,
  },
  {
    id: 'permissions',
    title: 'Protection Shield',
    subtitle: 'System Permissions',
    description: 'Enable SMS and Notification access so we can detect threats in real-time.',
    icon: Bell,
  },
  {
    id: 'gmail',
    title: 'Gmail Shield',
    subtitle: 'Email Intelligence',
    description: 'Link your Gmail to analyze suspicious emails and phishing attempts.',
    icon: Mail,
  }
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID', // Replace with real ID
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  const handleNext = async () => {
    if (step.id === 'permissions') {
      try {
        const { PermissionsAndroid, Platform } = require('react-native');
        if (Platform.OS === 'android') {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          ]);

          const { isNotificationListenerEnabled, requestNotificationListenerPermission } = require('../../modules/sentinel-native/src');
          if (!isNotificationListenerEnabled()) {
            requestNotificationListenerPermission();
          }
        }
      } catch (err) {
        console.warn('Permissions error', err);
      }
    }

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        // In a real app, send result.params.access_token to backend
        // For now, mock a successful login
        await setAuth('mock-jwt-token', {
          id: '123',
          email: 'user@example.com',
          name: 'Security User',
          picture: 'https://github.com/identicons/user.png'
        });
        handleNext();
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Unable to authenticate with Google');
    }
  };

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <View className="flex-1 bg-background px-8 justify-between py-20">
      <View className="items-center mt-10">
        <View className="bg-primary/10 p-6 rounded-full mb-8">
          <Icon size={64} color="#00E5FF" strokeWidth={1.5} />
        </View>
        <Text className="text-primary text-4xl font-bold mb-2 tracking-tighter">
          {step.title}
        </Text>
        <Text className="text-white text-xl font-semibold mb-6">
          {step.subtitle}
        </Text>
        <Text className="text-gray-400 text-center text-lg leading-6 px-4">
          {step.description}
        </Text>
      </View>

      <View>
        <View className="flex-row justify-center mb-8 gap-2">
          {ONBOARDING_STEPS.map((_, i) => (
            <View 
              key={i} 
              className={`h-1.5 rounded-full ${i === currentStep ? 'w-8 bg-primary' : 'w-2 bg-gray-800'}`} 
            />
          ))}
        </View>

        {step.id === 'auth' ? (
          <TouchableOpacity 
            onPress={handleGoogleLogin}
            className="bg-white flex-row items-center justify-center p-4 rounded-2xl mb-4"
          >
            <Text className="text-black text-lg font-bold">Continue with Google</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={handleNext}
            className="bg-primary p-4 rounded-2xl items-center mb-4"
          >
            <Text className="text-black text-lg font-bold">
              {currentStep === ONBOARDING_STEPS.length - 1 ? 'Start Monitoring' : 'Continue'}
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          onPress={() => router.replace('/(tabs)')}
          className="items-center"
        >
          <Text className="text-gray-500 text-base">Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
