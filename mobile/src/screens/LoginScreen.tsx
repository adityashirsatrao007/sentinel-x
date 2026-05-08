import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useAuthStore } from '../store';
import { authService } from '../services/auth.service';
import { COLORS, GOOGLE_CLIENT_ID } from '../constants';
import { Button } from '../components/Button';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Google Auth Setup
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'sentinelx' });
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID || 'demo-client-id',
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Token,
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await promptAsync();
      if (result?.type === 'success' && result.params?.access_token) {
        // Fetch Google user info
        const userInfoRes = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${result.params.access_token}` },
        });
        const userInfo = await userInfoRes.json();

        try {
          // Try backend Google auth
          const authResult = await authService.googleAuth({
            idToken: result.params.access_token,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
          });

          const user = await authService.getMe();
          await login(authResult.access_token, user);
          router.replace('/(tabs)/dashboard');
        } catch {
          // Backend not configured — demo mode login
          await demoLogin(userInfo.email, userInfo.name, userInfo.picture);
        }
      }
    } catch (err) {
      Alert.alert('Google Sign-In Failed', 'Please try again or use email login.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    setIsEmailLoading(true);
    try {
      const result = await authService.login(email.trim(), password);
      await authService.storeToken(result.access_token);
      const user = await authService.getMe();
      await login(result.access_token, user);
      router.replace('/(tabs)/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Login failed. Check your credentials.';
      Alert.alert('Login Failed', message);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const demoLogin = async (email: string, name: string, picture?: string) => {
    // Demo mode — skip backend
    const mockToken = 'demo_jwt_token_' + Date.now();
    const mockUser = {
      id: 'demo-user-1',
      name: name || 'Demo User',
      email: email || 'demo@sentinelx.ai',
      avatar: picture,
      role: 'user' as const,
      gmailConnected: false,
      createdAt: new Date().toISOString(),
    };
    await login(mockToken, mockUser);
    router.replace('/(tabs)/dashboard');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={styles.logoText}>SentinelX</Text>
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to your AI-powered threat monitor
        </Text>
      </View>

      {/* Google Sign-In */}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleLogin}
        disabled={isGoogleLoading}
        activeOpacity={0.85}
      >
        <Text style={styles.googleIcon}>G</Text>
        <Text style={styles.googleText}>
          {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Email/Password Form */}
      {showEmailForm ? (
        <View style={styles.emailForm}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={COLORS.MUTED}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.MUTED}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title="Sign In"
            onPress={handleEmailLogin}
            isLoading={isEmailLoading}
            size="lg"
            style={{ marginTop: 8 }}
          />
        </View>
      ) : (
        <TouchableOpacity onPress={() => setShowEmailForm(true)} style={styles.emailToggle}>
          <Text style={styles.emailToggleText}>Use email & password</Text>
        </TouchableOpacity>
      )}

      {/* Demo Mode */}
      <TouchableOpacity
        style={styles.demoButton}
        onPress={() => demoLogin('demo@sentinelx.ai', 'Demo User')}
      >
        <Text style={styles.demoText}>🎯  Try Demo Mode (No backend required)</Text>
      </TouchableOpacity>

      {/* Security note */}
      <View style={styles.securityNote}>
        <Text style={styles.securityText}>
          🔒 Your data is encrypted and never shared. SentinelX never reads personal email content.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  shieldIcon: {
    fontSize: 32,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
  },
  googleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  dividerText: {
    color: COLORS.MUTED,
    fontSize: 13,
    fontWeight: '500',
  },
  emailForm: {
    gap: 12,
  },
  input: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 15,
  },
  emailToggle: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  emailToggleText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 15,
    fontWeight: '500',
  },
  demoButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 12,
    backgroundColor: `${COLORS.SECONDARY}20`,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${COLORS.SECONDARY}40`,
  },
  demoText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: '500',
  },
  securityNote: {
    marginTop: 32,
    backgroundColor: `${COLORS.ACCENT}10`,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: `${COLORS.ACCENT}30`,
  },
  securityText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
