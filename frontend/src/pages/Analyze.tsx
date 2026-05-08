import { useState } from 'react';
import { Mail, MessageSquare, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import api from '../lib/api';

export default function Analyze() {
  const [activeTab, setActiveTab] = useState<'email' | 'sms'>('email');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Form State
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload = activeTab === 'email' 
        ? { sender, subject, body }
        : { sender, message: body };
        
      const res = await api.post(`/analyze/${activeTab}`, payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Threat Analysis Engine</h1>
        <p className="text-muted mt-1">Manually evaluate communications against the SentinelX AI models.</p>
      </div>

      <div className="mt-8 flex gap-4 border-b border-border">
        <button
          onClick={() => { setActiveTab('email'); setResult(null); }}
          className={`pb-4 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'email' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'}`}
        >
          <Mail className="w-4 h-4" /> Email Analysis
        </button>
        <button
          onClick={() => { setActiveTab('sms'); setResult(null); }}
          className={`pb-4 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'sms' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'}`}
        >
          <MessageSquare className="w-4 h-4" /> SMS Analysis
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted">Sender {activeTab === 'sms' && '(Phone Number)'}</label>
              <input
                required
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder={activeTab === 'email' ? 'attacker@scam.com' : '+18005559999'}
                className="mt-1 block w-full px-3 py-2 border border-border rounded-lg bg-[#0f0f12] text-foreground focus:ring-primary focus:border-primary"
              />
            </div>
            
            {activeTab === 'email' && (
              <div>
                <label className="block text-sm font-medium text-muted">Subject</label>
                <input
                  required
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="URGENT: Account Locked"
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-lg bg-[#0f0f12] text-foreground focus:ring-primary focus:border-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-muted">Message Body</label>
              <textarea
                required
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Click this link immediately to verify..."
                className="mt-1 block w-full px-3 py-2 border border-border rounded-lg bg-[#0f0f12] text-foreground focus:ring-primary focus:border-primary resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run AI Analysis'}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="bg-[#0f0f12] border border-border rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-medium text-foreground border-b border-border pb-4 mb-4">Analysis Results</h3>
          
          {!result && !loading && (
            <div className="flex-1 flex items-center justify-center text-muted text-sm text-center">
              Submit a payload to see real-time AI evaluation.
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-muted space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Analyzing context and behavior...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${result.threat_detected ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {result.threat_detected ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-foreground">Score: {result.risk_score}</h4>
                  <p className={`text-sm font-medium ${result.threat_detected ? 'text-red-500' : 'text-green-500'}`}>
                    {result.threat_level} THREAT
                  </p>
                </div>
              </div>

              {result.threat_detected && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-red-500 mb-2">Detection Reasons</h5>
                  <ul className="space-y-2 text-sm text-foreground">
                    {result.reasons.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted mb-1">NLP Score</p>
                  <p className="font-semibold text-foreground">{result.nlp_score}</p>
                </div>
                <div className="bg-card p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted mb-1">Behavior Score</p>
                  <p className="font-semibold text-foreground">{result.behavior_score}</p>
                </div>
                <div className="bg-card p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted mb-1">URL Score</p>
                  <p className="font-semibold text-foreground">{result.url_score}</p>
                </div>
                <div className="bg-card p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted mb-1">Classification</p>
                  <p className="font-semibold text-foreground capitalize">{result.classification_label}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
