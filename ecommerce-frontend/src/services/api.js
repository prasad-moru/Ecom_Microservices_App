import axios from 'axios';

// Base URL for API calls
const API_URL = 'http://localhost:8222'; // Your API Gateway URL

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service methods
const api = {
  // Product service
  getProducts: () => apiClient.get('/api/v1/products'),
  getProduct: (id) => apiClient.get(`/api/v1/products/${id}`),
  purchaseProducts: (data) => apiClient.post('/api/v1/products/purchase', data),
  
  // Customer service
  registerCustomer: (data) => apiClient.post('/api/v1/customers', data),
  loginCustomer: (data) => apiClient.post('/api/v1/customers/login', data),
  getCustomer: (id) => apiClient.get(`/api/v1/customers/${id}`),
  updateCustomer: (data) => apiClient.put('/api/v1/customers', data),
  
  // Order service
  createOrder: (data) => apiClient.post('/api/v1/orders', data),
  getOrders: () => apiClient.get('/api/v1/orders'),
  getOrder: (id) => apiClient.get(`/api/v1/orders/${id}`),
  
  // Payment service
  processPayment: (data) => apiClient.post('/api/v1/payments', data),
};

export default api;