import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Shield, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function AuthIndex() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-10">
      <View className="items-center mb-10">
        <Shield size={80} color="#00E5FF" />
        <Text className="text-white text-3xl font-bold mt-4">SentinelX</Text>
        <Text className="text-gray-500">Secure Access Portal</Text>
      </View>

      <TouchableOpacity 
        onPress={() => router.replace('/onboarding')}
        className="bg-white p-5 rounded-3xl items-center flex-row justify-center"
      >
        <Lock size={20} color="black" className="mr-2" />
        <Text className="text-black font-bold text-lg">Sign In with Google</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
