import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import { TopBar, LoadingState } from '../../components/common';

export default function PlanSelection() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getPlans('10').then(({ data }) => setPlans(data.data)).finally(() => setLoading(false));
  }, []);

  const activateTrial = async (planId) => {
    await studentAPI.activateTrial({ planId });
    navigate('/student/dashboard');
  };

  if (loading) return <LoadingState />;

  return (
    <div className="page-no-nav">
      <TopBar title="Choose Your Plan" />
      <p className="text-muted mb-2" style={{ padding: '0 16px' }}>Start with ₹1 trial • 3 days free • Auto-renewal</p>
      {plans.map((plan) => (
        <div key={plan._id} className="card mb-2" style={{ margin: '0 16px 12px' }}>
          <div className="flex-between"><h3 style={{ fontWeight: 700 }}>{plan.name}</h3><span className="badge badge-info">{plan.duration}</span></div>
          <div className="mt-1">
            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{plan.mrp}</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', marginLeft: 8 }}>₹{plan.price}</span>
          </div>
          <ul className="text-sm text-muted mt-1" style={{ paddingLeft: 16 }}>
            <li>{plan.benefits?.aiCredits} AI credits</li>
            <li>{plan.benefits?.humanChatCredits} chat sessions</li>
            <li>{plan.benefits?.audioMinutes} audio minutes</li>
            <li>{plan.benefits?.videoMinutes} video minutes</li>
          </ul>
          <button className="btn btn-primary mt-2" onClick={() => activateTrial(plan._id)}>Start ₹1 Trial</button>
        </div>
      ))}
      <button className="btn btn-ghost" style={{ margin: '0 16px' }} onClick={() => navigate('/student/dashboard')}>Skip for now</button>
    </div>
  );
}
