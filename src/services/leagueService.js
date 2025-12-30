import api from './api';

export const leagueService = {
  getLeagues: async () => {
    const response = await api.get('/league/leagues/');
    return response.data;
  },

  getTeams: async (leagueId) => {
    const response = await api.get(`/league/leagues/${leagueId}/teams/`);
    return response.data;
  },

  createPrediction: async (leagueId, predictedTeamId) => {
    const response = await api.post('/league/prediction/', {
      league: leagueId,
      predicted_team: predictedTeamId,
    });
    return response.data;
  },

  getPredictions: async () => {
    const response = await api.get('/league/predictions/');
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await api.get('/league/leaderboard/');
    return response.data;
  },

  getLeagueLeaderboard: async (leagueId) => {
    const response = await api.get(`/league/leaderboard/${leagueId}/`);
    return response.data;
  },
};
