import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function OtpScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { mobile, email, role, devOtp } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (!mobile && !email) navigate('/login');
    if (!role) navigate('/role-selection', { replace: true });
  }, [mobile, email, role, navigate]);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
    if (newOtp.every((d) => d) && newOtp.join('').length === 6) verify(newOtp.join(''));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
  };

  const verify = async (code) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await authAPI.verifyOtp({ mobile, email, otp: code, role });
      login(data.token, data.user, data.profile);
      if (role === 'teacher' && (!data.profile || data.profile.applicationStatus === 'draft')) {
        navigate('/teacher/onboarding');
      } else if (role === 'student' && (!data.profile || !data.profile.onboardingCompleted)) {
        navigate('/student/profile-setup');
      } else if (role === 'parent' && !data.profile) {
        navigate('/parent/profile-setup');
      } else {
        navigate(`/${role}/dashboard`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    await authAPI.sendOtp({ mobile, email });
    setTimer(60);
    setCanResend(false);
  };

  if (!role) return null;

  return (
    <div className="page-no-nav" style={{ paddingTop: 48 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontWeight: 800 }}>Verify OTP</h2>
        <p className="text-muted mt-1">Sent to {mobile || email}</p>
        {devOtp && <p className="text-sm" style={{ color: 'var(--accent)', marginTop: 8 }}>Dev OTP: {devOtp}</p>}
      </div>

      <div className="otp-container mb-2">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            className="otp-input"
            type="tel"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>

      {error && <p className="form-error text-center">{error}</p>}

      <button className="btn btn-primary mt-2" onClick={() => verify(otp.join(''))} disabled={loading || otp.some((d) => !d)}>
        {loading ? 'Verifying...' : 'Verify'}
      </button>

      <p className="text-center text-sm text-muted mt-2">
        {canResend ? (
          <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={resend}>Resend OTP</span>
        ) : (
          `Resend in ${timer}s`
        )}
      </p>
    </div>
  );
}
