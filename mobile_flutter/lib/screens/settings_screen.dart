/// Settings Screen — User profile, monitoring controls, connection status
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../services/sms_service.dart';
import '../config/api_config.dart';
import '../config/theme.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _backendOnline = false;
  bool _checkingHealth = true;

  @override
  void initState() {
    super.initState();
    _checkBackend();
  }

  Future<void> _checkBackend() async {
    setState(() => _checkingHealth = true);
    final auth = context.read<AuthService>();
    if (auth.token != null) {
      final api = ApiService(auth.token!);
      final online = await api.checkHealth();
      if (mounted) setState(() {
        _backendOnline = online;
        _checkingHealth = false;
      });
    } else {
      if (mounted) setState(() => _checkingHealth = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final sms = context.watch<SmsMonitorService>();

    return Scaffold(
      appBar: AppBar(title: const Text('SETTINGS')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ─── User Profile ────────────────────────────────────────
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.surface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: AppTheme.accent,
                  child: Text(
                    (auth.userName.isNotEmpty ? auth.userName[0] : 'U').toUpperCase(),
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(auth.userName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      Text(auth.userEmail, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppTheme.accent.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          auth.userRole.toUpperCase(),
                          style: const TextStyle(color: AppTheme.accent, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // ─── Connection Status ───────────────────────────────────
          _sectionTitle('Connection'),
          _settingTile(
            icon: Icons.cloud,
            title: 'Backend Server',
            subtitle: ApiConfig.baseUrl,
            trailing: _checkingHealth
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                : Icon(
                    _backendOnline ? Icons.check_circle : Icons.cancel,
                    color: _backendOnline ? AppTheme.success : AppTheme.danger,
                  ),
            onTap: _checkBackend,
          ),
          const SizedBox(height: 20),

          // ─── Monitoring ──────────────────────────────────────────
          _sectionTitle('Monitoring'),
          _settingTile(
            icon: Icons.sms,
            title: 'SMS Monitoring',
            subtitle: sms.isMonitoring
                ? '${sms.interceptedMessages.length} messages scanned'
                : 'Tap to enable',
            trailing: Switch(
              value: sms.isMonitoring,
              activeColor: AppTheme.success,
              onChanged: (val) async {
                if (val) {
                  if (auth.token != null) {
                    sms.setApiService(ApiService(auth.token!));
                  }
                  await sms.startMonitoring();
                } else {
                  sms.stopMonitoring();
                }
              },
            ),
          ),
          _settingTile(
            icon: Icons.notifications_active,
            title: 'Threat Notifications',
            subtitle: 'Local alerts on threat detection',
            trailing: const Icon(Icons.check_circle, color: AppTheme.success),
          ),
          const SizedBox(height: 20),

          // ─── Info ────────────────────────────────────────────────
          _sectionTitle('About'),
          _settingTile(
            icon: Icons.info_outline,
            title: 'SentinelX',
            subtitle: 'v1.0.0 — AI-Powered Threat Detection',
          ),
          const SizedBox(height: 32),

          // ─── Logout ──────────────────────────────────────────────
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () async {
                sms.stopMonitoring();
                await auth.logout();
              },
              icon: const Icon(Icons.logout, color: AppTheme.danger),
              label: const Text('Sign Out', style: TextStyle(color: AppTheme.danger)),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                side: BorderSide(color: AppTheme.danger.withOpacity(0.3)),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(text, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textSecondary, letterSpacing: 1)),
    );
  }

  Widget _settingTile({
    required IconData icon,
    required String title,
    String? subtitle,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppTheme.accent),
        title: Text(title, style: const TextStyle(fontSize: 15)),
        subtitle: subtitle != null ? Text(subtitle, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)) : null,
        trailing: trailing,
        onTap: onTap,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}
