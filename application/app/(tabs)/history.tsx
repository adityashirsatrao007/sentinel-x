import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Search, Filter, MessageSquare, Bell, Mail, Clock } from 'lucide-react-native';
import { useThreatStore } from '../../src/store/use-threat-store';

const FilterChip = ({ label, active, onPress }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`px-5 py-2.5 rounded-full mr-2 border ${active ? 'bg-primary border-primary' : 'bg-background-card border-white/10'}`}
  >
    <Text className={`font-semibold ${active ? 'text-black' : 'text-gray-400'}`}>{label}</Text>
  </TouchableOpacity>
);

export default function HistoryScreen() {
  const { threats } = useThreatStore();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredThreats = threats.filter(t => {
    const matchesFilter = filter === 'ALL' || t.type === filter;
    const matchesSearch = t.content.toLowerCase().includes(search.toLowerCase()) || 
                          t.source.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-6 mb-4">
        <Text className="text-white text-3xl font-bold mb-6">Threat History</Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-background-card rounded-2xl px-4 py-3 border border-white/5 mb-6">
          <Search size={20} color="#666" />
          <TextInput 
            className="flex-1 text-white ml-3"
            placeholder="Search messages or senders..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          <FilterChip label="All" active={filter === 'ALL'} onPress={() => setFilter('ALL')} />
          <FilterChip label="SMS" active={filter === 'SMS'} onPress={() => setFilter('SMS')} />
          <FilterChip label="Apps" active={filter === 'NOTIFICATION'} onPress={() => setFilter('NOTIFICATION')} />
          <FilterChip label="Email" active={filter === 'EMAIL'} onPress={() => setFilter('EMAIL')} />
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-6">
        {filteredThreats.length === 0 ? (
          <View className="items-center py-20">
            <Clock size={48} color="#333" className="mb-4" />
            <Text className="text-gray-500 text-lg">No threats found in this category</Text>
          </View>
        ) : (
          filteredThreats.map((threat) => (
            <TouchableOpacity key={threat.id} className="bg-background-card p-5 rounded-3xl mb-4 border border-white/5">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <View className="bg-white/5 p-2 rounded-lg mr-3">
                    {threat.type === 'SMS' && <MessageSquare size={16} color="#00E5FF" />}
                    {threat.type === 'NOTIFICATION' && <Bell size={16} color="#FFAB00" />}
                    {threat.type === 'EMAIL' && <Mail size={16} color="#FF3D00" />}
                  </View>
                  <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">{threat.type}</Text>
                </View>
                <Text className="text-gray-500 text-xs">{threat.timestamp}</Text>
              </View>
              
              <Text className="text-white font-bold text-lg mb-1">{threat.source}</Text>
              <Text className="text-gray-400 text-sm mb-4 leading-5" numberOfLines={2}>{threat.content}</Text>
              
              <View className="flex-row justify-between items-center pt-4 border-t border-white/5">
                <View className="flex-row items-center">
                  <View className={`w-2 h-2 rounded-full mr-2 ${threat.riskScore > 70 ? 'bg-danger' : 'bg-success'}`} />
                  <Text className={threat.riskScore > 70 ? 'text-danger' : 'text-success'}>
                    {threat.riskScore > 70 ? 'High Risk' : 'Low Risk'}
                  </Text>
                </View>
                <Text className="text-gray-500 font-bold">{threat.riskScore}%</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
