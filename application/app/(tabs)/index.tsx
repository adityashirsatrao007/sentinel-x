import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Shield, AlertTriangle, MessageSquare, Bell, MoreVertical, Zap } from 'lucide-react-native';
import { useAuthStore } from '../../src/store/use-auth-store';
import { useThreatStore } from '../../src/store/use-threat-store';
import { useMonitoring } from '../../src/hooks/use-monitoring';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <View className="bg-background-card p-4 rounded-3xl w-[48%] mb-4 border border-white/5">
    <View className={`p-2 rounded-xl mb-3 self-start ${color}`}>
      <Icon size={20} color="white" />
    </View>
    <Text className="text-gray-400 text-sm mb-1">{title}</Text>
    <Text className="text-white text-2xl font-bold">{value}</Text>
  </View>
);

export default function Dashboard() {
  useMonitoring(); // Start background monitoring listeners
  const user = useAuthStore((state) => state.user);
  const { stats, threats } = useThreatStore();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-gray-400 text-base">Welcome back,</Text>
            <Text className="text-white text-2xl font-bold">{user?.name || 'Security Agent'}</Text>
          </View>
          <TouchableOpacity className="bg-background-card p-2 rounded-full border border-white/10">
            <Shield size={24} color="#00E5FF" />
          </TouchableOpacity>
        </View>

        {/* Security Score Card */}
        <View className="bg-primary/10 p-6 rounded-[40px] mb-8 border border-primary/20 items-center">
          <View className="flex-row items-center mb-4">
            <Zap size={20} color="#00E5FF" className="mr-2" />
            <Text className="text-primary font-bold uppercase tracking-widest text-xs">System Integrity</Text>
          </View>
          <Text className="text-white text-7xl font-bold mb-2">{stats.securityScore}%</Text>
          <Text className="text-gray-400 text-base">Your device is protected</Text>
        </View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between">
          <StatCard 
            title="Total Analyzed" 
            value={stats.totalThreats} 
            icon={MessageSquare} 
            color="bg-blue-500/20" 
          />
          <StatCard 
            title="Blocked Threats" 
            value={stats.highRiskCount} 
            icon={AlertTriangle} 
            color="bg-danger/20" 
          />
          <StatCard 
            title="App Alerts" 
            value="12" 
            icon={Bell} 
            color="bg-warning/20" 
          />
          <StatCard 
            title="Gmail Sync" 
            value="Active" 
            icon={Shield} 
            color="bg-success/20" 
          />
        </View>

        {/* Recent Activity */}
        <View className="mt-4 mb-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">Recent Alerts</Text>
            <TouchableOpacity>
              <Text className="text-primary">See all</Text>
            </TouchableOpacity>
          </View>

          {threats.length === 0 ? (
            <View className="bg-background-card p-8 rounded-3xl items-center border border-dashed border-white/10">
              <Shield size={32} color="#333" className="mb-2" />
              <Text className="text-gray-500">No recent threats detected</Text>
            </View>
          ) : (
            threats.slice(0, 5).map((threat) => (
              <View key={threat.id} className="bg-background-card p-4 rounded-2xl mb-3 flex-row items-center border border-white/5">
                <View className={`p-3 rounded-xl mr-4 ${threat.riskScore > 70 ? 'bg-danger/10' : 'bg-success/10'}`}>
                  <AlertTriangle size={20} color={threat.riskScore > 70 ? '#FF3D00' : '#00E676'} />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold">{threat.source}</Text>
                  <Text className="text-gray-400 text-xs" numberOfLines={1}>{threat.content}</Text>
                </View>
                <View className="items-end">
                  <Text className={`font-bold ${threat.riskScore > 70 ? 'text-danger' : 'text-success'}`}>
                    {threat.riskScore}%
                  </Text>
                  <Text className="text-gray-500 text-[10px]">Just now</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
