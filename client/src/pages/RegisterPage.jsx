import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/common/Alert.jsx';
import Spinner from '../components/common/Spinner.jsx';

export const RegisterPage = () => {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    const result = await register(name.trim(), email.trim(), password);
    if (result.success) {
      navigate('/', { replace: true });
    }
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
            <UserPlus size={26} />
          </div>
          <h1>Create an Account</h1>
          <p>Start organizing your personal thoughts securely</p>
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
            <label className="form-label" htmlFor="register-name">
              Full Name
            </label>
            <div className="input-container">
              <User size={18} className="input-icon" />
              <input
                id="register-name"
                type="text"
                className="form-control has-icon"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Email Address
            </label>
            <div className="input-container">
              <Mail size={18} className="input-icon" />
              <input
                id="register-email"
                type="email"
                className="form-control has-icon"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              Password
            </label>
            <div className="input-container">
              <Lock size={18} className="input-icon" />
              <input
                id="register-password"
                type="password"
                className="form-control has-icon"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <div className="input-container">
              <Lock size={18} className="input-icon" />
              <input
                id="register-confirm-password"
                type="password"
                className="form-control has-icon"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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
            {loading ? <Spinner /> : <UserPlus size={18} />}
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
