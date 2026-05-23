import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContextCore';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  // Form Validation Handler
  const validateForm = () => {
    const errors = {};
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password length validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Run client side validations
    if (!validateForm()) {
      setError('Please resolve the errors highlighted below.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-background-effects">
        <div className="auth-glow-circle primary-glow"></div>
        <div className="auth-glow-circle secondary-glow"></div>
      </div>
      
      <div className="auth-card-wrapper glass-panel fade-in-up">
        <div className="auth-card-header">
          <Link to="/" className="auth-brand-logo">
            <span className="logo-dot"></span>
            LuxeBook
          </Link>
          <h2>Welcome Back</h2>
          <p>Login to schedule and manage your elite service bookings.</p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <span className="alert-icon">⚠️</span>
            <span className="alert-message">{error}</span>
          </div>
        )}

        <form className="auth-card-form" onSubmit={handleSubmit} noValidate>
          <div className="form-input-wrapper">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                id="email"
                type="email"
                className={`auth-input-element ${validationErrors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors(prev => ({ ...prev, email: null }));
                  }
                }}
                required
                disabled={loading}
              />
            </div>
            {validationErrors.email && (
              <span style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '4px' }}>
                {validationErrors.email}
              </span>
            )}
          </div>

          <div className="form-input-wrapper">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <a href="#" className="forgot-password-link">Forgot?</a>
            </div>
            <div className="input-with-icon">
              <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="password"
                type="password"
                className={`auth-input-element ${validationErrors.password ? 'input-error' : ''}`}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors(prev => ({ ...prev, password: null }));
                  }
                }}
                required
                disabled={loading}
              />
            </div>
            {validationErrors.password && (
              <span style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '4px' }}>
                {validationErrors.password}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-card-footer">
          <p>Don't have an account? <Link to="/register" className="auth-switch-link">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
