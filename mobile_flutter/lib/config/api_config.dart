/// SentinelX API Configuration
/// Using adb reverse tunnel: phone's localhost:8000 → PC's localhost:8000
/// No WiFi needed — works over USB!
class ApiConfig {
  // ─── Using USB tunnel (adb reverse tcp:8000 tcp:8000) ─────────────────
  // This routes phone's localhost:8000 to your PC's localhost:8000 via USB
  static const String _localIp = '127.0.0.1';
  static const int _port = 8000;

  static const String baseUrl = 'http://$_localIp:$_port';
  static const String apiUrl = '$baseUrl/api/v1';

  // ─── Endpoints ─────────────────────────────────────────────────────────────
  static const String login = '$apiUrl/auth/login';
  static const String register = '$apiUrl/auth/register';
  static const String me = '$apiUrl/auth/me';
  static const String analyzeEmail = '$apiUrl/analyze/email';
  static const String analyzeSms = '$apiUrl/analyze/sms';
  static const String analyzeCall = '$apiUrl/analyze/call';
  static const String dashboardStats = '$apiUrl/dashboard/stats';
  static const String dashboardThreats = '$apiUrl/dashboard/threats';
  static const String dashboardTrends = '$apiUrl/dashboard/trends';
  static const String alerts = '$apiUrl/alerts';
  static const String gmailConnect = '$apiUrl/gmail/connect';
  static const String gmailAccounts = '$apiUrl/gmail/accounts';
  static const String registerDevice = '$apiUrl/users/me/devices';
  static const String health = '$baseUrl/health';
}
