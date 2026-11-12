import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export const Alert = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`alert alert-${type}`} role="alert">
      {isSuccess ? (
        <CheckCircle2 size={18} className="alert-icon" />
      ) : (
        <AlertCircle size={18} className="alert-icon" />
      )}
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ padding: '0.2rem', marginLeft: 'auto' }}
          aria-label="Close alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
