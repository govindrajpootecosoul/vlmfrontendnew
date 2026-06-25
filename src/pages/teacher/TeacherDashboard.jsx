import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherAPI } from '../../services/api';
import { LoadingState, StatusBadge } from '../../components/common';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('offline');

  useEffect(() => {
    Promise.all([teacherAPI.getDashboard(), teacherAPI.getApplicationStatus()])
      .then(([dash, app]) => {
        setData(dash.data.data);
        const appStatus = app.data.data?.status;
        if (appStatus && !['approved'].includes(appStatus)) {
          navigate('/teacher/application-status');
        }
        setStatus(dash.data.data?.availabilityStatus || 'offline');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const toggleStatus = async (newStatus) => {
    await teacherAPI.updateAvailability({ availabilityStatus: newStatus });
    setStatus(newStatus);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="page">
      <div className="dashboard-header flex-between">
        <div>
          <p className="dashboard-greeting">Good day!</p>
          <h1 className="dashboard-name">Teacher Dashboard</h1>
        </div>
        <div className="toggle-group" style={{ width: 'auto' }}>
          {['online', 'busy', 'offline'].map((s) => (
            <button key={s} className={`toggle-btn ${status === s ? 'active' : ''}`} onClick={() => toggleStatus(s)} style={{ textTransform: 'capitalize', fontSize: 11 }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card card-gradient mb-2">
        <div className="flex-between">
          <div>
            <div className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Today's Earnings</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>₹{data?.todayEarnings?.toFixed(0) || 0}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Points</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{data?.totalPoints || 0}</div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card"><div className="stat-value">₹{data?.walletBalance?.toFixed(0) || 0}</div><div className="stat-label">Wallet</div></div>
        <div className="card stat-card"><div className="stat-value">{data?.totalSessions || 0}</div><div className="stat-label">Sessions</div></div>
        <div className="card stat-card"><div className="stat-value">⭐ {data?.rating?.toFixed(1) || '0.0'}</div><div className="stat-label">Rating</div></div>
        <div className="card stat-card"><div className="stat-value" style={{ color: 'var(--danger)' }}>{data?.missedRequests || 0}</div><div className="stat-label">Missed</div></div>
      </div>

      <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Quick Actions</h3>
      <div className="quick-actions">
        {[
          { icon: '📥', label: 'Requests', path: '/teacher/requests' },
          { icon: '📅', label: 'Schedule', path: '/teacher/availability' },
          { icon: '🎥', label: 'Live Class', path: '/teacher/live-class' },
          { icon: '📹', label: 'Short Video', path: '/teacher/upload-video' },
          { icon: '💰', label: 'Withdraw', path: '/teacher/wallet' },
          { icon: '🔗', label: 'Refer', path: '/teacher/referral' },
        ].map((a) => (
          <div key={a.label} className="action-btn" onClick={() => navigate(a.path)}>
            <span className="action-icon">{a.icon}</span>
            <span className="action-label">{a.label}</span>
          </div>
        ))}
      </div>

      <div className="card mt-2">
        <div className="flex-between mb-1"><span style={{ fontWeight: 600 }}>Weekly Live Target</span><span className="text-sm">{data?.weeklyLiveCompleted || 0}/{data?.weeklyLiveTarget || 2}</span></div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(100, ((data?.weeklyLiveCompleted || 0) / (data?.weeklyLiveTarget || 2)) * 100)}%` }} /></div>
      </div>

      <div className="card mt-2">
        <div className="flex-between"><span style={{ fontWeight: 600 }}>Performance Score</span><span style={{ fontWeight: 800, color: 'var(--primary)' }}>{data?.performanceScore || 0}%</span></div>
        <div className="flex-between mt-1 text-sm text-muted">
          <span>Response: {data?.responseSpeed || 0}s avg</span>
        </div>
      </div>
    </div>
  );
}
