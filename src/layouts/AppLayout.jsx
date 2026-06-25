import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  sessions: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  wallet: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>,
  profile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  more: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  learn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  child: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
};

const navConfigs = {
  teacher: [
    { to: '/teacher/dashboard', icon: icons.home, label: 'Home' },
    { to: '/teacher/sessions', icon: icons.sessions, label: 'Sessions' },
    { to: '/teacher/wallet', icon: icons.wallet, label: 'Wallet' },
    { to: '/teacher/profile', icon: icons.profile, label: 'Profile' },
    { to: '/teacher/more', icon: icons.more, label: 'Settings' },
  ],
  student: [
    { to: '/student/dashboard', icon: icons.home, label: 'Home' },
    { to: '/student/ask-doubt', icon: icons.sessions, label: 'Doubt' },
    { to: '/student/mcq', icon: icons.learn, label: 'MCQ' },
    { to: '/student/wallet', icon: icons.wallet, label: 'Rewards' },
    { to: '/student/settings', icon: icons.profile, label: 'Settings' },
  ],
  parent: [
    { to: '/parent/dashboard', icon: icons.home, label: 'Home' },
    { to: '/parent/children', icon: icons.child, label: 'Children' },
    { to: '/parent/reports', icon: icons.learn, label: 'Reports' },
    { to: '/parent/controls', icon: icons.sessions, label: 'Controls' },
    { to: '/parent/settings', icon: icons.profile, label: 'Settings' },
  ],
};

export const BottomNav = ({ role }) => {
  const items = navConfigs[role] || [];
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export const AppLayout = ({ role, children }) => (
  <div className="app-container">
    {children}
    <BottomNav role={role} />
  </div>
);

export const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="state-screen"><div className="spinner" /></div>;
  if (!user) { navigate('/login'); return null; }
  if (role && user.activeRole !== role) { navigate(`/${user.activeRole}/dashboard`); return null; }
  if (user.status === 'blocked') return <div className="state-screen"><div className="state-icon">🚫</div><h3>Account Blocked</h3></div>;

  return <AppLayout role={user.activeRole}>{children}</AppLayout>;
};
