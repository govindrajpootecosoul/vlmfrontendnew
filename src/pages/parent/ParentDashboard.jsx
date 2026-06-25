import { useEffect, useState } from 'react';
import { parentAPI } from '../../services/api';
import { LoadingState, StatusBadge } from '../../components/common';

export default function ParentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parentAPI.getDashboard().then(({ data: res }) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="page">
      <div className="dashboard-header">
        <p className="dashboard-greeting">Parent Dashboard</p>
        <h1 className="dashboard-name">{data?.parent?.fullName || 'Parent'}</h1>
      </div>

      {data?.children?.length === 0 ? (
        <div className="card text-center">
          <div style={{ fontSize: 48 }}>👨‍👩‍👧</div>
          <h3 style={{ fontWeight: 700, marginTop: 12 }}>No Children Linked</h3>
          <p className="text-muted">Link your child's account to monitor their progress</p>
        </div>
      ) : (
        data.children.map(({ student, stats, recentSessions }) => (
          <div key={student._id} className="card mb-2">
            <div className="flex-between mb-1">
              <h3 style={{ fontWeight: 700 }}>{student.fullName}</h3>
              <span className="badge badge-info">Class {student.class}</span>
            </div>
            <div className="stats-grid" style={{ marginBottom: 8 }}>
              <div><div className="stat-value" style={{ fontSize: 18 }}>{stats.totalSessions}</div><div className="stat-label">Sessions</div></div>
              <div><div className="stat-value" style={{ fontSize: 18 }}>{stats.resolvedDoubts}</div><div className="stat-label">Resolved</div></div>
              <div><div className="stat-value" style={{ fontSize: 18 }}>{stats.totalPoints}</div><div className="stat-label">Points</div></div>
              <div><div className="stat-value" style={{ fontSize: 18 }}>🔥{stats.streak}</div><div className="stat-label">Streak</div></div>
            </div>
            <div className="flex-between text-sm">
              <span>Plan: <StatusBadge status={stats.subscription?.status || 'free'} /></span>
              <span className="text-muted">{stats.pendingDoubts} pending doubts</span>
            </div>
            {recentSessions?.slice(0, 3).map((s) => (
              <div key={s._id} className="list-item">
                <div className="list-content">
                  <div className="list-title">{s.subject} - {s.type}</div>
                  <div className="list-subtitle">{new Date(s.createdAt).toLocaleDateString()}</div>
                </div>
                <StatusBadge status={s.isResolved ? 'completed' : 'pending'} />
              </div>
            ))}
          </div>
        ))
      )}

      <div className="card mt-2">
        <h4 style={{ fontWeight: 600, marginBottom: 8 }}>AI Insights</h4>
        <p className="text-sm">📊 Monitor your child's study activity and performance</p>
        <p className="text-sm mt-1">⚠️ Get alerts for low activity or weak subjects</p>
      </div>
    </div>
  );
}
