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

  getUserOrders: async (userId, filters = {}) => {
    const query = new URLSearchParams();
    if (filters.search) query.set('search', filters.search);
    if (filters.status && filters.status !== 'all') query.set('status', filters.status);
    const queryString = query.toString();
    return request(`/orders/user/${userId}${queryString ? `?${queryString}` : ''}`);
  },

  getOrderTracking: async (orderId) => {
    return request(`/orders/${orderId}/tracking`);
  },

  getOrderInvoice: async (orderId) => {
    return request(`/orders/${orderId}/invoice`);
  },

  cancelOrder: async (orderId, { reason } = {}) => {
    return request(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  },

  returnOrder: async (orderId, { reason, comments } = {}) => {
    return request(`/orders/${orderId}/return`, {
      method: 'POST',
      body: JSON.stringify({ reason, comments })
    });
  },

  /**
   * User Authentication Endpoints
   */
  register: async (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  login: async (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  ssoLogin: async (ssoData) => {
    return request('/auth/sso', {
      method: 'POST',
      body: JSON.stringify(ssoData)
    });
  },

  getMe: async (token) => {
    return request('/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },

  updateProfile: async (userId, profileData) => {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ userId, ...profileData })
    });
  },

  /**
   * Address Book Endpoints
   */
  getAddresses: async (userId) => {
    return request(`/users/addresses?userId=${userId}`);
  },

  addAddress: async (addressData) => {
    return request('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });
  },

  updateAddress: async (addressId, addressData) => {
    return request(`/users/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    });
  },

  deleteAddress: async (addressId) => {
    return request(`/users/addresses/${addressId}`, {
      method: 'DELETE'
    });
  },

  setDefaultAddress: async (addressId, userId) => {
    return request(`/users/addresses/${addressId}/default`, {
      method: 'PATCH',
      body: JSON.stringify({ userId })
    });
  },

  /**
   * Reviews & Ratings Endpoints
   */
  getProductReviews: async (productId) => {
    return request(`/reviews/product/${productId}`);
  },

  getUserReviews: async (userId) => {
    return request(`/reviews/user/${userId}`);
  },

  createReview: async (reviewData) => {
    return request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
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


