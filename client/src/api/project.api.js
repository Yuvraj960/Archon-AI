import api from './axios';
import useAuthStore from '../store/useAuthStore';

export const createProject  = (body) => api.post('/projects', body);
export const getProjects    = ()     => api.get('/projects');
export const getProject     = (id)   => api.get(`/projects/${id}`);
export const updateProject  = (id, body) => api.patch(`/projects/${id}`, body);
export const deleteProject  = (id)   => api.delete(`/projects/${id}`);
export const getVersions    = (id)   => api.get(`/projects/${id}/versions`);
export const getVersion     = (id, ver) => api.get(`/projects/${id}/versions/${ver}`);

/**
 * Trigger a file-download export of the project's design.
 *
 * @param {string} projectId
 * @param {'json'|'md'} format
 * @param {number|null} version  - null = latest
 */
export const exportDesign = async (projectId, format = 'json', version = null) => {
  const token     = useAuthStore.getState().accessToken;
  const base      = import.meta.env.VITE_API_URL;
  const versionQS = version ? `&version=${version}` : '';
  const url       = `${base}/projects/${projectId}/export?format=${format}${versionQS}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || 'Export failed');
  }

  // Extract filename from Content-Disposition header (if present), else fall back
  const disposition = res.headers.get('Content-Disposition') || '';
  const fileMatch   = disposition.match(/filename="(.+?)"/);
  const filename    = fileMatch ? fileMatch[1] : `export.${format}`;

  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
};

