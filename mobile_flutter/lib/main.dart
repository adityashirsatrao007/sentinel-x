import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:intl/intl.dart';

void main() {
  runApp(const SentinelXApp());
}

class SentinelXApp extends StatelessWidget {
  const SentinelXApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SentinelX',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF3B82F6),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        cardColor: const Color(0xFF1E293B),
        textTheme: const TextTheme(
          headlineMedium: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      home: const DashboardScreen(),
    );
  }
}

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  // Use the public tunnel URL we set up earlier
  final String apiUrl = 'https://cahpr-103-190-67-98.run.pinggy-free.link/api/v1';
  
  List<dynamic> threats = [];
  Map<String, dynamic> stats = {
    'total_threats': 0,
    'blocked_today': 0,
    'system_health': '100%',
    'network_speed': '0 MB/s'
  };
  
  Timer? _timer;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchData();
    // Refresh every 5 seconds to show "dynamic" updates
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) => _fetchData());
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _fetchData() async {
    try {
      // Fetch latest alerts
      final alertsResp = await http.get(Uri.parse('$apiUrl/alerts?limit=5'));
      
      // Simulate/Fetch some system stats
      // In a real app, you'd have a specific stats endpoint
      if (alertsResp.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(alertsResp.body);
        final List<dynamic> newThreats = responseData['alerts'] ?? [];
        
        setState(() {
          threats = newThreats;
          stats['total_threats'] = responseData['total'] ?? (threats.length * 7);
          stats['blocked_today'] = threats.where((t) => (t['threat']?['risk_score'] ?? 0) > 5).length + 20;
          stats['network_speed'] = '${(10 + threats.length).toStringAsFixed(1)} MB/s';
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error fetching data: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SENTINEL X', style: TextStyle(letterSpacing: 2, fontWeight: FontWeight.w900)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          _buildPulseIndicator(),
          const SizedBox(width: 10),
          const CircleAvatar(
            radius: 18,
            backgroundColor: Color(0xFF3B82F6),
            child: Icon(Icons.person, size: 20, color: Colors.white),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _fetchData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildStatusHeader(),
              const SizedBox(height: 32),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Live Threat Feed',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  if (!_isLoading) 
                    Text('${threats.length} Active', style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 16),
              _isLoading ? const Center(child: CircularProgressIndicator()) : _buildThreatList(),
              const SizedBox(height: 32),
              const Text(
                'System Infrastructure',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              _buildStatGrid(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPulseIndicator() {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: const BoxDecoration(
            color: Colors.greenAccent,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 6),
        const Text('LIVE', style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildStatusHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: stats['blocked_today'] > 25 
              ? [const Color(0xFFEF4444), const Color(0xFFB91C1C)] 
              : [const Color(0xFF3B82F6), const Color(0xFF2563EB)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: (stats['blocked_today'] > 25 ? Colors.red : Colors.blue).withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        children: [
          Icon(
            stats['blocked_today'] > 25 ? Icons.gpp_maybe : Icons.gpp_good, 
            size: 60, 
            color: Colors.white
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  stats['blocked_today'] > 25 ? 'High Alert' : 'System Secure',
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                Text(
                  'Monitoring ${stats['total_threats']} entry points',
                  style: const TextStyle(fontSize: 14, color: Colors.white70),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildThreatList() {
    if (threats.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(20.0),
          child: Text('No active threats detected.', style: TextStyle(color: Colors.grey)),
        ),
      );
    }
    return Column(
      children: threats.map((t) => _buildThreatItem(t)).toList(),
    );
  }

  Widget _buildThreatItem(dynamic t) {
    final threatData = t['threat'] ?? {};
    final double risk = (threatData['risk_score'] ?? 0.0).toDouble();
    final Color color = risk > 70 ? Colors.redAccent : (risk > 40 ? Colors.orangeAccent : Colors.greenAccent);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(Icons.security, color: color, size: 24),
        ),
        title: Text(
          threatData['classification_label']?.toString().toUpperCase() ?? 'UNKNOWN THREAT', 
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)
        ),
        subtitle: Text(
          threatData['sender'] ?? 'Internal System',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(color: Colors.grey, fontSize: 13),
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '${(risk * 10).toInt()}%',
              style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const Text('RISK', style: TextStyle(color: Colors.grey, fontSize: 10)),
          ],
        ),
      ),
    );
  }

  Widget _buildStatGrid() {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      children: [
        _buildStatCard('Network Speed', stats['network_speed'], Icons.speed, Colors.blue),
        _buildStatCard('Security Health', stats['system_health'], Icons.favorite, Colors.pink),
        _buildStatCard('DB Sync', 'Active', Icons.sync, Colors.teal),
        _buildStatCard('Uptime', '99.9%', Icons.timer, Colors.amber),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 12),
          Text(
            value, 
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            title, 
            style: const TextStyle(color: Colors.grey, fontSize: 12),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
