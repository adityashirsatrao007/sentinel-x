import { create } from 'zustand';

export interface Threat {
  id: string;
  type: 'SMS' | 'NOTIFICATION' | 'EMAIL';
  source: string;
  content: string;
  riskScore: number;
  category: string;
  timestamp: string;
}

interface ThreatState {
  threats: Threat[];
  stats: {
    totalThreats: number;
    highRiskCount: number;
    securityScore: number;
  };
  addThreat: (threat: Threat) => void;
  setThreats: (threats: Threat[]) => void;
  updateStats: (stats: ThreatState['stats']) => void;
}

export const useThreatStore = create<ThreatState>((set) => ({
  threats: [],
  stats: {
    totalThreats: 0,
    highRiskCount: 0,
    securityScore: 100,
  },
  addThreat: (threat) => set((state) => ({ 
    threats: [threat, ...state.threats],
    stats: {
      ...state.stats,
      totalThreats: state.stats.totalThreats + 1,
      highRiskCount: threat.riskScore > 70 ? state.stats.highRiskCount + 1 : state.stats.highRiskCount,
    }
  })),
  setThreats: (threats) => set({ threats }),
  updateStats: (stats) => set({ stats }),
}));
