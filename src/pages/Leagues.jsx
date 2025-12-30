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
    try {
      const data = await leagueService.getTeams(league.id);
      setTeams(data);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to load teams. Please try again.',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        text: 'Prediction saved successfully!',
      });
      setTimeout(() => {
        setSelectedLeague(null);
        setSelectedTeam(null);
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text:
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
      <h1>Make a Prediction</h1>
      <p className="page-description">
        Select a league and choose which team you think will win.
      </p>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

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
              <img
                src={league.image}
                alt={league.name}
                className="league-image"
              />
            )}
            <h3>{league.name}</h3>
            <p className="teams-count">{league.teams?.length || 0} teams</p>
          </div>
        ))}
      </div>

      {selectedLeague && (
        <div className="prediction-form-container">
          <h2>Select Your Prediction for {selectedLeague.name}</h2>
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
                    <img src={team.image} alt={team.name} className="team-image" />
                  )}
                  <span>{team.name}</span>
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={!selectedTeam || submitting}
            >
              {submitting ? 'Saving...' : 'Save Prediction'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Leagues;
