/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // SentinelX Brand Colors
        sentinel: {
          bg: '#0A0E1A',
          card: '#111827',
          border: '#1F2937',
          primary: '#00D4FF',
          secondary: '#7C3AED',
          accent: '#10B981',
          danger: '#EF4444',
          warning: '#F59E0B',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
