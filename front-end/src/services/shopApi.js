import axios from "axios";
import { API_BASE_URL, CSRF_COOKIE_URL } from "../config/api";

const defaultHeaders = {
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: defaultHeaders,
});

const csrfClient = axios.create({
  withCredentials: true,
  withXSRFToken: true,
  headers: defaultHeaders,
});

const normalizeProducts = (payload) => (Array.isArray(payload) ? payload : []);

export const initializeCsrfProtection = async () => {
  await csrfClient.get(CSRF_COOKIE_URL);
};

export const fetchCurrentUser = async () => {
  const response = await apiClient.get("/user");
  return response.data;
};

export const loginUser = async (payload) => {
  await initializeCsrfProtection();
  const response = await apiClient.post("/login", payload);
  return response.data;
};

export const loginAdmin = async (payload) => {
  await initializeCsrfProtection();
  const response = await apiClient.post("/admin/login", payload);
  return response.data;
};

export const registerUser = async (payload) => {
  await initializeCsrfProtection();
  const response = await apiClient.post("/register", payload);
  return response.data;
};

export const logoutUser = async () => {
  await initializeCsrfProtection();
  const response = await apiClient.post("/logout");
  return response.data;
};

export const fetchProducts = async () => {
  const response = await apiClient.get("/products");
  return normalizeProducts(response.data);
};

export const createProduct = async (payload) => {
  const formData = new FormData();

  Object.keys(payload).forEach((key) => {
    if (payload[key] !== null && payload[key] !== undefined) {
      formData.append(key, payload[key]);
    }
  });

  await initializeCsrfProtection();
  const response = await apiClient.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateProduct = async (id, payload) => {
  const formData = new FormData();
  formData.append("_method", "PUT");

  Object.keys(payload).forEach((key) => {
    if (payload[key] !== null && payload[key] !== undefined) {
      formData.append(key, payload[key]);
    }
  });

  await initializeCsrfProtection();
  const response = await apiClient.post(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteProduct = async (id) => {
  await initializeCsrfProtection();
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

export const createOrder = async (payload) => {
  await initializeCsrfProtection();
  const response = await apiClient.post("/orders", payload);
  return response.data;
};

export const fetchUserOrders = async (userId) => {
  const response = await apiClient.get(`/users/${userId}/orders`);
  return response.data;
};

export const fetchOrderTracking = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}/tracking`);
  return response.data;
};

export const updateOrderTracking = async (orderId, payload) => {
  await initializeCsrfProtection();
  const response = await apiClient.post(`/orders/${orderId}/tracking`, payload);
  return response.data;
};

export const fetchAdminOrders = async () => {
  const response = await apiClient.get("/admin/orders");
  return response.data;
};
