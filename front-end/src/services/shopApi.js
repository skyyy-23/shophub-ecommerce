import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

const normalizeProducts = (payload) => {
  return Array.isArray(payload) ? payload : [];
};

export const fetchProducts = async () => {
  const response = await apiClient.get("/products");
  return normalizeProducts(response.data);
};

export const createProduct = async (payload, token = null) => {
  const formData = new FormData();
  Object.keys(payload).forEach(key => {
    if (payload[key] !== null && payload[key] !== undefined) {
      formData.append(key, payload[key]);
    }
  });

  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiClient.post("/products", formData, { headers });
  return response.data;
};

export const updateProduct = async (id, payload, token = null) => {
  const formData = new FormData();
  formData.append('_method', 'PUT');
  Object.keys(payload).forEach(key => {
    if (payload[key] !== null && payload[key] !== undefined) {
      formData.append(key, payload[key]);
    }
  });

  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiClient.post(`/products/${id}`, formData, { headers });
  return response.data;
};

export const deleteProduct = async (id, token = null) => {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiClient.delete(`/products/${id}`, { headers });
  return response.data;
};

export const createOrder = async (payload, token = null) => {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await apiClient.post("/orders", payload, { headers });
  return response.data;
};