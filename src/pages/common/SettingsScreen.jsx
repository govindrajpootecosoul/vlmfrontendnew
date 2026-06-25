import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { TopBar } from '../../components/common';

const roleLabels = { student: 'Student', teacher: 'Teacher', parent: 'Parent' };

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { user, logout, selectRole, refreshUser } = useAuth();

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    await logout();
    navigate('/role-selection', { replace: true });
  };

  const handleSwitchRole = async (role) => {
    try {
      await authAPI.switchRole(role);
      selectRole(role);
      await refreshUser();
      navigate(`/${role}/dashboard`, { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Could not switch role');
    }
  };

  const handleChangeRole = async () => {
    await logout();
    navigate('/role-selection', { replace: true });
  };

  return (
    <div className="page">
      <TopBar title="Settings" />

      <div className="card mb-2">
        <div className="list-item" style={{ border: 'none', padding: 0 }}>
          <div className="list-avatar">👤</div>
          <div className="list-content">
            <div className="list-title">{user?.mobile || user?.email || 'User'}</div>
            <div className="list-subtitle">
              Logged in as <strong>{roleLabels[user?.activeRole] || user?.activeRole}</strong>
            </div>
          </div>
        </div>
      </div>

      {user?.roles?.length > 1 && (
        <div className="card mb-2">
          <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Switch Role</h4>
          <div className="chip-group">
            {user.roles.map((role) => (
              <button
                key={role}
                type="button"
                className={`chip ${user.activeRole === role ? 'selected' : ''}`}
                onClick={() => handleSwitchRole(role)}
              >
                {roleLabels[role] || role}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card mb-2">
        <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Account</h4>
        {[
          { label: 'Notifications', action: () => navigate(`/${user?.activeRole}/notifications`) },
          { label: 'Help & Support', action: () => navigate(`/${user?.activeRole}/support`) },
          { label: 'Change Role', action: handleChangeRole },
        ].map((item) => (
          <div key={item.label} className="list-item" onClick={item.action} style={{ cursor: 'pointer' }}>
            <span style={{ fontWeight: 500 }}>{item.label}</span>
            <span style={{ color: 'var(--text-muted)' }}>›</span>
          </div>
        ))}
      </div>

      <button className="btn btn-danger mt-2" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
