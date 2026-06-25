import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingState } from '../../components/common';

export default function TeacherSearching() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const d = setInterval(() => setDots((p) => (p.length >= 3 ? '' : p + '.')), 500);
    const t = setTimeout(() => {
      if (state?.session?._id) navigate(`/student/chat/${state.session._id}`);
    }, 5000);
    return () => { clearInterval(d); clearTimeout(t); };
  }, [state, navigate]);

  return (
    <div className="state-screen" style={{ minHeight: '100vh' }}>
      <div className="spinner" style={{ width: 64, height: 64 }} />
      <h2 className="state-title mt-3">Finding Teacher{dots}</h2>
      <p className="state-desc">Sending request to available teachers. First to accept wins!</p>
      <div className="card mt-2" style={{ maxWidth: 300 }}>
        <p><strong>Subject:</strong> {state?.session?.subject}</p>
        <p><strong>Type:</strong> {state?.session?.type}</p>
        <p className="text-sm text-muted">Routing to up to 4 teachers...</p>
      </div>
    </div>
  );
}
