import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4001/api/v1/miarchivo',
  withCredentials: true,
});

export default api;
