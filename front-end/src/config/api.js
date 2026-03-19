const trimTrailingSlash = (value) => (value || "").replace(/\/+$/, "");

const normalizeApiBase = (value) => {
  const trimmed = trimTrailingSlash(value);
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const normalizeApiOrigin = (value) =>
  trimTrailingSlash(value).replace(/\/api$/, "");

const defaultApiOrigin =
  typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:8000";

export const API_ORIGIN = import.meta.env.DEV
  ? ""
  : normalizeApiOrigin(import.meta.env.VITE_API_URL || defaultApiOrigin);

// In dev, Vite proxy handles /api. In prod, normalize absolute API URLs.
export const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : normalizeApiBase(import.meta.env.VITE_API_URL || defaultApiOrigin);

export const CSRF_COOKIE_URL = import.meta.env.DEV
  ? "/sanctum/csrf-cookie"
  : `${API_ORIGIN}/sanctum/csrf-cookie`;

export const apiEndpoints = {
  login: `${API_BASE_URL}/login`,
  adminLogin: `${API_BASE_URL}/admin/login`,
  register: `${API_BASE_URL}/register`,
  adminRegister: `${API_BASE_URL}/admin/register`,
  logout: `${API_BASE_URL}/logout`,
  user: `${API_BASE_URL}/user`,
  userOrders: (userId) => `${API_BASE_URL}/users/${userId}/orders`,
  adminOrders: `${API_BASE_URL}/admin/orders`,
  orderTracking: (orderId) => `${API_BASE_URL}/orders/${orderId}/tracking`,
};

export default apiEndpoints;
