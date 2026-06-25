import { useState } from 'react';
import { studentAPI } from '../../services/api';
import { TopBar, ChipSelect } from '../../components/common';
import { useNavigate } from 'react-router-dom';

const SUBJECTS = ['Math', 'Science', 'English', 'Hindi', 'Social Science', 'Physics', 'Chemistry', 'Biology'];
const BOARDS = ['CBSE', 'State Board', 'ICSE'];
const CLASSES = ['6', '7', '8', '9', '10', '11', '12'];

export default function StudentProfileSetup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', nickname: '', class: '10', board: 'CBSE', medium: 'English',
    school: '', city: '', state: '', parentName: '', parentMobile: '',
    subjects: [], weakSubjects: [], preferredLanguage: 'Hindi', learningGoals: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.fullName) return alert('Name is required');
    setLoading(true);
    try {
      await studentAPI.updateProfile({ ...form, onboardingCompleted: true });
      navigate('/student/plans');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-no-nav">
      <TopBar title="Profile Setup" />
      <div style={{ padding: 16 }}>
        <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
        <div className="form-group"><label className="form-label">Nickname</label><input className="form-input" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} /></div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">Class</label>
            <select className="form-input form-select" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })}>
              {CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Board</label>
            <select className="form-input form-select" value={form.board} onChange={(e) => setForm({ ...form, board: e.target.value })}>
              {BOARDS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group"><label className="form-label">School</label><input className="form-input" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} /></div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">State</label><input className="form-input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
        </div>
        <div className="form-group"><label className="form-label">Subjects</label><ChipSelect options={SUBJECTS} selected={form.subjects} onChange={(v) => setForm({ ...form, subjects: v })} multiple /></div>
        <div className="form-group"><label className="form-label">Weak Subjects</label><ChipSelect options={SUBJECTS} selected={form.weakSubjects} onChange={(v) => setForm({ ...form, weakSubjects: v })} multiple /></div>
        <div className="form-group"><label className="form-label">Parent Mobile</label><input className="form-input" maxLength={10} value={form.parentMobile} onChange={(e) => setForm({ ...form, parentMobile: e.target.value })} /></div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Continue'}</button>
      </div>
    </div>
  );
}
