import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Token refresh logic ──────────────────────────────────────────────────────
// If multiple requests fail with 401 at the same time, we only call the
// refresh endpoint once and replay all queued requests with the new token.
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token),
  );
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only handle 401s, and only once per request (avoid infinite loops)
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      // No refresh token at all — session is over
      localStorage.removeItem("access");
      localStorage.removeItem("username");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // If a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers["Authorization"] = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // Use plain axios (not our `api` instance) to avoid triggering this
      // interceptor again on the refresh call itself
      const { data } = await axios.post(`${BASE_URL}/token/refresh/`, { refresh });

      localStorage.setItem("access", data.access);
      // Some simplejwt configs rotate the refresh token too
      if (data.refresh) localStorage.setItem("refresh", data.refresh);

      api.defaults.headers["Authorization"] = `Bearer ${data.access}`;
      processQueue(null, data.access);

      original.headers["Authorization"] = `Bearer ${data.access}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // Refresh token is expired or invalid — force logout cleanly
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("username");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
