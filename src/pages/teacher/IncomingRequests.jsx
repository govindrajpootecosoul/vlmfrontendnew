import { useEffect, useState } from 'react';
import { teacherAPI } from '../../services/api';
import { TopBar, LoadingState, EmptyState } from '../../components/common';

export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRequest, setActiveRequest] = useState(null);
  const [timer, setTimer] = useState(20);

  const fetchRequests = () => {
    teacherAPI.getRequests().then(({ data }) => {
      setRequests(data.data || []);
      if (data.data?.length && !activeRequest) {
        setActiveRequest(data.data[0]);
        setTimer(20);
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); const i = setInterval(fetchRequests, 5000); return () => clearInterval(i); }, []);

  useEffect(() => {
    if (!activeRequest) return;
    const t = setInterval(() => setTimer((prev) => { if (prev <= 1) { setActiveRequest(null); return 20; } return prev - 1; }), 1000);
    return () => clearInterval(t);
  }, [activeRequest]);

  const respond = async (action) => {
    await teacherAPI.respondRequest({ requestId: activeRequest._id, action });
    setActiveRequest(null);
    fetchRequests();
  };

  if (loading) return <LoadingState />;
  if (!requests.length && !activeRequest) return (
    <div className="page"><TopBar title="Incoming Requests" />
      <EmptyState icon="📭" title="No Requests" description="Go online to receive doubt requests from students" />
    </div>
  );

  return (
    <div className="page">
      <TopBar title="Incoming Requests" />
      {requests.map((req) => (
        <div key={req._id} className="card mb-2" onClick={() => setActiveRequest(req)}>
          <div className="flex-between"><strong>{req.subject}</strong><span className="badge badge-info">{req.sessionType}</span></div>
          <p className="text-sm text-muted">Class {req.class} • {req.language}</p>
          <p className="text-sm mt-1">{req.doubtText?.slice(0, 80)}</p>
        </div>
      ))}

      {activeRequest && (
        <div className="request-popup">
          <div className="request-card">
            <div className="timer-ring">{timer}</div>
            <h3 style={{ textAlign: 'center', fontWeight: 700 }}>New Request!</h3>
            <div className="card mt-2" style={{ background: 'var(--bg)' }}>
              <p><strong>Subject:</strong> {activeRequest.subject}</p>
              <p><strong>Class:</strong> {activeRequest.class}</p>
              <p><strong>Language:</strong> {activeRequest.language}</p>
              <p><strong>Type:</strong> {activeRequest.sessionType}</p>
              {activeRequest.doubtText && <p className="mt-1"><strong>Doubt:</strong> {activeRequest.doubtText}</p>}
            </div>
            <div className="grid-2 mt-2">
              <button className="btn btn-danger" onClick={() => respond('reject')}>Reject</button>
              <button className="btn btn-primary" onClick={() => respond('accept')}>Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
