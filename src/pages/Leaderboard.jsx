import { useState, useEffect } from 'react';
import { leagueService } from '../services/leagueService';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [leagueLeaderboard, setLeagueLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('global'); // 'global' or 'league'

  useEffect(() => {
    loadGlobalLeaderboard();
    loadLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague && view === 'league') {
      loadLeagueLeaderboard(selectedLeague.id);
    }
  }, [selectedLeague, view]);

  const loadGlobalLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await leagueService.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeagues = async () => {
    try {
      const data = await leagueService.getLeagues();
      setLeagues(data);
    } catch (error) {
      console.error('Failed to load leagues:', error);
    }
  };

  const loadLeagueLeaderboard = async (leagueId) => {
    try {
      setLoading(true);
      const data = await leagueService.getLeagueLeaderboard(leagueId);
      setLeagueLeaderboard(data);
    } catch (error) {
      console.error('Failed to load league leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'global') {
      loadGlobalLeaderboard();
    }
  };

  if (loading && leaderboard.length === 0 && leagueLeaderboard.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const displayData = view === 'global' ? leaderboard : leagueLeaderboard;

  return (
    <div className="leaderboard-page">
      <h1>Leaderboard</h1>

      <div className="view-toggle">
        <button
          className={`toggle-btn ${view === 'global' ? 'active' : ''}`}
          onClick={() => handleViewChange('global')}
        >
          Global
        </button>
        <button
          className={`toggle-btn ${view === 'league' ? 'active' : ''}`}
          onClick={() => handleViewChange('league')}
        >
          By League
        </button>
      </div>

      {view === 'league' && (
        <div className="league-selector">
          <label htmlFor="league-select">Select League:</label>
          <select
            id="league-select"
            value={selectedLeague?.id || ''}
            onChange={(e) => {
              const league = leagues.find((l) => l.id === parseInt(e.target.value));
              setSelectedLeague(league);
            }}
          >
            <option value="">Choose a league...</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {displayData.length === 0 ? (
        <div className="empty-state">
          {view === 'league' && !selectedLeague
            ? 'Please select a league to view its leaderboard.'
            : 'No data available.'}
        </div>
      ) : (
        <div className="leaderboard-table">
          <div className={`table-header ${view}-view`}>
            <div className="rank-col">Rank</div>
            <div className="name-col">Name</div>
            {view === 'league' && <div className="prediction-col">Prediction</div>}
            <div className="points-col">Points</div>
          </div>
          {displayData.map((entry, index) => (
            <div key={entry.id || index} className={`table-row ${view}-view`}>
              <div className="rank-col">
                <span className={`rank-badge rank-${entry.rank || index + 1}`}>
                  {entry.rank || index + 1}
                </span>
              </div>
              <div className="name-col">
                <div className="user-info">
                  {entry.image && (
                    <img
                      src={entry.image}
                      alt={entry.profile__first_name || entry.first_name || 'User'}
                      className="user-avatar"
                    />
                  )}
                  <div>
                    <div className="user-name">
                      {entry.profile__first_name || entry.first_name || ''}{' '}
                      {entry.profile__last_name || entry.last_name || ''}
                    </div>
                    <div className="user-email">
                      {entry.profile__user__email || entry.user__email}
                    </div>
                  </div>
                </div>
              </div>
              {view === 'league' && (
                <div className="prediction-col">
                  {entry.predicted_team__name || 'N/A'}
                </div>
              )}
              <div className="points-col">
                <span className="points-value">
                  {entry.points || entry.total_points || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
