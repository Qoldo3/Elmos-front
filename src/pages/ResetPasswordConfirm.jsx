import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import './Auth.css';

const ResetPasswordConfirm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if we have status from backend redirect (for GET requests)
    const redirectStatus = searchParams.get('status');
    const redirectMessage = searchParams.get('message');
    
    if (redirectStatus === 'error') {
      setError(decodeURIComponent(redirectMessage || 'Invalid or expired token.'));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== newPassword1) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPasswordConfirm(token, newPassword, newPassword1);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.new_password?.[0] ||
          err.response?.data?.detail ||
          'Failed to reset password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Reset Password</h1>
        {success && (
          <div className="success-message">
            Password reset successfully! Redirecting to login...
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="new_password">New Password</label>
            <input
              type="password"
              id="new_password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="new_password1">Confirm New Password</label>
            <input
              type="password"
              id="new_password1"
              value={newPassword1}
              onChange={(e) => setNewPassword1(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
