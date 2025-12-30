import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            Elmosliga
          </Link>
          {isAuthenticated ? (
            <div className="nav-links">
              <Link
                to="/leagues"
                className={`nav-link ${isActive('/leagues') ? 'active' : ''}`}
              >
                Leagues
              </Link>
              <Link
                to="/predictions"
                className={`nav-link ${isActive('/predictions') ? 'active' : ''}`}
              >
                My Predictions
              </Link>
              <Link
                to="/leaderboard"
                className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
              >
                Leaderboard
              </Link>
              <Link
                to="/profile"
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                Profile
              </Link>
              <div className="user-menu">
                <span className="user-email">{user?.email}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="nav-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-link">Register</Link>
            </div>
          )}
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
