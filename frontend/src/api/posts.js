import apiClient from './client';

export const fetchPosts = async ({ categoria, ricerca } = {}) => {
  const { data } = await apiClient.get('/api/post', {
    params: {
      categoria: categoria || undefined,
      ricerca: ricerca || undefined,
    },
  });
  return data.postati || [];
};

export const fetchTopPosts = async () => {
  const { data } = await apiClient.get('/api/post/top');
  return data.miglioriPost || [];
};

export const fetchPostById = async (id) => {
  const { data } = await apiClient.get(`/api/post/${id}`);
  return data.post;
};

export const createPost = async (postData) => {
  const { data } = await apiClient.post('/api/post', postData);
  return data.post;
};

export const updatePost = async (id, postData) => {
  const { data } = await apiClient.patch(`/api/post/${id}`, postData);
  return data.post;
};

export const deletePost = async (id) => {
  const { data } = await apiClient.delete(`/api/post/${id}`);
  return data;
};
