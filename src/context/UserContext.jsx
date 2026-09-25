import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { api } from '../services/api';

const UserContext = createContext();

const STORAGE_KEY_USER = 'techbazzar_user_session_v1';
const STORAGE_KEY_TOKEN = 'techbazzar_user_token_v1';

export const UserProvider = ({ children }) => {
  // User state: initializes to null unless explicitly logged in
  const [user, setUser] = useState(() => {
    return loadFromStorage(STORAGE_KEY_USER, null);
  });

  const [token, setToken] = useState(() => {
    return loadFromStorage(STORAGE_KEY_TOKEN, null);
  });

  const [addresses, setAddresses] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Modal State Management
  const [activeModal, setActiveModal] = useState(null); // 'auth', 'dashboard', 'orderDetails', 'tracking', 'invoice', 'cancel', 'return'
  const [modalData, setModalData] = useState(null);
  const [activeTab, setActiveTab] = useState('login'); // for auth or dashboard

  // Sync user session to localStorage ONLY when logged in; remove on logout
  useEffect(() => {
    if (user && token) {
      saveToStorage(STORAGE_KEY_USER, user);
      saveToStorage(STORAGE_KEY_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }, [user, token]);

  /**
   * Load User Addresses from PostgreSQL DB
   */
  const fetchAddresses = useCallback(async (userId) => {
    const targetId = userId || user?.id;
    if (!targetId) {
      setAddresses([]);
      return;
    }

    try {
      const res = await api.getAddresses(targetId);
      if (res.success && Array.isArray(res.data)) {
        setAddresses(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch addresses from PostgreSQL:', err.message);
    }
  }, [user?.id]);

  /**
   * Load User Orders from PostgreSQL DB
   */
  const fetchOrders = useCallback(async (filters = {}) => {
    if (!user?.id) {
      setUserOrders([]);
      return;
    }
    setIsLoading(true);

    try {
      const res = await api.getUserOrders(user.id, filters);
      if (res.success && Array.isArray(res.data)) {
        setUserOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders from PostgreSQL:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Load orders and addresses from DB when user logs in
  useEffect(() => {
    if (user?.id) {
      fetchAddresses(user.id);
      fetchOrders();
    } else {
      setAddresses([]);
      setUserOrders([]);
    }
  }, [user?.id, fetchAddresses, fetchOrders]);

  /**
   * Register User in PostgreSQL DB
   */
  const register = async ({ name, email, password, phone }) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await api.register({ name, email, password, phone });
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        closeModal();
        return { success: true, message: res.message || 'Account registered in PostgreSQL!' };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login User against PostgreSQL DB
   */
  const login = async ({ email, password }) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        closeModal();
        return { success: true, message: res.message || 'Signed in successfully!' };
      }
      throw new Error(res.message || 'Invalid email or password');
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Google SSO Login against PostgreSQL DB
   */
  const ssoLogin = async ({ email, name, avatar }) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const ssoPayload = {
        provider: 'google',
        email: email.trim().toLowerCase(),
        name: name.trim(),
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
        providerId: `google_${email.trim().toLowerCase()}`
      };

      const res = await api.ssoLogin(ssoPayload);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        closeModal();
        return { success: true, message: `Signed in with Google as ${res.data.user.name}!` };
      }
      throw new Error(res.message || 'Google SSO sign-in failed');
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout User completely & clear session
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setAddresses([]);
    setUserOrders([]);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem('techbazzar_user_addresses_v1');
    localStorage.removeItem('techbazzar_user_orders_v1');
    localStorage.removeItem('techbazzar_cart_v1');
    localStorage.removeItem('techbazzar_wishlist_v1');
    closeModal();
  };

  /**
   * Update Profile in PostgreSQL DB
   */
  const updateProfile = async (profileData) => {
    if (!user) return { success: false, error: 'Not logged in' };
    setIsLoading(true);

    try {
      const res = await api.updateProfile(user.id, profileData);
      if (res.success && res.data) {
        const updatedUser = { ...user, ...res.data };
        setUser(updatedUser);
        saveToStorage(STORAGE_KEY_USER, updatedUser);
        return { success: true, message: 'Profile updated in PostgreSQL!' };
      }
      throw new Error(res.message || 'Failed to update profile');
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add Address to PostgreSQL DB
   */
  const addAddress = async (addressData) => {
    if (!user) return { success: false, error: 'Not logged in' };
    setIsLoading(true);

    try {
      const res = await api.addAddress({ ...addressData, userId: user.id });
      if (res.success && res.data) {
        await fetchAddresses(user.id);
        return { success: true, data: res.data };
      }
      throw new Error(res.message || 'Failed to add address');
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update Address in PostgreSQL DB
   */
  const updateAddress = async (addressId, addressData) => {
    setIsLoading(true);
    try {
      const res = await api.updateAddress(addressId, { ...addressData, userId: user.id });
      if (res.success && res.data) {
        await fetchAddresses(user.id);
        return { success: true, data: res.data };
      }
      throw new Error(res.message || 'Failed to update address');
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete Address from PostgreSQL DB
   */
  const deleteAddress = async (addressId) => {
    setIsLoading(true);
    try {
      const res = await api.deleteAddress(addressId);
      if (res.success) {
        await fetchAddresses(user.id);
        return { success: true };
      }
      throw new Error(res.message || 'Failed to delete address');
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Set Default Address in PostgreSQL DB
   */
  const setDefaultAddress = async (addressId) => {
    try {
      await api.setDefaultAddress(addressId, user.id);
      await fetchAddresses(user.id);
    } catch (err) {
      console.error('Failed to set default address:', err.message);
    }
  };

  /**
   * Cancel Order in PostgreSQL DB
   */
  const cancelOrder = async (orderId, reason = 'Customer requested cancellation') => {
    setIsLoading(true);
    try {
      const res = await api.cancelOrder(orderId, { reason });
      if (res.success) {
        await fetchOrders();
        return { success: true, message: res.message || 'Order cancelled and inventory restocked' };
      }
      throw new Error(res.message || 'Cancellation rejected');
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Return Order in PostgreSQL DB
   */
  const returnOrder = async (orderId, reason, comments) => {
    setIsLoading(true);
    try {
      const res = await api.returnOrder(orderId, { reason, comments });
      if (res.success) {
        await fetchOrders();
        return { success: true, message: res.message || 'Return request submitted' };
      }
      throw new Error(res.message || 'Return request failed');
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Submit Product Review to PostgreSQL DB
   */
  const submitReview = async ({ productId, rating, title, comment }) => {
    const res = await api.createReview({
      productId,
      userId: user?.id || null,
      userName: user?.name || 'Verified Customer',
      userAvatar: user?.avatar || null,
      rating,
      title,
      comment
    });
    return res;
  };

  // Modal open helpers
  const openAuth = (tab = 'login') => {
    setActiveTab(tab);
    setActiveModal('auth');
    setAuthError(null);
  };

  const openDashboard = (tab = 'orders') => {
    if (!user) {
      openAuth('login');
      return;
    }
    setActiveTab(tab);
    setActiveModal('dashboard');
    fetchOrders();
    fetchAddresses(user.id);
  };

  const openOrderDetails = (order) => {
    setModalData(order);
    setActiveModal('orderDetails');
  };

  const openTracking = (order) => {
    setModalData(order);
    setActiveModal('tracking');
  };

  const openInvoice = (order) => {
    setModalData(order);
    setActiveModal('invoice');
  };

  const openCancel = (order) => {
    setModalData(order);
    setActiveModal('cancel');
  };

  const openReturn = (order) => {
    setModalData(order);
    setActiveModal('return');
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
    setAuthError(null);
  };

  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0] || null;

  return (
    <UserContext.Provider value={{
      user,
      token,
      isAuthenticated: Boolean(user),
      isLoading,
      authError,
      addresses,
      defaultAddress,
      userOrders,
      activeModal,
      modalData,
      activeTab,
      setActiveTab,
      openAuth,
      openDashboard,
      openOrderDetails,
      openTracking,
      openInvoice,
      openCancel,
      openReturn,
      closeModal,
      login,
      register,
      ssoLogin,
      logout,
      updateProfile,
      fetchAddresses,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      fetchOrders,
      cancelOrder,
      returnOrder,
      submitReview
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
