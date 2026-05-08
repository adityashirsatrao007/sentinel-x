import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Crosshair, AlertTriangle, ShieldAlert, Cpu, Loader2, Copy, CheckCircle2, ArrowRight, Search } from 'lucide-react';

const RED_TEAM_TEMPLATES: Record<string, Record<string, { sender: string, subject: string, body: string }>> = {
  "Executive": {
    "Wire Transfer Fraud": {
      sender: "legal@enron-corporate-counsel.com",
      subject: "URGENT: Confidential M&A Wire Transfer Required",
      body: "Please initiate an immediate wire transfer of $450,000 to our escrow account for the confidential acquisition we discussed. The SEC filing window closes in 2 hours. Do not discuss this with anyone else in the office due to insider trading regulations. Escrow details attached."
    },
    "Credential Harvesting": {
      sender: "it-admin@enron-sso-secure.com",
      subject: "ACTION REQUIRED: Executive SSO Portal Migration",
      body: "We are migrating all executive accounts to the new highly secure SSO portal. Your current credentials will expire in 1 hour. Please log in immediately to synchronize your 2FA token: https://enron-sso-secure.com/auth/exec. Failure to comply will result in an immediate lock-out from all corporate services."
    }
  },
  "Finance": {
    "Wire Transfer Fraud": {
      sender: "ceo@enr0n.com",
      subject: "Urgent Vendor Payment Processing",
      body: "I am currently in a meeting and cannot be reached by phone. I need you to process an urgent invoice payment of $28,500 to our new logistics vendor immediately. This is critical for our Q3 deliverables. The routing details are below. Please confirm once sent."
    },
    "Payroll Update": {
      sender: "hr-benefits@enron-payroll.net",
      subject: "IMPORTANT: Direct Deposit Discrepancy",
      body: "We noticed a discrepancy in your recent direct deposit routing information. Your upcoming paycheck has been placed on hold. Please update your banking details in the portal within 24 hours to ensure timely payment: https://enron-payroll.net/update."
    }
  },
  "HR": {
    "Urgent Document": {
      sender: "legal-dept@enron-compliance.org",
      subject: "URGENT: Employee Lawsuit Notification",
      body: "Our department has received a formal complaint regarding a severe workplace violation. You have been named as a primary contact for this investigation. Please review the attached subpoena immediately. You are legally required to respond within 48 hours."
    },
    "Credential Harvesting": {
      sender: "support@workday-enron.com",
      subject: "Workday Security Alert",
      body: "We detected an unauthorized login attempt on your HR admin account from Shenzhen, China. If this was not you, please secure your account immediately by resetting your password here: https://workday-enron.com/secure."
    }
  },
  "Engineering": {
    "Credential Harvesting": {
      sender: "github-security@gh-enron.io",
      subject: "[CRITICAL] Unverified SSH Key Added to your Account",
      body: "A new SSH key (ED25519) was added to your GitHub enterprise account from an unknown IP address. If you did not authorize this, an attacker may have full access to our source code. Please verify your identity and revoke the key immediately at: https://gh-enron.io/security/keys."
    },
    "Urgent Document": {
      sender: "aws-admin@enron-cloud.net",
      subject: "AWS Production Database Approaching Capacity Limit",
      body: "URGENT: The production database cluster is currently at 98% capacity. If no action is taken, the system will crash in approximately 15 minutes causing a complete service outage. Please review the diagnostic report and authorize a storage upgrade here: https://enron-cloud.net/aws/rds."
    }
  }
};

