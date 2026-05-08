import { useEffect, useState } from 'react';
import { Users, UserPlus, Loader2, Shield, Mail, Calendar, CheckCircle2, UserCheck } from 'lucide-react';
import api from '../lib/api';

export default function Organization() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Invite state
  const [showInvite, setShowInvite] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      await api.post('/auth/invite', { name, email, password, role });
      setShowInvite(false);
      setName('');
      setEmail('');
      setPassword('');
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to invite user");
    } finally {
      setInviteLoading(false);
    }
  };

  const stats = [
    { label: 'Total Members', value: users.length, icon: Users, color: 'text-blue-500' },
    { label: 'Active Sessions', value: users.filter(u => u.is_active).length, icon: UserCheck, color: 'text-green-500' },
    { label: 'SOC Operators', value: users.filter(u => u.role !== 'user').length, icon: Shield, color: 'text-purple-500' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Organization</h1>
          <p className="text-white/40 mt-1">Manage personnel access and security roles for your SOC infrastructure.</p>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20"
        >
          <UserPlus className="w-4 h-4" />
          Invite Agent
        </button>
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#0f0f14] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className="w-20 h-20" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-2">{s.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{s.value}</span>
                <div className={`p-1 rounded-full ${s.color} bg-current/10`}>
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showInvite && (
        <div className="bg-[#0f0f14] border border-primary/20 rounded-2xl p-8 mb-10 animate-slide-up relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Provision New Access
          </h3>
          <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end relative z-10">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-white/40 tracking-widest">Full Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-white/40 tracking-widest">Secure Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-white/40 tracking-widest">Assignment Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                <option value="user">Field Agent</option>
                <option value="operator">SOC Operator</option>
                <option value="soc">Senior Analyst</option>
              </select>
            </div>
            <button type="submit" disabled={inviteLoading} className="w-full bg-primary hover:bg-blue-600 text-white font-black uppercase tracking-widest text-xs py-4 px-6 rounded-xl flex justify-center items-center shadow-xl shadow-primary/20 transition-all">
              {inviteLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Provisioning'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-[#0f0f14] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-white/20 text-xs font-black uppercase tracking-widest">Synchronizing Directory...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/3 border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Personnel</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Classification</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Deployment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-white/2 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 border border-white/5 flex items-center justify-center text-primary font-black text-lg group-hover:scale-110 transition-transform">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-primary transition-colors">{user.name}</p>
                        <div className="flex items-center gap-1.5 text-white/30 text-xs mt-0.5">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-sm">
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${user.is_active ? 'text-green-500' : 'text-red-500'}`}>
                        {user.is_active ? 'Active Duty' : 'Deactivated'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="opacity-10 mb-4">
                      <Users className="w-16 h-16 mx-auto" />
                    </div>
                    <p className="text-white/20 text-xs font-black uppercase tracking-widest">No Active Personnel Records Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
