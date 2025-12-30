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
        <h1>My Predictions</h1>
        <div className="empty-state">
          <p>You haven't made any predictions yet.</p>
          <a href="/leagues" className="btn-primary">
            Make a Prediction
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="predictions-page">
      <h1>My Predictions</h1>
      <div className="predictions-grid">
        {predictions.map((prediction) => (
          <div key={prediction.id} className="prediction-card">
            <div className="prediction-header">
              <h3>{prediction.league_name}</h3>
              <span className="points-badge">{prediction.points} pts</span>
            </div>
            <div className="prediction-content">
              <p className="predicted-team">
                <strong>Predicted Winner:</strong> {prediction.predicted_team_name || 'Not set'}
              </p>
              <p className="prediction-date">
                Created: {new Date(prediction.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Predictions;
