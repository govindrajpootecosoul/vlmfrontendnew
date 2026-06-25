import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import { TopBar, ChipSelect } from '../../components/common';

const SUBJECTS = ['Math', 'Science', 'English', 'Hindi', 'Social Science', 'Physics', 'Chemistry', 'Biology'];

export default function AskDoubt() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: '', doubtText: '', sessionType: 'chat', topic: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.subject || !form.doubtText) return alert('Subject and doubt required');
    setLoading(true);
    try {
      const { data } = await studentAPI.submitDoubt(form);
      if (form.sessionType === 'ai') {
        navigate('/student/ai-tutor', { state: { doubt: form.doubtText, subject: form.subject } });
      } else {
        navigate('/student/searching', { state: { session: data.data.session, doubtRequest: data.data.doubtRequest } });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <TopBar title="Ask Doubt" onBack={() => navigate(-1)} />
      <div className="form-group">
        <label className="form-label">Subject *</label>
        <ChipSelect options={SUBJECTS} selected={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
      </div>
      <div className="form-group">
        <label className="form-label">Topic / Chapter</label>
        <input className="form-input" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g. Quadratic Equations" />
      </div>
      <div className="form-group">
        <label className="form-label">Your Doubt *</label>
        <textarea className="form-input" rows={4} value={form.doubtText} onChange={(e) => setForm({ ...form, doubtText: e.target.value })} placeholder="Type your question..." />
      </div>
      <div className="form-group">
        <label className="form-label">Upload Image (optional)</label>
        <input type="file" accept="image/*" />
      </div>
      <div className="form-group">
        <label className="form-label">Session Type</label>
        <div className="grid-2">
          {[
            { id: 'ai', label: '🤖 AI Tutor', desc: 'Instant AI help' },
            { id: 'chat', label: '💬 Chat', desc: 'Text with teacher' },
            { id: 'audio', label: '📞 Audio', desc: 'Voice call' },
            { id: 'video', label: '📹 Video', desc: 'Video call' },
          ].map((t) => (
            <div key={t.id} className={`card ${form.sessionType === t.id ? 'selected' : ''}`} style={{ cursor: 'pointer', border: form.sessionType === t.id ? '2px solid var(--primary)' : undefined }} onClick={() => setForm({ ...form, sessionType: t.id })}>
              <div style={{ fontWeight: 600 }}>{t.label}</div>
              <div className="text-sm text-muted">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Doubt'}
      </button>
    </div>
  );
}
