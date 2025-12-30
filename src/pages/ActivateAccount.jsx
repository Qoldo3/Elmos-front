import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import './Auth.css';

const ActivateAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if we have status from backend redirect
    const redirectStatus = searchParams.get('status');
    const redirectMessage = searchParams.get('message');
    
    if (redirectStatus) {
      // Backend redirected us with status
      setStatus(redirectStatus);
      setMessage(decodeURIComponent(redirectMessage || ''));
      if (redirectStatus === 'success') {
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } else {
      // No redirect status, call API directly (for backward compatibility)
      activateAccount();
    }
  }, [token, searchParams]);

  const activateAccount = async () => {
    try {
      const data = await authService.activateAccount(token);
      setStatus('success');
      setMessage(data.message || 'Account activated successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          'Activation failed. The link may have expired.'
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Account Activation</h1>
        {status === 'loading' && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Activating your account...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="success-message">
            {message}
            <br />
            <br />
            Redirecting to login...
          </div>
        )}
        {status === 'error' && (
          <>
            <div className="error-message">{message}</div>
            <div className="auth-links">
              <Link to="/login">Go to Login</Link>
              <Link to="/resend-activation">Resend Activation Email</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivateAccount;
