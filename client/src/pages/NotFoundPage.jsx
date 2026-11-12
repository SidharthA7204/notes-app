import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            padding: '1rem',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            borderRadius: '50%',
            marginBottom: '1.25rem',
          }}
        >
          <HelpCircle size={36} />
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>
          <ArrowLeft size={18} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
