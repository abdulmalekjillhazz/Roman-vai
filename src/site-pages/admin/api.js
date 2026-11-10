import axios from 'axios';

export function createAdminApi(token = '', onUnauthorized) {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    headers: token ? { Authorization: 'Bearer ' + token } : {}
  });
  if (token && onUnauthorized) {
    api.interceptors.response.use(response => response, error => {
      if (error.response?.status === 401) onUnauthorized();
      return Promise.reject(error);
    });
  }
  return api;
}
