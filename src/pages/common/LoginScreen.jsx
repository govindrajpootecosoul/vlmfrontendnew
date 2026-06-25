import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useRequireRole } from '../../hooks/useRequireRole';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const role = useRequireRole();

  const [mode, setMode] = useState('mobile');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    setError('');
    if (mode === 'mobile' && mobile.length < 10) { setError('Enter valid 10-digit mobile'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.sendOtp({ mobile: mode === 'mobile' ? mobile : undefined, email: mode === 'email' ? email : undefined });
      navigate('/otp', { state: { mobile: mode === 'mobile' ? mobile : undefined, email: mode === 'email' ? email : undefined, role, devOtp: data.otp } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password, role });
      login(data.token, data.user, data.profile);
      routeAfterLogin(data.user, data.profile);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const routeAfterLogin = (user, profile) => {
    if (role === 'teacher' && (!profile || profile.applicationStatus === 'draft')) {
      navigate('/teacher/onboarding');
    } else if (role === 'student' && (!profile || !profile.onboardingCompleted)) {
      navigate('/student/profile-setup');
    } else if (role === 'parent' && !profile) {
      navigate('/parent/profile-setup');
    } else {
      navigate(`/${role}/dashboard`);
    }
  };

  if (!role) return null;

  return (
    <div className="page-no-nav">
      <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 24 }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)' }}>VLM Academy</div>
        <p className="text-muted mt-1">Login as {role ? role.charAt(0).toUpperCase() + role.slice(1) : '...'}</p>
        <button className="btn btn-ghost btn-sm mt-1" onClick={() => navigate('/role-selection')}>Change Role</button>
      </div>

      <div className="toggle-group mb-2">
        {['mobile', 'email'].map((m) => (
          <button key={m} className={`toggle-btn ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)}>
            {m === 'mobile' ? 'Mobile OTP' : 'Email'}
          </button>
        ))}
      </div>

      {mode === 'mobile' ? (
        <>
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input className="form-input" type="tel" placeholder="10-digit mobile" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} />
          </div>
          <button className="btn btn-primary" onClick={handleSendOtp} disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary mb-1" onClick={handleEmailLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button className="btn btn-ghost" onClick={handleSendOtp}>Login with OTP instead</button>
        </>
      )}

      {error && <p className="form-error text-center mt-2">{error}</p>}

      <p className="text-center text-sm text-muted mt-3">
        New user? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/signup')}>Create Account</span>
      </p>
    </div>
  );
}
