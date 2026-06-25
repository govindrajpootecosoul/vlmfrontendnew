import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherAPI } from '../../services/api';
import { TopBar, LoadingState, StepIndicator, ChipSelect } from '../../components/common';

const SUBJECTS = ['Math', 'Science', 'English', 'Hindi', 'Social Science', 'Physics', 'Chemistry', 'Biology'];
const CLASSES = ['1-5', '6-8', '9-10', '11-12'];
const BOARDS = ['CBSE', 'State Board', 'ICSE'];
const LANGUAGES = ['Hindi', 'English', 'Hinglish'];
const STATES = ['Uttar Pradesh', 'Delhi', 'Maharashtra', 'Rajasthan', 'Bihar', 'Madhya Pradesh'];

const steps = [
  { title: 'Welcome', component: 'welcome' },
  { title: 'Basic Info', component: 'basic' },
  { title: 'Qualification', component: 'qualification' },
  { title: 'Experience', component: 'experience' },
  { title: 'Subjects', component: 'subjects' },
  { title: 'Documents', component: 'documents' },
  { title: 'Demo Video', component: 'demo' },
  { title: 'Review', component: 'review' },
];

export default function TeacherOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', gender: '', dateOfBirth: '', address: '', state: '', city: '', pincode: '', email: '',
    subjects: [], classes: [], boards: [], languages: [],
    qualification: { highestQualification: '', instituteName: '', passingYear: '', hasBEd: false, teachingCertification: '' },
    experience: { totalYears: 0, isFresher: false, teachingModes: [], experienceTypes: [], summary: '' },
    documents: {},
    demoVideo: {},
  });

  useEffect(() => {
    teacherAPI.getProfile().then(({ data }) => {
      if (data.data) {
        setForm((f) => ({ ...f, ...data.data }));
        setStep(data.data.onboardingStep || 0);
      }
    }).catch(() => {});
  }, []);

  const saveStep = async (nextStep) => {
    setLoading(true);
    try {
      await teacherAPI.updateOnboarding({ ...form, step: nextStep });
      setStep(nextStep);
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, field, docKey) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await teacherAPI.uploadFile(fd);
    if (docKey) {
      setForm((f) => ({ ...f, documents: { ...f.documents, [docKey]: data.url } }));
    } else if (field === 'demoVideo') {
      setForm((f) => ({ ...f, demoVideo: { url: data.url, duration: 120 } }));
    } else {
      setForm((f) => ({ ...f, [field]: data.url }));
    }
  };

  const submit = async () => {
    setLoading(true);
    try {
      await teacherAPI.submitApplication();
      navigate('/teacher/application-status');
    } catch (err) {
      alert(err.response?.data?.message || 'Submit failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 0) {
    return (
      <div className="page-no-nav" style={{ paddingTop: 48 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64 }}>👨‍🏫</div>
          <h2 style={{ fontWeight: 800, marginTop: 16 }}>Welcome, Teacher!</h2>
          <p className="text-muted mt-1" style={{ lineHeight: 1.6 }}>
            Complete registration, upload documents, submit demo video, attend interview, and get approved to start teaching.
          </p>
        </div>
        <div className="card mt-3">
          {['Profile Details', 'Document Upload', 'Demo Video', 'Interview', 'Approval'].map((s, i) => (
            <div key={s} className="list-item">
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{i + 1}</div>
              <span style={{ fontWeight: 600 }}>{s}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-primary mt-3" onClick={() => setStep(1)}>Start Registration</button>
      </div>
    );
  }

  return (
    <div className="page-no-nav">
      <TopBar title={steps[step]?.title || 'Onboarding'} onBack={() => step > 1 ? setStep(step - 1) : setStep(0)} />
      <div style={{ padding: 16 }}>
        <StepIndicator total={steps.length - 1} current={step - 1} />

        {step === 1 && (
          <>
            <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Gender</label>
              <select className="form-input form-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Date of Birth</label><input className="form-input" type="date" value={form.dateOfBirth?.split('T')[0] || ''} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">State</label>
                <select className="form-input form-select" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                  <option value="">Select</option>{STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            </div>
            <div className="form-group"><label className="form-label">Pincode</label><input className="form-input" maxLength={6} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Profile Photo *</label><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profilePhoto')} />{form.profilePhoto && <span className="text-sm text-muted">✓ Uploaded</span>}</div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-group"><label className="form-label">Highest Qualification</label><input className="form-input" value={form.qualification.highestQualification} onChange={(e) => setForm({ ...form, qualification: { ...form.qualification, highestQualification: e.target.value } })} /></div>
            <div className="form-group"><label className="form-label">Institute Name</label><input className="form-input" value={form.qualification.instituteName} onChange={(e) => setForm({ ...form, qualification: { ...form.qualification, instituteName: e.target.value } })} /></div>
            <div className="form-group"><label className="form-label">Passing Year</label><input className="form-input" type="number" value={form.qualification.passingYear} onChange={(e) => setForm({ ...form, qualification: { ...form.qualification, passingYear: e.target.value } })} /></div>
            <div className="form-group"><label><input type="checkbox" checked={form.qualification.hasBEd} onChange={(e) => setForm({ ...form, qualification: { ...form.qualification, hasBEd: e.target.checked } })} /> B.Ed</label></div>
            <div className="form-group"><label className="form-label">Certificate Upload</label><input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, null, 'qualificationCert')} /></div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="form-group"><label className="form-label">Total Experience (years)</label><input className="form-input" type="number" value={form.experience.totalYears} onChange={(e) => setForm({ ...form, experience: { ...form.experience, totalYears: e.target.value } })} /></div>
            <div className="form-group"><label><input type="checkbox" checked={form.experience.isFresher} onChange={(e) => setForm({ ...form, experience: { ...form.experience, isFresher: e.target.checked } })} /> I am a Fresher</label></div>
            <div className="form-group"><label className="form-label">Teaching Mode</label>
              <ChipSelect options={['Online', 'Offline', 'Both']} selected={form.experience.teachingModes} onChange={(v) => setForm({ ...form, experience: { ...form.experience, teachingModes: v } })} multiple />
            </div>
            <div className="form-group"><label className="form-label">Experience Type</label>
              <ChipSelect options={['School', 'Institute', 'Tuition', 'Online']} selected={form.experience.experienceTypes} onChange={(v) => setForm({ ...form, experience: { ...form.experience, experienceTypes: v } })} multiple />
            </div>
            <div className="form-group"><label className="form-label">Resume/CV</label><input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, null, 'resume')} /></div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="form-group"><label className="form-label">Subjects *</label><ChipSelect options={SUBJECTS} selected={form.subjects} onChange={(v) => setForm({ ...form, subjects: v })} multiple /></div>
            <div className="form-group"><label className="form-label">Classes *</label><ChipSelect options={CLASSES} selected={form.classes} onChange={(v) => setForm({ ...form, classes: v })} multiple /></div>
            <div className="form-group"><label className="form-label">Boards</label><ChipSelect options={BOARDS} selected={form.boards} onChange={(v) => setForm({ ...form, boards: v })} multiple /></div>
            <div className="form-group"><label className="form-label">Languages</label><ChipSelect options={LANGUAGES} selected={form.languages} onChange={(v) => setForm({ ...form, languages: v })} multiple /></div>
          </>
        )}

        {step === 5 && (
          <>
            {['aadhaar', 'qualificationCert', 'experienceProof', 'resume'].map((doc) => (
              <div key={doc} className="form-group">
                <label className="form-label">{doc.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())} *</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, null, doc)} />
                {form.documents[doc] && <span className="text-sm" style={{ color: 'var(--accent)' }}> ✓ Uploaded</span>}
              </div>
            ))}
          </>
        )}

        {step === 6 && (
          <>
            <p className="text-muted mb-2">Upload a demo teaching video (max 180 seconds)</p>
            <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'demoVideo')} />
            {form.demoVideo?.url && <p className="text-sm mt-1" style={{ color: 'var(--accent)' }}>✓ Video uploaded</p>}
          </>
        )}

        {step === 7 && (
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Review Your Profile</h3>
            <p><strong>Name:</strong> {form.fullName}</p>
            <p><strong>Subjects:</strong> {form.subjects?.join(', ')}</p>
            <p><strong>Classes:</strong> {form.classes?.join(', ')}</p>
            <p><strong>Qualification:</strong> {form.qualification?.highestQualification}</p>
            <p className="text-sm text-muted mt-2">By submitting, your application will be sent for verification.</p>
          </div>
        )}

        <div className="grid-2 mt-3">
          {step < 7 ? (
            <button className="btn btn-primary" onClick={() => saveStep(step + 1)} disabled={loading}>
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ gridColumn: '1 / -1' }}>
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
