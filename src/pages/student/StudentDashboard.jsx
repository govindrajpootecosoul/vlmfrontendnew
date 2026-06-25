import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import { LoadingState } from '../../components/common';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getDashboard().then(({ data: res }) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  const student = data?.student;

  return (
    <div className="page">
      <div className="dashboard-header">
        <p className="dashboard-greeting">Welcome back!</p>
        <h1 className="dashboard-name">{student?.nickname || student?.fullName || 'Student'}</h1>
        <p className="text-sm text-muted">Class {student?.class} • {student?.board}</p>
      </div>

      <div className="card card-gradient mb-2" onClick={() => navigate('/student/wallet')} style={{ cursor: 'pointer' }}>
        <div className="flex-between">
          <div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>Reward Points</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{student?.totalPoints || 0}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, opacity: 0.9 }}>Streak 🔥</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{student?.streak || 0} days</div>
          </div>
        </div>
      </div>

      <button className="btn btn-secondary mb-2" style={{ fontSize: 18, padding: 16 }} onClick={() => navigate('/student/ask-doubt')}>
        ❓ Ask a Doubt
      </button>

      <div className="quick-actions">
        {[
          { icon: '🤖', label: 'AI Tutor', path: '/student/ai-tutor' },
          { icon: '👨‍🏫', label: 'Live Teacher', path: '/student/ask-doubt' },
          { icon: '📝', label: 'Daily MCQ', path: '/student/mcq' },
          { icon: '🏆', label: 'Leaderboard', path: '/student/leaderboard' },
          { icon: '🎥', label: 'Live Classes', path: '/student/live-classes' },
          { icon: '📹', label: 'Short Videos', path: '/student/videos' },
          { icon: '🎡', label: 'Spin', path: '/student/spin' },
          { icon: '🔗', label: 'Refer & Earn', path: '/student/referral' },
          { icon: '📚', label: 'History', path: '/student/history' },
        ].map((a) => (
          <div key={a.label} className="action-btn" onClick={() => navigate(a.path)}>
            <span className="action-icon">{a.icon}</span>
            <span className="action-label">{a.label}</span>
          </div>
        ))}
      </div>

      {data?.recentSessions?.length > 0 && (
        <div className="mt-2">
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Recent Sessions</h3>
          {data.recentSessions.map((s) => (
            <div key={s._id} className="card mb-1" onClick={() => navigate(`/student/session/${s._id}`)}>
              <div className="flex-between">
                <span style={{ fontWeight: 600 }}>{s.subject} - {s.type}</span>
                <span className="badge badge-info">{s.status}</span>
              </div>
              <p className="text-sm text-muted">{new Date(s.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card mt-2">
        <div className="flex-between"><span style={{ fontWeight: 600 }}>Credits</span></div>
        <div className="stats-grid mt-1" style={{ marginBottom: 0 }}>
          <div><div className="stat-value" style={{ fontSize: 16 }}>{student?.wallet?.aiCredits || 0}</div><div className="stat-label">AI</div></div>
          <div><div className="stat-value" style={{ fontSize: 16 }}>{student?.wallet?.humanChatCredits || 0}</div><div className="stat-label">Chat</div></div>
          <div><div className="stat-value" style={{ fontSize: 16 }}>{student?.wallet?.audioMinutes || 0}</div><div className="stat-label">Audio min</div></div>
          <div><div className="stat-value" style={{ fontSize: 16 }}>{student?.wallet?.videoMinutes || 0}</div><div className="stat-label">Video min</div></div>
        </div>
      </div>
    </div>
  );
}
