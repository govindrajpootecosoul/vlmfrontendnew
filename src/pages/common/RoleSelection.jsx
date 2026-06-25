import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roles = [
  { id: 'student', title: 'Student', desc: 'Ask doubts, learn live, earn rewards', icon: '🎓', cls: 'student' },
  { id: 'teacher', title: 'Teacher', desc: 'Teach, earn points, grow your career', icon: '👨‍🏫', cls: 'teacher' },
  { id: 'parent', title: 'Parent', desc: 'Monitor child progress & activity', icon: '👨‍👩‍👧', cls: 'parent' },
];

export default function RoleSelection() {
  const navigate = useNavigate();
  const { selectRole } = useAuth();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (!selected) return;
    selectRole(selected);
    navigate('/login');
  };

  return (
    <div className="page-no-nav" style={{ paddingTop: 48 }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary-dark)' }}>Welcome to VLM Academy</h1>
        <p className="text-muted mt-1">Select your role to continue</p>
      </div>

      <div className="role-grid">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`role-card ${selected === role.id ? 'selected' : ''}`}
            onClick={() => setSelected(role.id)}
          >
            <div className={`role-icon ${role.cls}`}>{role.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{role.title}</div>
              <div className="text-sm text-muted">{role.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary mt-3" disabled={!selected} onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
