import axios from 'axios';

export function createAdminApi(token = '') {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    headers: token ? { Authorization: 'Bearer ' + token } : {}
  });
}
