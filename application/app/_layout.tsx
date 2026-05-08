import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../src/store/use-auth-store';
import "../src/styles/global.css";
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const loadStoredAuth = useAuthStore((state) => state.loadStoredAuth);

  useEffect(() => {
    async function prepare() {
      try {
        // Load session from SecureStore
        await loadStoredAuth();
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide splash screen after initialization
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ 
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#0A0A0A' }
      }}>
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="alerts" options={{ presentation: 'transparentModal' }} />
      </Stack>
    </>
  );
}
