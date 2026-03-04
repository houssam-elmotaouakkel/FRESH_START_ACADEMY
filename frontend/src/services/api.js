import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Read tokens from Zustand's persist storage (single source of truth)
 */
const getPersistedTokens = () => {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return { accessToken: null, refreshToken: null };
    const parsed = JSON.parse(raw);
    return {
      accessToken: parsed?.state?.accessToken || null,
      refreshToken: parsed?.state?.refreshToken || null,
    };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
};

/**
 * Update tokens in Zustand's persist storage
 */
const setPersistedTokens = (accessToken, refreshToken) => {
  try {
    const raw = localStorage.getItem('auth-storage');
    const parsed = raw ? JSON.parse(raw) : { state: {}, version: 0 };
    parsed.state.accessToken = accessToken;
    if (refreshToken !== undefined) {
      parsed.state.refreshToken = refreshToken;
    }
    localStorage.setItem('auth-storage', JSON.stringify(parsed));
  } catch {
    // ignore
  }
};

const clearPersistedTokens = () => {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.state.accessToken = null;
      parsed.state.refreshToken = null;
      localStorage.setItem('auth-storage', JSON.stringify(parsed));
    }
  } catch {
    // ignore
  }
};

// Créer une instance Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const { accessToken } = getPersistedTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Token refresh with race-condition prevention ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et pas déjà réessayé
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken } = getPersistedTokens();
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          setPersistedTokens(accessToken, newRefreshToken || undefined);

          processQueue(null, accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh token expiré, déconnecter l'utilisateur
        clearPersistedTokens();
        // Use React-level navigation instead of full page reload
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Extraire le message d'erreur — sanitize before exposing
    const message = error.response?.data?.message || 'Une erreur est survenue';
    return Promise.reject({
      message,
      status: error.response?.status,
    });
  }
);

export default api;
