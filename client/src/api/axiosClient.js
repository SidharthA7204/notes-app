import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Inject JWT token into Authorization header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('notes_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform error handling & 401 session expiry
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired credentials
      localStorage.removeItem('notes_auth_token');
      localStorage.removeItem('notes_auth_user');

      // Dispatch custom event for session logout if not already on login/register page
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    const customError = {
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected network error occurred.',
      errors: error.response?.data?.errors || [],
    };

    return Promise.reject(customError);
  }
);

export default axiosClient;
