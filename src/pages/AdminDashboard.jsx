
import { useState, useEffect } from 'react';
import { leagueService } from '../services/leagueService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [leagues, setLeagues] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    first_place: '',
    second_place: '',
    third_place: '',
    fourth_place: '',
    fifth_place: '',
    sixth_place: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingResultId, setEditingResultId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leaguesData, resultsData] = await Promise.all([
        leagueService.getLeagues(),
        leagueService.getAllResults(),
      ]);
      setLeagues(leaguesData);
      setResults(resultsData);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to load data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLeagueChange = async (leagueId) => {
    const league = leagues.find((l) => l.id === parseInt(leagueId));
    setSelectedLeague(league);
    
    if (league) {
      try {
        const teamsData = await leagueService.getTeams(league.id);
        setTeams(teamsData);
        
        const existingResult = results.find((r) => r.league === league.id);
        if (existingResult) {
          setEditingResultId(existingResult.id);
          setFormData({
            first_place: existingResult.first_place || '',
            second_place: existingResult.second_place || '',
            third_place: existingResult.third_place || '',
            fourth_place: existingResult.fourth_place || '',
            fifth_place: existingResult.fifth_place || '',
            sixth_place: existingResult.sixth_place || '',
          });
        } else {
          setEditingResultId(null);
          setFormData({
            first_place: '',
            second_place: '',
            third_place: '',
            fourth_place: '',
            fifth_place: '',
            sixth_place: '',
          });
        }
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load teams.',
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLeague) {
      setMessage({ type: 'error', text: 'Please select a league.' });
      return;
    }
    
    const allPositions = [
      formData.first_place,
      formData.second_place,
      formData.third_place,
      formData.fourth_place,
      formData.fifth_place,
      formData.sixth_place,
    ];
    
    if (allPositions.some((pos) => !pos)) {
      setMessage({ type: 'error', text: 'Please select teams for all positions (1st-6th).' });
      return;
    }
    
    const uniqueTeams = new Set(allPositions);
    if (uniqueTeams.size !== 6) {
      setMessage({ type: 'error', text: 'All six teams must be different.' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const data = {
        league: selectedLeague.id,
        ...formData,
      };
      
      if (editingResultId) {
        await leagueService.updateResult(editingResultId, data);
        setMessage({ type: 'success', text: 'Result updated successfully! Points recalculated.' });
      } else {
        await leagueService.createResult(data);
        setMessage({ type: 'success', text: 'Result created successfully! Points calculated.' });
      }
      
      await loadData();
      
      setSelectedLeague(null);
      setTeams([]);
      setFormData({
        first_place: '',
        second_place: '',
        third_place: '',
        fourth_place: '',
        fifth_place: '',
        sixth_place: '',
      });
      setEditingResultId(null);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to save result.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (resultId) => {
    if (!window.confirm('Are you sure you want to delete this result?')) {
      return;
    }

    try {
      await leagueService.deleteResult(resultId);
      setMessage({ type: 'success', text: 'Result deleted successfully!' });
      await loadData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete result.',
      });
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
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p className="page-description">Manage league results and calculate points</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="admin-card">
        <h2>{editingResultId ? 'Update' : 'Create'} League Result</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select League</label>
            <select
              value={selectedLeague?.id || ''}
              onChange={(e) => handleLeagueChange(e.target.value)}
            >
              <option value="">Choose a league...</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>

          {selectedLeague && teams.length > 0 && (
            <>
              {['first', 'second', 'third', 'fourth', 'fifth', 'sixth'].map((position, idx) => (
                <div key={position} className="form-group">
                  <label>
                    {position.charAt(0).toUpperCase() + position.slice(1)} Place (#{idx + 1})
                  </label>
                  <select
                    value={formData[`${position}_place`]}
                    onChange={(e) => setFormData({ ...formData, [`${position}_place`]: e.target.value })}
                    required
                  >
                    <option value="">Select team...</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Saving...' : editingResultId ? 'Update Result' : 'Create Result'}
              </button>
            </>
          )}
        </form>
      </div>

      <div className="admin-card">
        <h2>Existing Results</h2>
        
        {results.length === 0 ? (
          <p className="empty-text">No results created yet</p>
        ) : (
          <div className="results-list">
            {results.map((result) => (
              <div key={result.id} className="result-item">
                <div>
                  <h3>{result.league_name}</h3>
                  <div className="result-details">
                    <p>1st: {result.first_place_name}</p>
                    <p>2nd: {result.second_place_name}</p>
                    <p>3rd: {result.third_place_name}</p>
                    <p>4th: {result.fourth_place_name}</p>
                    <p>5th: {result.fifth_place_name}</p>
                    <p>6th: {result.sixth_place_name}</p>
                  </div>
                </div>
                <div className="result-actions">
                  <button
                    onClick={() => {
                      const league = leagues.find((l) => l.id === result.league);
                      handleLeagueChange(league?.id);
                    }}
                    className="btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(result.id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;