// Normalize API base so production always targets the /api namespace
const normalizeBase = (value) => {
  const trimmed = (value || '').replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

// In dev, Vite proxy handles /api; in prod, ensure /api is present even if env omits it
export const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : normalizeBase(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');

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
