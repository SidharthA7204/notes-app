import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/common/Alert.jsx';
import Spinner from '../components/common/Spinner.jsx';

export const LoginPage = () => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!email.trim()) {
      setValidationError('Please enter your email address.');
      return;
    }
    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }

    const result = await login(email.trim(), password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@example.com');
    setPassword('password123');
    setValidationError('');
    clearError();
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div
            style={{
              display: 'inline-flex',
              padding: '0.65rem',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
            }}
          >
            <LogIn size={26} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your NoteSphere account</p>
        </div>

        {(error || validationError) && (
          <Alert
            type="danger"
            message={validationError || error}
            onClose={() => {
              setValidationError('');
              clearError();
            }}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <div className="input-container">
              <Mail size={18} className="input-icon" />
              <input
                id="login-email"
                type="email"
                className="form-control has-icon"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div className="input-container">
              <Lock size={18} className="input-icon" />
              <input
                id="login-password"
                type="password"
                className="form-control has-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? <Spinner /> : <LogIn size={18} />}
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <button
          type="button"
          onClick={handleFillDemo}
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.85rem' }}
        >
          <Sparkles size={15} style={{ color: 'var(--color-primary)' }} />
          <span>Fill Demo Account Credentials</span>
        </button>

        <div className="auth-footer">
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
