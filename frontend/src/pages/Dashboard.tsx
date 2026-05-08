import { useEffect, useState, useCallback } from 'react';
import {
  Shield, AlertTriangle, Activity, CheckCircle2, TrendingUp,
  Mail, MessageSquare, Brain, RefreshCw, Clock, Zap, Eye,
  ShieldAlert, ShieldCheck, BarChart2, Cpu, Users, Target,
  Calendar, Info, ArrowUpRight, Globe, Lock, Bell
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  total_threats: number;
  phishing_attempts: number;
  high_risk_alerts: number;
  critical_alerts: number;
  threats_today: number;
  avg_risk_score: number;
  unacknowledged_alerts: number;
}

interface Threat {
  id: string;
  channel: string;
  sender: string;
  risk_score: number;
  threat_level: string;
  threat_detected: boolean;
  classification_label: string;
  target_department?: string;
  target_role?: string;
  content_excerpt: string;
  created_at: string;
}

interface TargetMetric {
  name: string;
  threat_count: number;
  avg_risk_score: number;
}

interface TargetAnalytics {
  departments: TargetMetric[];
  roles: TargetMetric[];
}

// ─── Constants & Helpers ──────────────────────────────────────────────────────

const CHART_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#10b981', '#06b6d4'];

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
};

const getRiskColor = (score: number) => {
  if (score >= 8.5) return '#ef4444';
  if (score >= 6.0) return '#f97316';
  if (score >= 3.0) return '#facc15';
  return '#22c55e';
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const CyberMap = () => {
  const [attacks, setAttacks] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newAttack = {
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 40 + 20,
        color: ['#ef4444', '#f97316', '#6366f1'][Math.floor(Math.random() * 3)]
      };
      setAttacks(prev => [...prev.slice(-8), newAttack]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[280px] bg-card border border-border rounded-2xl overflow-hidden shadow-inner">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
        <Globe className="w-64 h-64 text-foreground" strokeWidth={1} />
      </div>

      {attacks.map(a => (
        <div 
          key={a.id} 
          className="absolute rounded-full animate-ping opacity-40"
          style={{ 
            left: `${a.x}%`, 
            top: `${a.y}%`, 
            width: `${a.size}px`, 
            height: `${a.size}px`, 
            backgroundColor: a.color,
            animationDuration: '2.5s'
          }}
        />
      ))}

      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live Feed</span>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, sub, icon: Icon, color, trend }: any) => (
  <div className="bg-card border border-border rounded-2xl p-6 transition-all hover:shadow-lg hover:border-primary/20">
    <div className="flex items-start justify-between mb-4">
      <div className="p-2.5 rounded-xl bg-primary/5">
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/5 px-2 py-1 rounded-lg border border-red-500/10">
          <ArrowUpRight className="w-3 h-3" />
          {trend}%
        </div>
      )}
    </div>
    <div>
      <h2 className="text-3xl font-bold text-foreground tracking-tight mb-1">{value}</h2>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {sub && <p className="text-[10px] text-muted-foreground/60 mt-2 font-medium italic">{sub}</p>}
    </div>
  </div>
);

