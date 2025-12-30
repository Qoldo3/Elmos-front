import api from './api';

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/accounts/api/v1/profile/');
    return response.data;
  },

  updateProfile: async (data) => {
    const formData = new FormData();
    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.description) formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);

    const response = await api.put('/accounts/api/v1/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
