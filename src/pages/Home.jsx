import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Elmosliga</h1>
        <p className="hero-description">
          Predict the winners and compete with others in fantasy league predictions.
          Make your predictions, earn points, and climb the leaderboard!
        </p>
        {isAuthenticated ? (
          <div className="hero-actions">
            <Link to="/leagues" className="btn-primary btn-large">
              Make a Prediction
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
              Login
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Make Predictions</h3>
          <p>Choose your favorite teams and predict the winners of each league.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Track Points</h3>
          <p>Earn points for correct predictions and see how you rank against others.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Compete</h3>
          <p>Join the competition and climb the global leaderboard.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
