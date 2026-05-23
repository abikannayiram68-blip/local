import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContextCore';
import '../styles/auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Client-Side Input Form Validation
  const validateForm = () => {
    const errors = {};

    // Name Validation
    if (!name.trim()) {
      errors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone Validation
    const phoneRegex = /^\+?[0-9\s-()]{7,15}$/;
    if (!phone) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Password Validation
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

    // Pre-submission client-side validation
    if (!validateForm()) {
      setError('Please resolve the errors highlighted below.');
      return;
    }

    setLoading(true);
    try {
      // Registers user with dynamic role
      await register(name, email, password, phone, role);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please review your details and try again.');
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
          <h2>Create Account</h2>
          <p>Sign up to book pre-screened five-star local professionals today.</p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <span className="alert-icon">⚠️</span>
            <span className="alert-message">{error}</span>
          </div>
        )}

        <form className="auth-card-form" onSubmit={handleSubmit} noValidate>
          <div className="form-input-wrapper">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                id="name"
                type="text"
                className={`auth-input-element ${validationErrors.name ? 'input-error' : ''}`}
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (validationErrors.name) {
                    setValidationErrors(prev => ({ ...prev, name: null }));
                  }
                }}
                required
                disabled={loading}
              />
            </div>
            {validationErrors.name && (
              <span style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '4px' }}>
                {validationErrors.name}
              </span>
            )}
          </div>

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
                placeholder="john@example.com"
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
            <label htmlFor="phone">Phone Number</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <input
                id="phone"
                type="tel"
                className={`auth-input-element ${validationErrors.phone ? 'input-error' : ''}`}
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (validationErrors.phone) {
                    setValidationErrors(prev => ({ ...prev, phone: null }));
                  }
                }}
                required
                disabled={loading}
              />
            </div>
            {validationErrors.phone && (
              <span style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '4px' }}>
                {validationErrors.phone}
              </span>
            )}
          </div>

          <div className="form-input-wrapper">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="password"
                type="password"
                className={`auth-input-element ${validationErrors.password ? 'input-error' : ''}`}
                placeholder="At least 6 characters"
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
          
          <div className="form-input-wrapper">
            <label htmlFor="role">Register As</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <select
                id="role"
                className="auth-input-element"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                style={{ appearance: 'none', background: 'transparent', paddingRight: '30px' }}
              >
                <option value="user" style={{ backgroundColor: 'var(--surface)' }}>Customer (Book Services)</option>
                <option value="provider" style={{ backgroundColor: 'var(--surface)' }}>Service Provider (Take Jobs)</option>
                <option value="admin" style={{ backgroundColor: 'var(--surface)' }}>System Admin (Manage Platform)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-card-footer">
          <p>Already have an account? <Link to="/login" className="auth-switch-link">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
