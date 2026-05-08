import { useEffect, useState } from 'react';
import { Users, UserPlus, Loader2, Shield } from 'lucide-react';
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
      const res = await api.get('/auth/users');
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

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organization Management</h1>
          <p className="text-muted mt-1">Manage users and access control within your SOC.</p>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Invite User
        </button>
      </div>

      {showInvite && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-foreground mb-4">Invite New User</h3>
          <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-[#0f0f12] border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 bg-[#0f0f12] border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Temp Password</label>
              <input required type="text" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 bg-[#0f0f12] border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 bg-[#0f0f12] border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none">
                <option value="user">Regular User</option>
                <option value="operator">Operator</option>
              </select>
            </div>
            <button type="submit" disabled={inviteLoading} className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex justify-center h-[42px] items-center">
              {inviteLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Invite'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#0f0f12] border-b border-border">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-muted">User</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-[#0f0f12]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20 capitalize">
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} border`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted">
                    No users found in this organization.
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
