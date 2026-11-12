import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('notes_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('notes_auth_token') || null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear errors helper
  const clearError = () => setError(null);

  // Validate session on mount
  const checkAuth = useCallback(async () => {
    const currentToken = localStorage.getItem('notes_auth_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axiosClient.get('/api/auth/me');
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('notes_auth_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('Session expired or invalid, logging out:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen for unauthorized events triggered by axios interceptor
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Direct call works for both /api/auth/login and /login
      const res = await axiosClient.post('/api/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('notes_auth_token', receivedToken);
      localStorage.setItem('notes_auth_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Direct call works for both /api/auth/register and /register
      const res = await axiosClient.post('/api/auth/register', { name, email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('notes_auth_token', receivedToken);
      localStorage.setItem('notes_auth_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, error: msg, errors: err.errors || [] };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('notes_auth_token');
    localStorage.removeItem('notes_auth_user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        error,
        clearError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
