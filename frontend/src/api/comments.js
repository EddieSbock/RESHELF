import apiClient from './client';

export const fetchCommentsByPost = async (postId) => {
  const { data } = await apiClient.get(`/api/commento/${postId}`);
  return data.commenti || [];
};

export const createComment = async ({ contenuto, postId }) => {
  const { data } = await apiClient.post('/api/commento', { contenuto, postId });
  return data.commentoPostato;
};

export const deleteComment = async (id) => {
  const { data } = await apiClient.delete(`/api/commento/${id}`);
  return data;
};
