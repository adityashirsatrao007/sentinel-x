import { NavLink, useNavigate } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, Activity, LogOut, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('sentinelx_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sentinelx_token');
    localStorage.removeItem('sentinelx_user');
    navigate('/login');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-muted hover:bg-card hover:text-foreground'
    }`;

  return (
    <aside className="w-64 bg-[#0f0f12] border-r border-border flex flex-col h-screen p-4">
      <div className="flex items-center gap-3 px-4 py-4 mb-8">
        <ShieldAlert className="text-primary w-8 h-8" />
        <h1 className="text-xl font-bold tracking-wide">Sentinel<span className="text-primary">X</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        <NavLink to="/dashboard" className={navClass}>
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>
        <NavLink to="/analyze" className={navClass}>
          <Activity className="w-5 h-5" />
          Threat Analysis
        </NavLink>
        
        {user?.role === 'soc' && (
          <NavLink to="/organization" className={navClass}>
            <Users className="w-5 h-5" />
            Organization
          </NavLink>
        )}
      </nav>

      {user && (
        <div className="mb-4 px-4 py-3 bg-card rounded-lg border border-border">
          <p className="text-sm font-medium text-foreground">{user.name}</p>
          <p className="text-xs text-muted mt-0.5 capitalize">{user.role} Account</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors w-full"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </aside>
  );
}