const ThreatItem = ({ threat }: { threat: Threat }) => (
  <div className={`p-5 rounded-2xl border transition-all ${threat.risk_score >= 8.5 ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'bg-muted/30 border-border'} hover:bg-muted/50`}>
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${threat.risk_score >= 8.5 ? 'bg-red-500/10' : 'bg-background border border-border'}`}>
          {threat.channel === 'email' ? <Mail className="w-4 h-4 text-blue-500" /> : <MessageSquare className="w-4 h-4 text-emerald-500" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground tracking-tight">{threat.sender}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold uppercase tracking-widest border border-primary/20">
              {threat.target_department}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{threat.classification_label}</span>
             <span className="text-muted-foreground/30">•</span>
             <span className="text-[10px] text-muted-foreground font-medium">{timeAgo(threat.created_at)}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-xl font-bold font-mono ${threat.risk_score >= 8.5 ? 'text-red-500' : 'text-foreground'}`}>{threat.risk_score.toFixed(1)}</p>
        <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Risk</p>
      </div>
    </div>
    
    <div className="bg-background border border-border rounded-xl p-3.5 mb-4 shadow-inner">
      <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">"{threat.content_excerpt}"</p>
    </div>

    <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
      <div 
        className="h-full transition-all duration-700 ease-out"
        style={{ width: `${threat.risk_score * 10}%`, backgroundColor: getRiskColor(threat.risk_score) }}
      />
    </div>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentThreats, setRecentThreats] = useState<Threat[]>([]);
  const [targetAnalytics, setTargetAnalytics] = useState<TargetAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, threatsRes, targetsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/threats?limit=8'),
        api.get('/dashboard/targets'),
      ]);
      setStats(statsRes.data);
      setRecentThreats(threatsRes.data.threats ?? []);
      setTargetAnalytics(targetsRes.data);
    } catch (err) {
      console.error('Dashboard fetch error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const refreshInterval = setInterval(fetchData, 5000);
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(refreshInterval);
      clearInterval(clockInterval);
    };
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 transition-colors duration-300">
      {/* ─── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-2.5 text-primary mb-2.5">
            <Activity className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">SOC Intelligence</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-none">
            Threat <span className="text-muted-foreground/30">Dashboard</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-8 bg-card border border-border px-8 py-5 rounded-2xl shadow-sm">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Local Time</p>
            <p className="text-2xl font-bold text-foreground font-mono tracking-tight">{formatTime(currentTime)}</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-500">Active</span>
            </div>
          </div>
          <button onClick={fetchData} className="ml-4 p-2.5 rounded-xl bg-background hover:bg-muted transition-all border border-border shadow-sm">
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Column */}
        <div className="xl:col-span-1 space-y-6">
          <CyberMap />
          {stats && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                   <p className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Risk Confidence</p>
                   <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Optimal</span>
                </div>
                <div className="text-4xl font-bold text-foreground mb-3 font-mono">{stats.avg_risk_score.toFixed(1)} <span className="text-lg text-muted-foreground/20">/ 10</span></div>
                <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                   <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${stats.avg_risk_score * 10}%` }} />
                </div>
              </div>
              <StatCard title="Total Volume" value={stats.total_threats} icon={Shield} color="#6366f1" trend={5} />
              <StatCard title="Targeted Attacks" value={stats.phishing_attempts} icon={Target} color="#f97316" />
            </div>
          )}
        </div>

        {/* Center: Live Feed */}
        <div className="xl:col-span-2 bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
              Intelligence Stream
            </h3>
            <span className="px-3 py-1 rounded-full bg-background border border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground shadow-inner">Corporate Corpus Linked</span>
          </div>
          
          <div className="space-y-5 max-h-[750px] overflow-y-auto pr-3 scrollbar-hide">
            {recentThreats.map((t) => (
              <ThreatItem key={t.id} threat={t} />
            ))}
          </div>
        </div>

        {/* Right Column: Analytics */}
        <div className="xl:col-span-1 space-y-8">
           <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-8 flex items-center gap-2">
                <Users className="w-4 h-4" /> Targeted Units
              </h3>
              <div className="space-y-6">
                {targetAnalytics?.departments.slice(0, 8).map((d, i) => (
                  <div key={d.name} className="space-y-2.5">
                    <div className="flex justify-between items-end">
                      <span className="text-[11px] font-semibold text-foreground tracking-tight">{d.name}</span>
                      <span className="text-[10px] font-bold text-muted-foreground font-mono">{d.threat_count}</span>
                    </div>
                    <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60 transition-all duration-1000" style={{ width: `${(d.threat_count / (stats?.total_threats || 100)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 text-center relative overflow-hidden group shadow-sm">
              <Brain className="w-8 h-8 text-primary mx-auto mb-4" />
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2.5">Neural Sentry Engine</h4>
              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                Autonomous linguistic profiling active. Cross-referencing incoming vectors with established forensic patterns.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
