import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vlm_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(() => localStorage.getItem('vlm_role') || null);

  const login = useCallback((token, userData, profileData) => {
    localStorage.setItem('vlm_token', token);
    localStorage.setItem('vlm_user', JSON.stringify(userData));
    if (userData.activeRole) {
      localStorage.setItem('vlm_role', userData.activeRole);
      setSelectedRole(userData.activeRole);
    }
    setUser(userData);
    setProfile(profileData);
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    localStorage.removeItem('vlm_token');
    localStorage.removeItem('vlm_user');
    localStorage.removeItem('vlm_role');
    setUser(null);
    setProfile(null);
    setSelectedRole(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('vlm_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
      setProfile(data.profile);
      localStorage.setItem('vlm_user', JSON.stringify(data.user));
    } catch {
      localStorage.removeItem('vlm_token');
      localStorage.removeItem('vlm_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const selectRole = (role) => {
    setSelectedRole(role);
    localStorage.setItem('vlm_role', role);
  };

  return (
    <AuthContext.Provider value={{
      user, profile, loading, selectedRole, login, logout, refreshUser, selectRole, setProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
