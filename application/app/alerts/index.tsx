import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { ShieldAlert, X, ExternalLink, ChevronRight } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AlertScreen() {
  const router = useRouter();
  const { type, source, reason } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-background/95 justify-center px-8">
      <View className="bg-background-card rounded-[48px] p-8 border border-danger/30 items-center shadow-2xl shadow-danger/20">
        <View className="bg-danger/20 p-6 rounded-full mb-6">
          <ShieldAlert size={64} color="#FF3D00" />
        </View>
        
        <Text className="text-danger text-3xl font-black mb-2 uppercase tracking-tighter">
          High Risk Detected
        </Text>
        <Text className="text-white text-xl font-bold mb-6 text-center">
          Potential {type || 'Security Threat'}
        </Text>

        <View className="bg-white/5 w-full p-6 rounded-3xl mb-8">
          <View className="mb-4">
            <Text className="text-gray-500 uppercase text-[10px] font-bold tracking-widest mb-1">Source</Text>
            <Text className="text-white font-bold text-lg">{source || 'Unknown Sender'}</Text>
          </View>
          <View>
            <Text className="text-gray-500 uppercase text-[10px] font-bold tracking-widest mb-1">Threat Reason</Text>
            <Text className="text-gray-400 leading-5">{reason || 'Suspicious patterns detected in communication. Potential credential theft attempt.'}</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-danger w-full p-5 rounded-3xl items-center mb-4 flex-row justify-center"
        >
          <Text className="text-white font-black text-lg mr-2 uppercase">Block & Secure</Text>
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Text className="text-gray-500 font-bold">Dismiss Warning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
