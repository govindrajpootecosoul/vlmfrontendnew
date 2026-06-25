import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import { TopBar } from '../../components/common';

export default function ChatSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(0);
  const bottomRef = useRef();

  useEffect(() => {
    studentAPI.getMessages(sessionId).then(({ data }) => setMessages(data.data || []));
    const t = setInterval(() => setTimer((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [sessionId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const { data } = await studentAPI.sendMessage({ sessionId, content: input, type: 'text' });
    setMessages((m) => [...m, data.data]);
    setInput('');
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="page-no-nav" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 0 }}>
      <TopBar title={`Chat • ${formatTime(timer)}`} onBack={() => navigate(-1)} right={<button className="btn btn-sm btn-danger" onClick={() => navigate(`/student/feedback/${sessionId}`)}>End</button>} />
      <div className="chat-messages" style={{ flex: 1 }}>
        {messages.map((m) => (
          <div key={m._id} className={`chat-bubble ${m.senderRole === 'student' ? 'sent' : 'received'}`}>{m.content}</div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-bar">
        <input className="chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type message..." onKeyDown={(e) => e.key === 'Enter' && send()} />
        <button className="btn btn-primary btn-sm" onClick={send}>Send</button>
      </div>
    </div>
  );
}
