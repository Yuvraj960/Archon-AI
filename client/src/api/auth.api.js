import api from './axios';
export const register = (body) => api.post('/auth/register', body);
export const login    = (body) => api.post('/auth/login', body);
export const logout   = ()     => api.post('/auth/logout');
export const refresh  = (body) => api.post('/auth/refresh', body);
