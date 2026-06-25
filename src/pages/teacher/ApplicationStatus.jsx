import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherAPI } from '../../services/api';
import { TopBar, LoadingState, StatusBadge } from '../../components/common';

export default function ApplicationStatus() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherAPI.getApplicationStatus()
      .then(({ data }) => setStatus(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  const statusMessages = {
    draft: { icon: '📝', title: 'Complete Your Profile', desc: 'Finish onboarding to submit your application.', action: () => navigate('/teacher/onboarding') },
    submitted: { icon: '⏳', title: 'Application Submitted', desc: 'Your application is under review. We will notify you soon.' },
    interview_pending: { icon: '📋', title: 'Interview Pending', desc: 'Schedule your interview to proceed.', action: () => navigate('/teacher/interview') },
    interview_scheduled: { icon: '📅', title: 'Interview Scheduled', desc: 'Check your interview details.', action: () => navigate('/teacher/interview') },
    under_review: { icon: '🔍', title: 'Under Review', desc: 'Your profile is being reviewed by our team.' },
    approved: { icon: '✅', title: 'Approved!', desc: 'Congratulations! You can now start teaching.', action: () => navigate('/teacher/dashboard') },
    rejected: { icon: '❌', title: 'Application Rejected', desc: status?.rejectionReason || 'Please review and reapply.' },
    reapply_after_7_days: { icon: '⏰', title: 'Reapply Later', desc: `You can reapply after ${status?.reapplyAfter ? new Date(status.reapplyAfter).toLocaleDateString() : '7 days'}.` },
    suspended: { icon: '⏸️', title: 'Suspended', desc: 'Your account is suspended. Contact support.' },
    blocked: { icon: '🚫', title: 'Blocked', desc: 'Your account has been blocked.' },
  };

  const info = statusMessages[status?.status] || statusMessages.draft;

  return (
    <div className="page-no-nav">
      <TopBar title="Application Status" />
      <div className="state-screen">
        <div className="state-icon">{info.icon}</div>
        <h2 className="state-title">{info.title}</h2>
        <StatusBadge status={status?.status} />
        <p className="state-desc mt-2">{info.desc}</p>
        {status?.rejectionReason && <div className="card mt-2" style={{ textAlign: 'left' }}><strong>Reason:</strong> {status.rejectionReason}</div>}
        {info.action && <button className="btn btn-primary mt-2" style={{ maxWidth: 280 }} onClick={info.action}>Continue</button>}
      </div>
    </div>
  );
}
