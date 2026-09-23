/**
 * TechBazzar API Client
 * Connects the React Storefront & Admin Dashboard to the PostgreSQL Backend
 */

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';
const REQUEST_TIMEOUT_MS = 5000;

/**
 * Fetch wrapper with timeout and error handling
 */
const request = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API error (${res.status})`);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('API request timed out');
    }
    throw error;
  }
};

export const api = {
  /**
   * Health & Connection Status
   */
  checkHealth: async () => {
    try {
      const data = await request('/health');
      return {
        isAvailable: true,
        isDbConnected: Boolean(data?.database?.connected),
        database: data?.database
      };
    } catch (err) {
      return {
        isAvailable: false,
        isDbConnected: false,
        error: err.message
      };
    }
  },

  /**
   * Products Endpoints
   */
  getProducts: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.search) query.set('search', filters.search);
    if (filters.category && filters.category !== 'all') query.set('category', filters.category);
    if (filters.brand && filters.brand !== 'all') query.set('brand', filters.brand);
    if (filters.sort) query.set('sort', filters.sort);
    if (filters.minPrice) query.set('minPrice', filters.minPrice);
    if (filters.maxPrice) query.set('maxPrice', filters.maxPrice);

    const queryString = query.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return request(endpoint);
  },

  getProductById: async (id) => {
    return request(`/products/${id}`);
  },

  createProduct: async (productData) => {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  updateProduct: async (id, productData) => {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  deleteProduct: async (id) => {
    return request(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  toggleStock: async (id) => {
    return request(`/products/${id}/stock`, {
      method: 'PATCH'
    });
  },

  resetDefaultCatalog: async () => {
    return request('/products/reset/default-catalog', {
      method: 'POST'
    });
  },

  /**
   * Orders Endpoints
   */
  getOrders: async () => {
    return request('/orders');
  },

  createOrder: async (orderData) => {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  updateOrderStatus: async (id, status) => {
    return request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  /**
   * Admin Endpoints
   */
  adminLogin: async (email, password) => {
    return request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  getAdminMetrics: async () => {
    return request('/admin/metrics');
  }
};

export default api;

