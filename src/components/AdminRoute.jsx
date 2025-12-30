// src/components/AdminRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin by trying to access admin endpoints
  // In production, you should store is_staff in the user object
  // For now, we'll let the backend handle the permission check
  // and show appropriate error messages

  return children;
};

export default AdminRoute;