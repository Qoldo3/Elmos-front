import api from './api';

export const authService = {
  register: async (email, password, password1) => {
    const response = await api.post('/accounts/api/v1/register/', {
      email,
      password,
      password1,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/accounts/api/v1/jwt/create/', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/accounts/api/v1/token/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  activateAccount: async (token) => {
    const response = await api.get(`/accounts/api/v1/activate/${token}/`);
    return response.data;
  },

  resendActivation: async (email) => {
    const response = await api.post('/accounts/api/v1/resend-activation/', {
      email,
    });
    return response.data;
  },

  resetPassword: async (email) => {
    const response = await api.post('/accounts/api/v1/password-reset/', {
      email,
    });
    return response.data;
  },

  resetPasswordConfirm: async (token, newPassword, newPassword1) => {
    const response = await api.post(
      `/accounts/api/v1/password-reset/confirm/${token}/`,
      {
        new_password: newPassword,
        new_password1: newPassword1,
      }
    );
    return response.data;
  },

  changePassword: async (oldPassword, newPassword, newPassword1) => {
    const response = await api.put('/accounts/api/v1/password-change/', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password1: newPassword1,
    });
    return response.data;
  },
};
