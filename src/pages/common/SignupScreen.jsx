import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useRequireRole } from '../../hooks/useRequireRole';

export default function SignupScreen() {
  const navigate = useNavigate();
  const role = useRequireRole();

  const [form, setForm] = useState({ email: '', password: '', mobile: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await authAPI.register({ ...form, role });
      if (data.needsMobileVerification) {
        const otpRes = await authAPI.sendOtp({ mobile: form.mobile });
        navigate('/otp', { state: { mobile: form.mobile, role, devOtp: otpRes.data.otp } });
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  return (
    <div className="page-no-nav">
      <div style={{ textAlign: 'center', marginBottom: 24, paddingTop: 24 }}>
        <h2 style={{ fontWeight: 800 }}>Create Account</h2>
        <p className="text-muted">Join as {role.charAt(0).toUpperCase() + role.slice(1)}</p>
        <button className="btn btn-ghost btn-sm mt-1" onClick={() => navigate('/role-selection')}>Change Role</button>
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Mobile</label>
        <input className="form-input" type="tel" maxLength={10} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })} />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button className="btn btn-primary" onClick={handleSignup} disabled={loading}>
        {loading ? 'Creating...' : 'Sign Up'}
      </button>

      <p className="text-center text-sm text-muted mt-2">
        Already have account? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>Login</span>
      </p>
    </div>
  );
}
