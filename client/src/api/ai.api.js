import api from './axios';
export const generateQuestions = (body) => api.post('/ai/questions', body);
export const refineInput       = (body) => api.post('/ai/refine', body);
export const generateDesign    = (body) => api.post('/ai/generate-design', body);
export const updateDesign      = (body) => api.post('/ai/update-design', body);
export const generateDiagram   = (body) => api.post('/ai/generate-diagram', body);
