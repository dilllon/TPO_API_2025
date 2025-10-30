const DEFAULT_API_BASE_URL = 'http://localhost:8080/api';

const normalizeValue = (value, fallback) => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

export const API_BASE_URL = normalizeValue(
  import.meta.env.VITE_API_BASE_URL,
  DEFAULT_API_BASE_URL
);

export const APP_PORT = normalizeValue(
  import.meta.env.VITE_APP_PORT ?? import.meta.env.VITE_PORT ?? import.meta.env.PORT,
  '5173'
);

