import { Zap, Shield, Lock, Bell, Mail, Eye, Activity, Settings2, Play, Pause, Trash2 } from 'lucide-react';
import { useState } from 'react';

const PLAYBOOKS = [
  {
    id: 1,
    name: "Executive Protection Protocol",
    trigger: "Risk > 8.5 AND Target == 'Executive'",
    actions: ["Lock Corporate Account", "Quarantine Email", "Notify CISO"],
    status: "Active",
    executions: 4
  },
  {
    id: 2,
    name: "Finance Fraud Prevention",
    trigger: "Behavior == 'financial_coercion' AND Risk > 7.0",
    actions: ["Hold Outbound Wire Transfers", "Force MFA Re-auth"],
    status: "Active",
    executions: 12
  },
  {
    id: 3,
    name: "Vishing Deepfake Mitigation",
    trigger: "AI Voice Prob > 80%",
    actions: ["Terminate Call Session", "Log Forensic Audio"],
    status: "Paused",
    executions: 2
  },
  {
    id: 4,
    name: "Internal Phish Hunting",
    trigger: "Sender Domain == 'enron-internal.com' AND Risk > 6.0",
    actions: ["Flag in Slack #soc-alerts", "Request Peer Review"],
    status: "Active",
    executions: 89
  }
];

export default function Playbooks() {
  const [playbooks, setPlaybooks] = useState(PLAYBOOKS);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-2.5 text-primary mb-2.5">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Autonomous Response</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-none uppercase">
            SOAR <span className="text-muted-foreground/30">Playbooks</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-lg font-medium leading-relaxed">
            Configure automated security orchestration and response sequences. SentinelX acts autonomously based on AI-confidence thresholds.
          </p>
        </div>
        
        <button className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all flex items-center gap-3">
          <Settings2 className="w-4 h-4" />
          New Playbook
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {playbooks.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden group shadow-sm transition-all hover:border-primary/20">
            <div className={`absolute top-0 right-0 p-8 opacity-[0.03] transition-transform group-hover:scale-110`}>
              <Shield className="w-32 h-32 text-foreground" />
            </div>
            
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-bold text-foreground tracking-tight mb-2 uppercase italic">{p.name}</h3>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${p.status === 'Active' ? 'text-emerald-500' : 'text-muted-foreground/30'}`}>{p.status}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground leading-none font-mono">{p.executions}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 mt-1">Executions</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="bg-background border border-border p-4 rounded-xl shadow-inner">
                <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mb-2">Trigger Logic</p>
                <p className="text-xs font-mono text-primary font-bold">{p.trigger}</p>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mb-3">Response Sequence</p>
                <div className="flex flex-wrap gap-2">
                  {p.actions.map((a, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-muted border border-border text-[10px] font-bold text-muted-foreground">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border flex gap-3">
                <button className="flex-1 py-3 rounded-xl bg-background border border-border hover:bg-muted text-foreground text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  {p.status === 'Active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {p.status === 'Active' ? 'Pause' : 'Resume'}
                </button>
                <button className="p-3 rounded-xl bg-background border border-border hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Placeholder for new playbook */}
        <div className="border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center p-12 hover:border-primary/40 transition-all group cursor-pointer bg-muted/20">
           <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-all">
              <Zap className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
           </div>
           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Add Automation Layer</p>
        </div>
      </div>
    </div>
  );
}
