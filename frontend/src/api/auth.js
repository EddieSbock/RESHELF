import apiClient from './client';

export const loginUser = async (email, password) => {
  const { data } = await apiClient.post('/api/login', { email, password });
  return data;
};

export const registerUser = async ({ nome, email, password }) => {
  const { data } = await apiClient.post('/api/register', { nome, email, password });
  return data;
};

export const fetchProfile = async () => {
  const { data } = await apiClient.get('/api/profile');
  return data.user;
};

export const updateProfile = async ({ nome, email }) => {
  const { data } = await apiClient.patch('/api/profile', { nome, email });
  return data.user;
};

export const updatePassword = async ({ password, nuovaPassword }) => {
  const { data } = await apiClient.patch('/api/profile/password', { password, nuovaPassword });
  return data;
};
