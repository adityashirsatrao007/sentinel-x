import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, MessageSquareWarning, Activity, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, alertsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/alerts?unacknowledged_only=true')
      ]);
      setStats(statsRes.data);
      setAlerts(alertsRes.data.alerts);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  const acknowledgeAlert = async (id: string) => {
    try {
      await api.post(`/alerts/${id}/acknowledge`);
      setAlerts(alerts.filter(a => a.id !== id));
    } catch (err) {
      console.error("Failed to acknowledge alert", err);
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
      <div className={`p-4 rounded-full ${colorClass} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-muted text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-foreground mt-1">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-muted mt-1">Real-time threat intelligence and analytics.</p>
      </div>

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Threats" value={stats.total_threats} icon={Shield} colorClass="bg-blue-500 text-blue-500" />
          <StatCard title="Critical Alerts" value={stats.critical_alerts} icon={AlertTriangle} colorClass="bg-red-500 text-red-500" />
          <StatCard title="Phishing Attempts" value={stats.phishing_attempts} icon={MessageSquareWarning} colorClass="bg-orange-500 text-orange-500" />
          <StatCard title="Avg Risk Score" value={stats.avg_risk_score.toFixed(1)} icon={Activity} colorClass="bg-purple-500 text-purple-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-card border border-border rounded-xl"></div>)}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Action Required: Unacknowledged Alerts
        </h2>
        
        {alerts.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
            <p className="text-foreground font-medium">All clear!</p>
            <p className="text-muted text-sm mt-1">No unacknowledged alerts require your attention.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-card border border-red-500/30 rounded-xl p-5 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                      CRITICAL
                    </span>
                    <span className="text-sm text-muted">Risk Score: {alert.threat.risk_score}</span>
                  </div>
                  <h4 className="text-foreground font-medium mt-2">Source: {alert.threat.sender}</h4>
                  <p className="text-muted text-sm mt-1 line-clamp-2">{alert.threat.content_excerpt}</p>
                </div>
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
