import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MaintenanceState, ForceUpdateState, NoInternetState } from '../../components/common';

export default function SplashScreen() {
  const navigate = useNavigate();
  const { user, loading, refreshUser } = useAuth();
  const [status, setStatus] = useState('loading');
  const [appStatus, setAppStatus] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!navigator.onLine) { setStatus('offline'); return; }
      try {
        const { data } = await authAPI.checkStatus({ params: { version: '1.0.0' } });
        setAppStatus(data);
        if (data.maintenance) { setStatus('maintenance'); return; }
        if (data.forceUpdate || data.needsUpdate) { setStatus('update'); return; }
        await refreshUser();
        setStatus('ready');
      } catch {
        setStatus('offline');
      }
    };
    init();
  }, [refreshUser]);

  useEffect(() => {
    if (status !== 'ready' || loading) return;
    const timer = setTimeout(() => {
      if (user?.activeRole) {
        navigate(`/${user.activeRole}/dashboard`, { replace: true });
      } else if (localStorage.getItem('vlm_role')) {
        navigate('/login', { replace: true });
      } else {
        navigate('/role-selection', { replace: true });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [status, loading, user, navigate]);

  if (status === 'offline') return <NoInternetState onRetry={() => window.location.reload()} />;
  if (status === 'maintenance') return <MaintenanceState />;
  if (status === 'update') return <ForceUpdateState />;

  return (
    <div className="splash-screen">
      <div className="splash-logo">VLM</div>
      <div style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>Academy</div>
      <p className="splash-tagline">Learn. Grow. Succeed.</p>
      <div className="spinner" style={{ marginTop: 48, borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
    </div>
  );
}
