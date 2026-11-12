import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-badge">
            <FileText size={18} />
          </div>
          <span>NoteSphere</span>
        </Link>

        <div className="navbar-actions">
          {isAuthenticated && user ? (
            <>
              <div className="user-profile-badge" title={user.email}>
                <div className="user-avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={14} />}
                </div>
                <span>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                title="Log out of your account"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 0.9rem' }}>
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
