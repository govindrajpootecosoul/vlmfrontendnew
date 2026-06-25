import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import { TopBar, LoadingState } from '../../components/common';

export default function DailyMcq() {
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    studentAPI.getDailyMcq().then(({ data }) => {
      setTask(data.data);
      setTimer(data.data?.timerSeconds || 1200);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!task || result) return;
    const t = setInterval(() => setTimer((p) => { if (p <= 1) { handleSubmit(); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, [task, result]);

  const selectAnswer = (idx) => {
    const newAnswers = [...answers];
    newAnswers[current] = { questionIndex: current, selectedAnswer: idx };
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    const { data } = await studentAPI.submitMcq({ taskId: task._id, answers });
    setResult(data.data);
  };

  if (loading) return <LoadingState />;
  if (result) return (
    <div className="page">
      <div className="state-screen">
        <div className="state-icon">🎉</div>
        <h2 className="state-title">MCQ Complete!</h2>
        <p>Score: {result.score}/{result.total}</p>
        <p>Points earned: {result.pointsEarned}</p>
        <button className="btn btn-primary mt-2" onClick={() => navigate('/student/dashboard')}>Back to Home</button>
      </div>
    </div>
  );

  const q = task?.questions?.[current];
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="page">
      <TopBar title={`MCQ ${current + 1}/${task.questions.length}`} right={<span style={{ fontWeight: 700, color: timer < 60 ? 'var(--danger)' : 'var(--primary)' }}>{formatTime(timer)}</span>} />
      <div className="progress-bar mb-2"><div className="progress-fill" style={{ width: `${((current + 1) / task.questions.length) * 100}%` }} /></div>
      <div className="card">
        <span className="badge badge-info mb-1">{q?.subject}</span>
        <h3 style={{ fontWeight: 600, lineHeight: 1.5 }}>{q?.question}</h3>
      </div>
      <div className="mt-2">
        {q?.options?.map((opt, i) => (
          <button key={i} className="card mb-1" style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: answers[current]?.selectedAnswer === i ? '2px solid var(--primary)' : undefined }} onClick={() => selectAnswer(i)}>
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
      <div className="grid-2 mt-2">
        <button className="btn btn-outline" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Previous</button>
        {current < task.questions.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setCurrent(current + 1)}>Next</button>
        ) : (
          <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
}
