import { TopBar } from '../components/common';
import { useNavigate } from 'react-router-dom';

export default function PlaceholderPage({ title, icon = '🚧', description }) {
  const navigate = useNavigate();
  return (
    <div className="page">
      <TopBar title={title} onBack={() => navigate(-1)} />
      <div className="state-screen">
        <div className="state-icon">{icon}</div>
        <h3 className="state-title">{title}</h3>
        <p className="state-desc">{description || `${title} module is available. Full WebRTC/recording features connect via Socket.io.`}</p>
      </div>
    </div>
  );
}
