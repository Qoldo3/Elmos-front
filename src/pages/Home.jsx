import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Elmosliga</h1>
          <p className="hero-subtitle">
            Predict winners. Earn points. Climb the leaderboard.
          </p>
          <p className="hero-description">
            Join the fantasy league prediction platform and compete with others to prove your forecasting skills.
          </p>
          {isAuthenticated ? (
            <div className="hero-actions">
              <Link to="/leagues" className="btn-primary btn-large">
                Make Prediction
              </Link>
              <Link to="/leaderboard" className="btn-secondary btn-large">
                View Leaderboard
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/register" className="btn-primary btn-large">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary btn-large">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="features-header">
          <h2>How it works</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Make Predictions</h3>
            <p>Select your favorite teams and predict league winners</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Points</h3>
            <p>Earn points for correct predictions and monitor your progress</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Compete</h3>
            <p>Climb the global leaderboard and compete with others</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
