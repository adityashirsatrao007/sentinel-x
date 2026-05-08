import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store';
import SplashScreen from '../src/screens/SplashScreen';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <SplashScreen />;
}
