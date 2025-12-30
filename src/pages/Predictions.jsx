import { useState, useEffect } from 'react';
import { leagueService } from '../services/leagueService';
import './Predictions.css';

const Predictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      setLoading(true);
      const data = await leagueService.getPredictions();
      setPredictions(data);
    } catch (error) {
      setError('Failed to load predictions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (predictions.length === 0) {
    return (
      <div className="predictions-page">
        <div className="page-header">
          <h1>My Predictions</h1>
          <p className="page-description">View and manage your league predictions</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No predictions yet</h3>
          <p>Start making predictions to see them here</p>
          <a href="/leagues" className="btn-primary">
            Make Your First Prediction
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="predictions-page">
      <div className="page-header">
        <h1>My Predictions</h1>
        <p className="page-description">{predictions.length} {predictions.length === 1 ? 'prediction' : 'predictions'}</p>
      </div>
      <div className="predictions-grid">
        {predictions.map((prediction) => (
          <div key={prediction.id} className="prediction-card">
            <div className="prediction-card-header">
              <div>
                <h3>{prediction.league_name}</h3>
                <p className="prediction-date">
                  {new Date(prediction.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="points-badge">{prediction.points}</div>
            </div>
            <div className="prediction-card-body">
              <div className="prediction-item">
                <span className="prediction-label">Predicted Winner</span>
                <span className="prediction-value">
                  {prediction.predicted_team_name || 'Not set'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Predictions;
