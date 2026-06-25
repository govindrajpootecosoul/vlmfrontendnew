import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parentAPI } from '../../services/api';
import { TopBar } from '../../components/common';

export default function ParentProfileSetup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', city: '', state: '', preferredLanguage: 'Hindi' });
  const [childMobile, setChildMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await parentAPI.updateProfile(form);
      if (childMobile) await parentAPI.linkChild({ studentMobile: childMobile });
      navigate('/parent/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-no-nav">
      <TopBar title="Parent Setup" />
      <div style={{ padding: 16 }}>
        <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">State</label><input className="form-input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
        </div>
        <div className="form-group"><label className="form-label">Link Child (Mobile)</label><input className="form-input" maxLength={10} value={childMobile} onChange={(e) => setChildMobile(e.target.value)} placeholder="Child's registered mobile" /></div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Complete Setup'}</button>
      </div>
    </div>
  );
}