export default function RedTeam() {
  const navigate = useNavigate();
  const [target, setTarget] = useState('Executive');
  const [vector, setVector] = useState('Wire Transfer Fraud');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedBody, setStreamedBody] = useState('');

  const getVectorsForTarget = () => {
    return Object.keys(RED_TEAM_TEMPLATES[target] || {});
  };

  const handleTargetChange = (e: any) => {
    const newTarget = e.target.value;
    setTarget(newTarget);
    setVector(Object.keys(RED_TEAM_TEMPLATES[newTarget])[0]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setStreamedBody('');

    // Simulate LLM connecting delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const payload = RED_TEAM_TEMPLATES[target][vector];
    setResult(payload);
    setLoading(false);
    
    // Typewriter streaming effect
    setIsStreaming(true);
    let currentText = "";
    for (let i = 0; i < payload.body.length; i++) {
      currentText += payload.body[i];
      setStreamedBody(currentText);
      await new Promise(resolve => setTimeout(resolve, 15)); // fast typing speed
    }
    setIsStreaming(false);
  };

  const handleAnalyze = () => {
    if (result) {
      navigate('/analyze', { 
        state: { 
          sender: result.sender, 
          subject: result.subject, 
          body: result.body,
          type: 'email' 
        } 
      });
    }
  };

  const handleSendToMobile = async () => {
    if (result) {
      setLoading(true);
      try {
        await api.post('/remote/event', { 
          type: 'MOBILE_ATTACK', 
          payload: { 
            sender: result.sender, 
            body: result.body,
            subject: result.subject
          } 
        });
        alert("Attack payload sent to mobile device!");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(`Sender: ${result.sender}\nSubject: ${result.subject}\n\n${result.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-2.5 text-red-500 mb-2.5">
            <Crosshair className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-[0.3em]">Offensive AI Engine</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-none uppercase">
            Red Team <span className="text-muted-foreground/30">Generator</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-lg font-medium leading-relaxed">
            Generate sophisticated, context-aware phishing payloads to test your organization's resilience. Ensure your employees are prepared for AI-driven social engineering attacks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Configuration Panel */}
        <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target className="w-32 h-32" />
          </div>
          <form onSubmit={handleGenerate} className="space-y-8 relative z-10">
            <div>
              <label className="block text-sm font-bold uppercase text-muted-foreground tracking-widest mb-3">Target Profile</label>
              <select
                value={target}
                onChange={handleTargetChange}
                className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none transition-all appearance-none cursor-pointer font-semibold shadow-inner"
              >
                {Object.keys(RED_TEAM_TEMPLATES).map(t => (
                  <option key={t} value={t}>{t} Department</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-muted-foreground tracking-widest mb-3">Attack Vector</label>
              <select
                value={vector}
                onChange={e => setVector(e.target.value)}
                className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none transition-all appearance-none cursor-pointer font-semibold shadow-inner"
              >
                {getVectorsForTarget().map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-border">
              <button
                type="submit"
                disabled={loading || isStreaming}
                className="w-full py-5 px-6 bg-red-500 hover:bg-red-600 disabled:bg-muted disabled:text-muted-foreground rounded-2xl font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-3 group/btn"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <Cpu className="w-5 h-5" />
                    Generate Payload
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Output Panel */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" /> Output Payload
            </h3>
            {result && (
              <div className="flex gap-4">
                <button
                  onClick={handleAnalyze}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Analyze
                </button>
                <button
                  onClick={handleSendToMobile}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  Send to Mobile
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-background border border-border rounded-2xl p-6 shadow-inner relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-red-500/50" />
                <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Generating LLM Payload...</p>
              </div>
            ) : result ? (
              <div className="space-y-5 animate-fade-in text-foreground">
                <div className="flex items-start gap-4 pb-5 border-b border-border">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Spoofed Sender</p>
                    <p className="font-semibold">{result.sender}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Subject Header</p>
                  <p className="font-bold text-lg">{result.subject}</p>
                </div>
                
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Message Body</p>
                  <p className="leading-relaxed font-medium">
                    {streamedBody}
                    {isStreaming && <span className="inline-block w-2 h-4 bg-red-500 ml-1 animate-pulse" />}
                  </p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/20">
                <Crosshair className="w-16 h-16 mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">Awaiting Generation</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
