# SentinelX Mobile — AI-Powered Cybersecurity Threat Monitor

<div align="center">

🛡️ **SentinelX** — Real-time phishing, scam & cyber threat protection for Android

![Platform](https://img.shields.io/badge/platform-Android-green)
![Expo](https://img.shields.io/badge/Expo-55-blue)
![React Native](https://img.shields.io/badge/React_Native-0.79-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## 📱 Overview

SentinelX Mobile is a production-ready **Expo React Native** Android application that acts as a real-time threat monitoring agent. It monitors incoming SMS messages, app notifications, and Gmail for phishing, scam, and social engineering attacks using an AI-powered backend.

### Features

| Feature | Status |
|---|---|
| 🔐 Google Sign-In (OAuth) | ✅ |
| 📱 SMS Monitoring (Native Kotlin) | ✅ |
| 🔔 Notification Listener (Kotlin Service) | ✅ |
| 📞 Call State Detection | ✅ |
| ✉️ Gmail Integration | ✅ |
| 🚨 Real-time Push Alerts | ✅ |
| 📊 Dashboard with Security Score | ✅ |
| 📋 Threat History with Filters | ✅ |
| ⚙️ Settings & Permission Management | ✅ |
| 🌙 Dark Mode (default) | ✅ |
| 🏗️ EAS Build ready | ✅ |

---

## 🏗️ Architecture

```
SentinelX Mobile App
├── Expo Router (file-based routing)
├── Zustand (state management)
├── Axios + interceptors (API layer)
├── Expo Secure Store (JWT storage)
├── NativeWind (styling)
└── Native Kotlin Modules
    ├── SmsReceiverModule.kt      ← listens for incoming SMS
    ├── NotificationListenerModule.kt ← captures app notifications
    └── CallStateModule.kt        ← detects incoming calls
```

---

## 📁 Project Structure

```
mobile/
├── app/                      # Expo Router screens
│   ├── _layout.tsx           # Root layout
│   ├── index.tsx             # Entry point
│   ├── onboarding.tsx        # Onboarding flow
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx         # Google sign-in
│   └── (tabs)/
│       ├── _layout.tsx       # Tab navigation
│       ├── dashboard.tsx     # Security dashboard
│       ├── alerts.tsx        # Active alerts
│       ├── history.tsx       # Threat history
│       └── settings.tsx      # User settings
│
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── StatCard.tsx
│   │   └── ThreatCard.tsx
│   ├── screens/              # Screen logic
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/             # API service layer
│   │   ├── api.ts            # Axios client + interceptors
│   │   ├── auth.service.ts
│   │   ├── sms.service.ts
│   │   ├── notification.service.ts
│   │   ├── dashboard.service.ts
│   │   └── alert.service.ts
│   ├── store/
│   │   └── index.ts          # Zustand stores (auth + app)
│   ├── hooks/
│   │   └── useNativeMonitoring.ts  # Native module bridge
│   ├── types/
│   │   └── index.ts
│   └── constants/
│       └── index.ts
│
├── android/
│   └── app/src/main/java/com/sentinelx/mobile/
│       ├── SmsReceiverModule.kt        # ← Native SMS listener
│       ├── SmsReceiver.kt              # ← BroadcastReceiver
│       ├── NotificationListenerModule.kt
│       ├── SentinelNotificationListenerService.kt
│       ├── CallStateModule.kt
│       └── SentinelXPackage.kt
│
├── app.json                  # Expo config + Android permissions
├── eas.json                  # EAS Build profiles
├── babel.config.js           # Babel + NativeWind + Reanimated
├── tailwind.config.js        # NativeWind theme
└── .env                      # Environment variables
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/build/setup/) (for APK build)
- Java JDK 17+ (for Android builds)
- Android Studio (for local builds)

### 1. Clone & Install

```bash
cd SentinelX/mobile
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# For Android emulator (reaches host machine)
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api/v1

# For physical device (use your machine's IP)
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api/v1

# Google OAuth (optional, app works in demo mode without it)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 3. Start Development

```bash
# Start Expo dev server
npx expo start --dev-client

# Or start for Android specifically
npx expo start --android
```

---

## 📦 Building the APK

### Option 1: EAS Build (Recommended — No Android Studio required)

This builds in the cloud on Expo's infrastructure.

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build development APK (with dev-client, for testing native modules)
eas build --platform android --profile development

# Build preview APK (standalone, shareable)
eas build --platform android --profile preview
```

The APK download link will appear in the terminal and at [expo.dev](https://expo.dev).

### Option 2: Local Build (Requires Android Studio + JDK 17)

```bash
# Generate native Android project
npx expo prebuild --platform android --clean

# Build debug APK
cd android && ./gradlew assembleDebug

# APK location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔧 Google OAuth Setup (Optional)

> **Note:** The app works in **Demo Mode** without Google credentials.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project → **APIs & Services** → **Credentials**
3. Create **OAuth 2.0 Client ID** for **Android**
4. Add your package name: `com.sentinelx.mobile`
5. Get the SHA-1 fingerprint: `keytool -list -v -keystore ~/.android/debug.keystore`
6. Copy the Client ID to `.env`

---

## 🔔 Notification Listener Setup

Android requires manual permission for notification listening:

1. Open app → Settings → Grant "Notification Access"
2. The app will open Android's **Notification Access** settings page
3. Enable **SentinelX Threat Monitor**

---

## 🏛️ Backend API Integration

The app connects to the SentinelX FastAPI backend at `EXPO_PUBLIC_API_URL`.

| Endpoint | Method | Description |
|---|---|---|
| `/auth/login` | POST | Email/password login |
| `/auth/google` | POST | Google OAuth login |
| `/auth/me` | GET | Get current user |
| `/analyze/sms` | POST | Analyze SMS for threats |
| `/analyze/email` | POST | Analyze email |
| `/dashboard/stats` | GET | Dashboard statistics |
| `/alerts` | GET | Threat history |

All requests include `Authorization: Bearer <JWT>` header automatically.

---

## 🔒 Security Architecture

| Layer | Implementation |
|---|---|
| Token Storage | `expo-secure-store` (AES-256 encrypted) |
| API Transport | HTTPS only |
| Auth | JWT with auto-refresh interceptor |
| Permissions | Requested at runtime with explanation |
| Data | Only metadata sent (no raw SMS/email content stored on device) |

---

## 📱 Native Kotlin Modules

### SmsReceiverModule

- Registers a `BroadcastReceiver` for `android.provider.Telephony.SMS_RECEIVED`
- Extracts sender, body, timestamp
- Emits `onSmsReceived` event to React Native

### SentinelNotificationListenerService

- `NotificationListenerService` registered in `AndroidManifest.xml`
- Monitors: WhatsApp, Telegram, Instagram, banking apps, Signal
- Emits `onNotificationReceived` event to React Native

### CallStateModule

- `PhoneStateListener` via `TelephonyManager`
- Detects RINGING / OFFHOOK / IDLE
- Emits `onCallStateChanged` — only metadata, NO recording

---

## 🧪 Testing

```bash
# TypeScript type check
npx tsc --noEmit

# Run on Android emulator
npx expo run:android

# Run on physical device (USB debug)
npx expo run:android --device
```

---

## 📋 Troubleshooting

| Issue | Fix |
|---|---|
| `network error` connecting to backend | Check `EXPO_PUBLIC_API_URL`, use `10.0.2.2` for emulator |
| Google OAuth not working | App works in Demo Mode — tap "Try Demo Mode" |
| SMS not triggering | Enable SMS permission in Android Settings |
| Notification monitoring not active | Go to Settings → Grant Notification Access |
| Build fails | Ensure JDK 17+ and `JAVA_HOME` is set |

---

## 🗺️ Roadmap

- [ ] Biometric authentication (fingerprint/face)
- [ ] WebSocket real-time connection for instant alerts  
- [ ] Call transcript analysis integration
- [ ] iOS support
- [ ] Wearable (WearOS) companion app
- [ ] Offline threat detection cache

---

## 📝 License

MIT © SentinelX Team
