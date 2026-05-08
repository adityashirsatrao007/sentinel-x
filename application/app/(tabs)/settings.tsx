import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { User, Shield, Bell, Lock, LogOut, ChevronRight, Mail, Smartphone } from 'lucide-react-native';
import { useAuthStore } from '../../src/store/use-auth-store';
import { useRouter } from 'expo-router';

const SettingItem = ({ icon: Icon, title, value, onPress, isLast, color = "#00E5FF" }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`flex-row items-center justify-between py-4 ${!isLast ? 'border-b border-white/5' : ''}`}
  >
    <View className="flex-row items-center">
      <View className="bg-white/5 p-2 rounded-xl mr-4">
        <Icon size={22} color={color} />
      </View>
      <Text className="text-white text-lg">{title}</Text>
    </div>
    <View className="flex-row items-center">
      {value && <Text className="text-gray-500 mr-2">{value}</Text>}
      <ChevronRight size={20} color="#333" />
    </View>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-white text-3xl font-bold mb-8">Settings</Text>

        {/* Profile Card */}
        <View className="bg-background-card p-6 rounded-[32px] mb-8 border border-white/5 flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mr-4">
            <User size={32} color="#00E5FF" />
          </View>
          <View>
            <Text className="text-white text-xl font-bold">{user?.name}</Text>
            <Text className="text-gray-500">{user?.email}</Text>
          </View>
        </View>

        {/* Security Section */}
        <Text className="text-primary font-bold uppercase tracking-widest text-xs mb-4 ml-2">Protection</Text>
        <View className="bg-background-card px-5 rounded-[32px] mb-8 border border-white/5">
          <SettingItem icon={Smartphone} title="SMS Monitoring" value="Enabled" />
          <SettingItem icon={Bell} title="App Notifications" value="Enabled" />
          <SettingItem icon={Mail} title="Gmail Shield" value="Connected" />
          <SettingItem icon={Shield} title="Real-time Alerts" value="High" isLast />
        </View>

        {/* Account Section */}
        <Text className="text-primary font-bold uppercase tracking-widest text-xs mb-4 ml-2">Account</Text>
        <View className="bg-background-card px-5 rounded-[32px] mb-8 border border-white/5">
          <SettingItem icon={Lock} title="Privacy Policy" />
          <SettingItem icon={Shield} title="Terms of Service" isLast />
        </View>

        {/* Logout */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-danger/10 p-5 rounded-[32px] border border-danger/20 flex-row items-center justify-center mb-20"
        >
          <LogOut size={20} color="#FF3D00" className="mr-2" />
          <Text className="text-danger font-bold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
