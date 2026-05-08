import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, LayoutDashboard, Activity, LogOut, Users, 
  Bell, Zap, Sun, Moon 
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('sentinelx_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Theme sync
    const savedTheme = localStorage.getItem('sentinelx_theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sentinelx_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sentinelx_theme', 'light');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sentinelx_token');
    localStorage.removeItem('sentinelx_user');
    navigate('/login');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-5 py-3 rounded-xl transition-all group border ${
      isActive
        ? 'bg-primary/10 text-primary font-bold uppercase tracking-widest text-[10px] border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground font-bold uppercase tracking-widest text-[10px] border-transparent'
    }`;

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-violet-500 to-transparent opacity-30" />
      
      <div className="flex items-center gap-3 px-2 py-6 mb-12 group cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/40 transition-all" />
          <ShieldAlert className="text-primary w-8 h-8 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight leading-none uppercase">
            <span className="text-foreground">Sentinel</span>
            <span className="text-primary">X</span>
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground mt-1">Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <NavLink to="/dashboard" className={navClass}>
          <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Dashboard
        </NavLink>
        <NavLink to="/analyze" className={navClass}>
          <Activity className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Lab Analysis
        </NavLink>
        <NavLink to="/alerts" className={navClass}>
          <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Alerts
        </NavLink>
        <NavLink to="/playbooks" className={navClass}>
          <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Playbooks
        </NavLink>
        
        {(user?.role === 'soc' || user?.role === 'sysadmin') && (
          <NavLink to="/organization" className={navClass}>
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Unit Directory
          </NavLink>
        )}
      </nav>

      <div className="mt-auto space-y-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-5 py-3 rounded-xl bg-muted border border-border text-foreground transition-all hover:bg-muted/80"
        >
          <div className="flex items-center gap-3">
             {isDark ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-500" />}
             <span className="text-[10px] font-bold uppercase tracking-widest">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isDark ? 'bg-primary' : 'bg-slate-300'}`}>
             <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>

        {user && (
          <div className="px-4 py-4 bg-muted/50 rounded-2xl border border-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase shadow-inner">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-foreground uppercase tracking-wider truncate">{user.name}</p>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all w-full font-bold uppercase tracking-widest text-[10px] border border-transparent hover:border-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
