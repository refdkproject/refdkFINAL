import api from './api';

const API_URL = `${import.meta.env.VITE_BASE_URL}/api`;

export const profileService = {
  getProfile: async () => {
    return api.get(`${API_URL}/users/profile`);
  },

  getAllUsers: async () => {
    return api.get(`${API_URL}/users`);
  },

  updateProfile: async (data: any) => {
    return api.put(`${API_URL}/users/profile`, data);
  },
  updateProfilePic: async (formData: any) => {
    return api.post(`${API_URL}/users/profile-pic`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateInstituteLogo: async (formData: any) => {
    return api.post(`${API_URL}/users/institution-logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
