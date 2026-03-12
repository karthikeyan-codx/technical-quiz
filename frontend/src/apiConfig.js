const getBaseUrl = () => {
  const hostname = window.location.hostname;
  const port = 8000;
  
  if (hostname === 'localhost') {
    return `http://127.0.0.1:${port}`;
  }
  return `http://${hostname}:${port}`;
};

const getWsUrl = () => {
  const hostname = window.location.hostname;
  const port = 8000;
  
  if (hostname === 'localhost') {
    return `ws://127.0.0.1:${port}`;
  }
  return `ws://${hostname}:${port}`;
};

export const API_BASE_URL = getBaseUrl();
export const WS_BASE_URL = getWsUrl();
