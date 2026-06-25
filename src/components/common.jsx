import { useState, useEffect } from 'react';

export const LoadingState = ({ message = 'Loading...' }) => (
  <div className="state-screen">
    <div className="spinner" />
    <p className="state-desc mt-2">{message}</p>
  </div>
);

export const EmptyState = ({ icon = '📭', title = 'No data', description, action }) => (
  <div className="state-screen">
    <div className="state-icon">{icon}</div>
    <h3 className="state-title">{title}</h3>
    {description && <p className="state-desc">{description}</p>}
    {action}
  </div>
);

export const ErrorState = ({ title = 'Something went wrong', description, onRetry }) => (
  <div className="state-screen">
    <div className="state-icon">⚠️</div>
    <h3 className="state-title">{title}</h3>
    {description && <p className="state-desc">{description}</p>}
    {onRetry && <button className="btn btn-primary" onClick={onRetry} style={{ maxWidth: 200 }}>Retry</button>}
  </div>
);

export const NoInternetState = ({ onRetry }) => (
  <div className="state-screen">
    <div className="state-icon">📡</div>
    <h3 className="state-title">No Internet</h3>
    <p className="state-desc">Please check your connection and try again</p>
    {onRetry && <button className="btn btn-primary" onClick={onRetry} style={{ maxWidth: 200 }}>Retry</button>}
  </div>
);

export const BlockedState = ({ reason }) => (
  <div className="state-screen">
    <div className="state-icon">🚫</div>
    <h3 className="state-title">Account Blocked</h3>
    <p className="state-desc">{reason || 'Your account has been blocked. Contact support.'}</p>
  </div>
);

export const SuspendedState = () => (
  <div className="state-screen">
    <div className="state-icon">⏸️</div>
    <h3 className="state-title">Account Suspended</h3>
    <p className="state-desc">Your account is temporarily suspended. Contact support for help.</p>
  </div>
);

export const MaintenanceState = () => (
  <div className="state-screen">
    <div className="state-icon">🔧</div>
    <h3 className="state-title">Under Maintenance</h3>
    <p className="state-desc">We are improving VLM Academy. Please try again later.</p>
  </div>
);

export const ForceUpdateState = () => (
  <div className="state-screen">
    <div className="state-icon">🔄</div>
    <h3 className="state-title">Update Required</h3>
    <p className="state-desc">Please update the app to continue using VLM Academy.</p>
    <button className="btn btn-primary" style={{ maxWidth: 200 }}>Update Now</button>
  </div>
);

export const TopBar = ({ title, onBack, right }) => (
  <div className="top-bar">
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {onBack && <button className="top-bar-back" onClick={onBack}>←</button>}
      <span className="top-bar-title">{title}</span>
    </div>
    {right}
  </div>
);

export const StatusBadge = ({ status }) => {
  const map = {
    approved: 'badge-success', active: 'badge-success', completed: 'badge-success', credited: 'badge-success',
    pending: 'badge-pending', submitted: 'badge-info', searching: 'badge-info', trial: 'badge-info',
    rejected: 'badge-danger', failed: 'badge-danger', blocked: 'badge-danger', missed: 'badge-danger',
    suspended: 'badge-warning', under_review: 'badge-warning', processing: 'badge-warning',
    draft: 'badge-pending', live: 'badge-success',
  };
  return <span className={`badge ${map[status] || 'badge-pending'}`}>{status?.replace(/_/g, ' ')}</span>;
};

export const ChipSelect = ({ options, selected, onChange, multiple = false }) => {
  const toggle = (val) => {
    if (multiple) {
      onChange(selected.includes(val) ? selected.filter((s) => s !== val) : [...selected, val]);
    } else {
      onChange(val);
    }
  };
  return (
    <div className="chip-group">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`chip ${(multiple ? selected.includes(opt) : selected === opt) ? 'selected' : ''}`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

export const StepIndicator = ({ total, current }) => (
  <div className="step-indicator">
    {Array.from({ length: total }, (_, i) => (
      <div key={i} className={`step-dot ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`} />
    ))}
  </div>
);

export const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        {title && <h3 style={{ marginBottom: 16, fontWeight: 700 }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export const useOnlineStatus = () => {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
};
