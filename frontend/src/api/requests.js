import apiClient from './client';

export const fetchRichieste = async () => {
  const { data } = await apiClient.get('/api/richieste');
  return data.richieste || [];
};

export const createRichiesta = async (motivo) => {
  const { data } = await apiClient.post('/api/richieste', { motivo });
  return data;
};

export const approveRichiesta = async (id) => {
  const { data } = await apiClient.patch(`/api/richieste/${id}`);
  return data;
};

export const deleteRichiesta = async (id) => {
  const { data } = await apiClient.delete(`/api/richieste/${id}`);
  return data;
};
