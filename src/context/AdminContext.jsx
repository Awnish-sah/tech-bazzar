import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultProducts } from '../data/defaultProducts';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { api } from '../services/api';

const AdminContext = createContext();

const STORAGE_KEY_PRODUCTS = 'techbazzar_products_v1';
const STORAGE_KEY_ORDERS = 'techbazzar_orders_v1';
const STORAGE_KEY_AUTH = 'techbazzar_admin_auth_v1';

const INITIAL_ORDERS = [
  {
    id: 'TB-847291-3012',
    date: '2026-09-22T14:32:00Z',
    customer: {
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Springfield, OR'
    },
    items: [
      {
        id: 'prod-1',
        name: 'Apple MacBook Pro 16" (M3 Max, 64GB, 1TB SSD)',
        price: 3199,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'prod-3',
        name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
        price: 329,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
      }
    ],
    total: 3528,
    paymentMethod: 'Credit Card',
    status: 'Delivered'
  },
  {
    id: 'TB-921473-8941',
    date: '2026-09-23T08:15:00Z',
    customer: {
      name: 'Sophia Chen',
      email: 'sophia.chen@example.com',
      phone: '+1 (555) 987-6543',
      address: '120 Market Street, Suite 400, San Francisco, CA'
    },
    items: [
      {
        id: 'prod-7',
        name: 'Apple iPhone 16 Pro (Titanium Black, 256GB)',
        price: 999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80'
      }
    ],
    total: 999,
    paymentMethod: 'UPI / Wallet',
    status: 'Processing'
  }
];

export const AdminProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return loadFromStorage(STORAGE_KEY_AUTH, false);
  });

  const [products, setProducts] = useState(() => {
    return loadFromStorage(STORAGE_KEY_PRODUCTS, defaultProducts);
  });

  const [orders, setOrders] = useState(() => {
    return loadFromStorage(STORAGE_KEY_ORDERS, []);
  });

  // DB Connection status: 'checking', 'connected', 'fallback'
  const [dbConnectionStatus, setDbConnectionStatus] = useState('checking');
  const [dbDetails, setDbDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync products cache to storage
  useEffect(() => {
    saveToStorage(STORAGE_KEY_PRODUCTS, products);
  }, [products]);

  // Sync orders cache to storage
  useEffect(() => {
    saveToStorage(STORAGE_KEY_ORDERS, orders);
  }, [orders]);

  // Sync auth
  useEffect(() => {
    saveToStorage(STORAGE_KEY_AUTH, isAdminLoggedIn);
  }, [isAdminLoggedIn]);

  // Fetch initial data from PostgreSQL if connected
  const refreshFromDb = useCallback(async () => {
    setIsLoading(true);
    try {
      const health = await api.checkHealth();
      if (health.isDbConnected) {
        setDbConnectionStatus('connected');
        setDbDetails(health.database);

        // Fetch products and orders concurrently
        const [prodRes, orderRes] = await Promise.all([
          api.getProducts().catch(() => null),
          api.getOrders().catch(() => null)
        ]);

        if (prodRes && Array.isArray(prodRes.data)) {
          setProducts(prodRes.data);
        }

        if (orderRes && Array.isArray(orderRes.data)) {
          setOrders(orderRes.data);
        }
      } else {
        setDbConnectionStatus('fallback');
        setDbDetails(health.database || { error: health.error || 'Server offline' });
      }
    } catch (err) {
      setDbConnectionStatus('fallback');
      setDbDetails({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFromDb();
  }, [refreshFromDb]);

  // Admin login authentication
  const loginAdmin = async (email, password) => {
    if (dbConnectionStatus === 'connected') {
      try {
        const res = await api.adminLogin(email, password);
        if (res.success) {
          setIsAdminLoggedIn(true);
          return { success: true };
        }
      } catch (err) {
        // Fallback to local check if API threw error
      }
    }

    // Default admin credentials fallback
    if (email.trim().toLowerCase() === 'admin@techbazzar.com' && password === 'admin123') {
      setIsAdminLoggedIn(true);
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password. Use demo credentials: admin@techbazzar.com / admin123' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  // Add new product
  const addProduct = async (productData) => {
    const tempId = `prod-${Date.now()}`;
    const newProduct = {
      ...productData,
      id: productData.id || tempId,
      rating: 5.0,
      reviewsCount: 1,
      sku: productData.sku || `TB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      images: productData.images && productData.images.length > 0
        ? productData.images
        : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80']
    };

    // Optimistically update local state
    setProducts(prev => [newProduct, ...prev]);

    // Send to PostgreSQL if connected
    if (dbConnectionStatus === 'connected') {
      try {
        const res = await api.createProduct(newProduct);
        if (res.data) {
          setProducts(prev => prev.map(p => p.id === newProduct.id ? res.data : p));
        }
      } catch (err) {
        console.warn('Could not persist product to PostgreSQL:', err.message);
      }
    }

    return newProduct;
  };

  // Update existing product
  const updateProduct = async (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    }));

    if (dbConnectionStatus === 'connected') {
      try {
        await api.updateProduct(id, updatedFields);
      } catch (err) {
        console.warn('Could not update product in PostgreSQL:', err.message);
      }
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));

    if (dbConnectionStatus === 'connected') {
      try {
        await api.deleteProduct(id);
      } catch (err) {
        console.warn('Could not delete product in PostgreSQL:', err.message);
      }
    }
  };

  // Toggle stock
  const toggleStock = async (id) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, stock: p.stock > 0 ? 0 : 15 };
      }
      return p;
    }));

    if (dbConnectionStatus === 'connected') {
      try {
        await api.toggleStock(id);
      } catch (err) {
        console.warn('Could not toggle stock in PostgreSQL:', err.message);
      }
    }
  };

  // Add customer order
  const recordNewOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    }));

    if (dbConnectionStatus === 'connected') {
      try {
        await api.updateOrderStatus(orderId, newStatus);
      } catch (err) {
        console.warn('Could not update order status in PostgreSQL:', err.message);
      }
    }
  };

  // Reset to default catalog
  const resetToDefaultCatalog = async () => {
    if (dbConnectionStatus === 'connected') {
      try {
        const res = await api.resetDefaultCatalog();
        if (res.data) {
          setProducts(res.data);
          saveToStorage(STORAGE_KEY_PRODUCTS, res.data);
          return;
        }
      } catch (err) {
        console.warn('Could not reset PostgreSQL catalog:', err.message);
      }
    }

    setProducts(defaultProducts);
    saveToStorage(STORAGE_KEY_PRODUCTS, defaultProducts);
  };

  return (
    <AdminContext.Provider value={{
      isAdminLoggedIn,
      loginAdmin,
      logoutAdmin,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleStock,
      orders,
      recordNewOrder,
      updateOrderStatus,
      resetToDefaultCatalog,
      dbConnectionStatus,
      dbDetails,
      refreshFromDb,
      isLoading
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
