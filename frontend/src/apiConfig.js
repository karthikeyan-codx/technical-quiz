const getBaseUrl = () => {
  // Use environment variable if provided (for Production), else fallback to localhost
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl) return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;

  const hostname = window.location.hostname;
  return hostname === 'localhost' ? 'http://127.0.0.1:8000' : `http://${hostname}:8000`;
};

const getWsUrl = () => {
  // Convert http(s) to ws(s)
  const baseUrl = getBaseUrl();
  return baseUrl.replace(/^http/, 'ws');
};

export const API_BASE_URL = getBaseUrl();
export const WS_BASE_URL = getWsUrl();
