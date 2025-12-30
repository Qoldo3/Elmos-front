import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import './Auth.css';

const ResendActivation = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await authService.resendActivation(email);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.email?.[0] ||
          err.response?.data?.detail ||
          err.response?.data ||
          'Failed to resend activation email'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Resend Activation Email</h1>
        {success && (
          <div className="success-message">
            If an account with this email exists and is not yet verified, a new
            activation email has been sent.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Activation Email'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResendActivation;

