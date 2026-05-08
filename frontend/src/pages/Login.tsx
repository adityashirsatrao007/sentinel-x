import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader2 } from 'lucide-react';
import api from '../lib/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'soc'
  const [organizationName, setOrganizationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('sentinelx_token', res.data.access_token);
        
        // Fetch user profile to store role
        const meRes = await api.get('/auth/me');
        localStorage.setItem('sentinelx_user', JSON.stringify(meRes.data));
        
        navigate('/dashboard');
      } else {
        const payload: any = { name, email, password, role };
        if (role === 'soc') {
          payload.organization_name = organizationName;
        }
        await api.post('/auth/register', payload);
        
        // Auto login after register
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('sentinelx_token', res.data.access_token);
        
        const meRes = await api.get('/auth/me');
        localStorage.setItem('sentinelx_user', JSON.stringify(meRes.data));
        
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          Sentinel<span className="text-primary">X</span>
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          Sign in to access the threat intelligence dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border ${role === 'user' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:border-muted'}`}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('soc')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border ${role === 'soc' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:border-muted'}`}
                  >
                    SOC Admin
                  </button>
                </div>
                {role === 'soc' && (
                  <div>
                    <label className="block text-sm font-medium text-muted">Organization Name</label>
                    <div className="mt-1">
                      <input
                        type="text"
                        required
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-border rounded-lg bg-[#0f0f12] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-muted">Full Name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-border rounded-lg bg-[#0f0f12] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-muted">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-lg bg-[#0f0f12] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-lg bg-[#0f0f12] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign in' : 'Create account')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:text-blue-400 transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
