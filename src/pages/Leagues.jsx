
import { useState, useEffect } from 'react';
import { leagueService } from '../services/leagueService';
import './Leagues.css';

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasPredicted, setHasPredicted] = useState(false);
  const [existingPrediction, setExistingPrediction] = useState(null);

  useEffect(() => {
    loadLeagues();
  }, []);

  const loadLeagues = async () => {
    try {
      setLoading(true);
      const data = await leagueService.getLeagues();
      setLeagues(data);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to load leagues. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLeagueSelect = async (league) => {
    setSelectedLeague(league);
    setSelectedTeam(null);
    setMessage({ type: '', text: '' });
    setHasPredicted(false);
    setExistingPrediction(null);
    
    try {
      // Load teams
      const teamsData = await leagueService.getTeams(league.id);
      setTeams(teamsData);
      
      // Check if user has already predicted for this league
      const predictionCheck = await leagueService.checkPrediction(league.id);
      if (predictionCheck.has_predicted) {
        setHasPredicted(true);
        setExistingPrediction(predictionCheck.prediction);
        setMessage({
          type: 'error',
          text: 'You have already made a prediction for this league and cannot change it.',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to load teams. Please try again.',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasPredicted) {
      setMessage({
        type: 'error',
        text: 'You have already made a prediction for this league.',
      });
      return;
    }
    
    if (!selectedLeague || !selectedTeam) {
      setMessage({
        type: 'error',
        text: 'Please select a league and team.',
      });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await leagueService.createPrediction(selectedLeague.id, selectedTeam.id);
      setMessage({
        type: 'success',
        text: 'Prediction saved successfully! You cannot change this prediction.',
      });
      setHasPredicted(true);
      setTimeout(() => {
        setSelectedLeague(null);
        setSelectedTeam(null);
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.error ||
          error.response?.data?.predicted_team?.[0] ||
          error.response?.data?.detail ||
          'Failed to save prediction. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="leagues-page">
      <div className="page-header">
        <h1>Make a Prediction</h1>
        <p className="page-description">
          Choose a league and select your predicted winner (cannot be changed once submitted)
        </p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="leagues-section">
        <h2 className="section-title">Available Leagues</h2>
        <div className="leagues-grid">
          {leagues.map((league) => (
            <div
              key={league.id}
              className={`league-card ${
                selectedLeague?.id === league.id ? 'selected' : ''
              }`}
              onClick={() => handleLeagueSelect(league)}
            >
              {league.image && (
                <div className="league-image-wrapper">
                  <img
                    src={league.image}
                    alt={league.name}
                    className="league-image"
                  />
                </div>
              )}
              <div className="league-info">
                <h3>{league.name}</h3>
                <p className="teams-count">{league.teams?.length || 0} teams</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedLeague && (
        <div className="prediction-section">
          <div className="prediction-header">
            <h2>{selectedLeague.name}</h2>
            {hasPredicted && existingPrediction ? (
              <div>
                <p style={{ color: '#2563eb', fontWeight: 600 }}>
                  Your prediction: {existingPrediction.predicted_team_name}
                </p>
                <p>Points: {existingPrediction.points}</p>
              </div>
            ) : (
              <p>Select your predicted winner (final decision)</p>
            )}
          </div>
          
          {!hasPredicted && (
            <form onSubmit={handleSubmit} className="prediction-form">
              <div className="teams-grid">
                {teams.map((team) => (
                  <label
                    key={team.id}
                    className={`team-option ${
                      selectedTeam?.id === team.id ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="team"
                      value={team.id}
                      checked={selectedTeam?.id === team.id}
                      onChange={() => setSelectedTeam(team)}
                    />
                    {team.image && (
                      <div className="team-image-wrapper">
                        <img src={team.image} alt={team.name} className="team-image" />
                      </div>
                    )}
                    <span className="team-name">{team.name}</span>
                  </label>
                ))}
              </div>
              <div className="form-submit">
                <button
                  type="submit"
                  className="btn-primary btn-large"
                  disabled={!selectedTeam || submitting}
                >
                  {submitting ? 'Saving...' : 'Confirm Prediction (Cannot Change)'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Leagues;