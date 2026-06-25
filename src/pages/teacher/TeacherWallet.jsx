import { useEffect, useState } from 'react';
import { teacherAPI } from '../../services/api';
import { TopBar, LoadingState, StatusBadge } from '../../components/common';

export default function TeacherWallet() {
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState('');
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([teacherAPI.getWallet(), teacherAPI.getWithdrawals()])
      .then(([w, wd]) => { setWallet(w.data.data); setWithdrawals(wd.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async () => {
    try {
      await teacherAPI.withdraw({ amount: parseFloat(amount) });
      alert('Withdrawal request submitted');
      setAmount('');
      const { data } = await teacherAPI.getWallet();
      setWallet(data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Withdrawal failed');
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="page">
      <TopBar title="Wallet" />
      <div className="card card-gradient mb-2">
        <div className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Withdrawable Balance</div>
        <div style={{ fontSize: 32, fontWeight: 800 }}>₹{wallet?.wallet?.withdrawableBalance?.toFixed(0) || 0}</div>
        <div className="flex-between mt-1" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
          <span>{wallet?.wallet?.totalPoints || 0} points</span>
          <span>1₹ = {wallet?.pointsToInr || 10} pts</span>
        </div>
      </div>

      <div className="toggle-group mb-2">
        {['overview', 'withdraw', 'history'].map((t) => (
          <button key={t} className={`toggle-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Recent Transactions</h4>
          {wallet?.transactions?.map((tx) => (
            <div key={tx._id} className="list-item">
              <div className="list-content">
                <div className="list-title">{tx.description}</div>
                <div className="list-subtitle">{new Date(tx.createdAt).toLocaleDateString()} • {tx.earningType}</div>
              </div>
              <span style={{ fontWeight: 700, color: tx.type === 'credit' ? 'var(--accent)' : 'var(--danger)' }}>
                {tx.type === 'credit' ? '+' : '-'}{tx.points} pts
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'withdraw' && (
        <div className="card">
          <div className="form-group">
            <label className="form-label">Withdrawal Amount (₹)</label>
            <input className="form-input" type="number" placeholder="Min ₹500" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <p className="text-sm text-muted mb-2">Bank transfer via IMPS. TDS & commission may apply.</p>
          <button className="btn btn-primary" onClick={handleWithdraw}>Request Withdrawal</button>
        </div>
      )}

      {tab === 'history' && withdrawals.map((w) => (
        <div key={w._id} className="card mb-1">
          <div className="flex-between"><span style={{ fontWeight: 600 }}>₹{w.amount}</span><StatusBadge status={w.status} /></div>
          <p className="text-sm text-muted">{new Date(w.createdAt).toLocaleDateString()} • Net: ₹{w.netAmount?.toFixed(0)}</p>
          {w.rejectionReason && <p className="text-sm" style={{ color: 'var(--danger)' }}>{w.rejectionReason}</p>}
        </div>
      ))}
    </div>
  );
}
