import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { api } from '../services/api';

const UserContext = createContext();

const STORAGE_KEY_USER = 'techbazzar_user_session_v1';
const STORAGE_KEY_TOKEN = 'techbazzar_user_token_v1';
const STORAGE_KEY_ADDRESSES = 'techbazzar_user_addresses_v1';
const STORAGE_KEY_ORDERS = 'techbazzar_user_orders_v1';

export const DEMO_USER = {
  id: 1,
  name: 'Alex Rivera',
  email: 'user@techbazzar.com',
  phone: '+1 (555) 234-5678',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'user',
  createdAt: '2026-01-15T00:00:00Z'
};

const DEFAULT_ADDRESSES = [
  {
    id: 1,
    userId: 1,
    title: 'Home',
    fullName: 'Alex Rivera',
    phone: '+1 (555) 234-5678',
    streetAddress: '742 Evergreen Terrace, Apt 4B',
    city: 'Springfield',
    state: 'Oregon',
    postalCode: '97477',
    country: 'United States',
    isDefault: true
  },
  {
    id: 2,
    userId: 1,
    title: 'Tech Hub Office',
    fullName: 'Alex Rivera',
    phone: '+1 (555) 234-5678',
    streetAddress: '500 Silicon Way, Floor 3',
    city: 'Eugene',
    state: 'Oregon',
    postalCode: '97401',
    country: 'United States',
    isDefault: false
  }
];

export const UserProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(() => {
    return loadFromStorage(STORAGE_KEY_USER, DEMO_USER);
  });

  const [token, setToken] = useState(() => {
    return loadFromStorage(STORAGE_KEY_TOKEN, 'demo_jwt_token_alex');
  });

  const [addresses, setAddresses] = useState(() => {
    return loadFromStorage(STORAGE_KEY_ADDRESSES, DEFAULT_ADDRESSES);
  });

  const [userOrders, setUserOrders] = useState(() => {
    return loadFromStorage(STORAGE_KEY_ORDERS, []);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Modal State Management
  const [activeModal, setActiveModal] = useState(null); // 'auth', 'dashboard', 'orderDetails', 'tracking', 'invoice', 'cancel', 'return'
  const [modalData, setModalData] = useState(null);
  const [activeTab, setActiveTab] = useState('login'); // for auth or dashboard

  // Sync to local storage
  useEffect(() => {
    if (user) {
      saveToStorage(STORAGE_KEY_USER, user);
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      saveToStorage(STORAGE_KEY_TOKEN, token);
    }
  }, [token]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_ADDRESSES, addresses);
  }, [addresses]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_ORDERS, userOrders);
  }, [userOrders]);

  /**
   * Load User Addresses
   */
  const fetchAddresses = useCallback(async (userId) => {
    const targetId = userId || user?.id;
    if (!targetId) return;

    try {
      const res = await api.getAddresses(targetId);
      if (res.success && Array.isArray(res.data)) {
        setAddresses(res.data);
      }
    } catch (err) {
      console.warn('Addresses fetched from local storage (offline mode):', err.message);
    }
  }, [user]);

  /**
   * Load User Orders
   */
  const fetchOrders = useCallback(async (filters = {}) => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      const res = await api.getUserOrders(user.id, filters);
      if (res.success && Array.isArray(res.data)) {
        setUserOrders(res.data);
      }
    } catch (err) {
      console.warn('Orders fetched from local state (offline mode):', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load orders and addresses when user changes
  useEffect(() => {
    if (user?.id) {
      fetchAddresses(user.id);
      fetchOrders();
    }
  }, [user?.id, fetchAddresses, fetchOrders]);

  /**
   * Register User
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
        return { success: true, message: res.message || 'Account created successfully!' };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      // Local fallback for offline mode
      if (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('timed out')) {
        const fallbackUser = {
          id: Date.now(),
          name,
          email,
          phone: phone || '',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
          role: 'user',
          createdAt: new Date().toISOString()
        };
        setUser(fallbackUser);
        setToken(`mock_token_${Date.now()}`);
        closeModal();
        return { success: true, message: 'Account created in offline mode!' };
      }
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login User
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
        return { success: true, message: res.message || 'Logged in successfully!' };
      }
      throw new Error(res.message || 'Invalid credentials');
    } catch (err) {
      // Local fallback if offline or demo login
      if (email === 'user@techbazzar.com' && (password === 'password123' || !password)) {
        setUser(DEMO_USER);
        setToken('demo_jwt_token_alex');
        closeModal();
        return { success: true, message: 'Logged in as Demo User!' };
      }
      if (err.message.includes('fetch') || err.message.includes('timed out')) {
        // Fallback demo user
        setUser(DEMO_USER);
        setToken('demo_jwt_token_alex');
        closeModal();
        return { success: true, message: 'Connected in local mode!' };
      }
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 1-Click SSO Login (Google / GitHub)
   */
  const ssoLogin = async (provider = 'google') => {
    setIsLoading(true);
    setAuthError(null);

    const ssoProfiles = {
      google: {
        provider: 'google',
        email: 'alex.rivera.google@gmail.com',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        providerId: 'google-oauth2-1082749281'
      },
      github: {
        provider: 'github',
        email: 'alex.rivera.dev@github.com',
        name: 'Alex Rivera (Dev)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        providerId: 'gh-user-94729104'
      }
    };

    const ssoPayload = ssoProfiles[provider] || ssoProfiles.google;

    try {
      const res = await api.ssoLogin(ssoPayload);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        closeModal();
        return { success: true, message: `Signed in with ${provider.toUpperCase()}!` };
      }
      throw new Error(res.message || 'SSO sign-in failed');
    } catch (err) {
      // Local fallback
      const fallbackUser = {
        id: provider === 'google' ? 1 : 2,
        name: ssoPayload.name,
        email: ssoPayload.email,
        phone: '+1 (555) 234-5678',
        avatar: ssoPayload.avatar,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      setUser(fallbackUser);
      setToken(`sso_mock_${provider}_${Date.now()}`);
      closeModal();
      return { success: true, message: `Connected with ${provider.toUpperCase()} (Offline mode)!` };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout User
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setUserOrders([]);
    closeModal();
  };

  /**
   * Update Profile
   */
  const updateProfile = async (profileData) => {
    if (!user) return { success: false, error: 'Not logged in' };
    setIsLoading(true);

    try {
      const res = await api.updateProfile(user.id, profileData);
      if (res.success && res.data) {
        setUser(prev => ({ ...prev, ...res.data }));
        return { success: true, message: 'Profile updated successfully!' };
      }
      throw new Error(res.message || 'Failed to update profile');
    } catch (err) {
      // Offline fallback
      setUser(prev => ({ ...prev, ...profileData }));
      return { success: true, message: 'Profile updated locally!' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add Address
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
      // Fallback
      const newAddress = {
        id: Date.now(),
        userId: user.id,
        ...addressData,
        isDefault: addressData.isDefault || addresses.length === 0
      };
      setAddresses(prev => {
        if (newAddress.isDefault) {
          return [...prev.map(a => ({ ...a, isDefault: false })), newAddress];
        }
        return [...prev, newAddress];
      });
      return { success: true, data: newAddress };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update Address
   */
  const updateAddress = async (addressId, addressData) => {
    setIsLoading(true);
    try {
      const res = await api.updateAddress(addressId, addressData);
      if (res.success && res.data) {
        await fetchAddresses(user.id);
        return { success: true, data: res.data };
      }
      throw new Error(res.message || 'Failed to update address');
    } catch (err) {
      setAddresses(prev => prev.map(a => a.id === addressId ? { ...a, ...addressData } : a));
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete Address
   */
  const deleteAddress = async (addressId) => {
    setIsLoading(true);
    try {
      const res = await api.deleteAddress(addressId);
      if (res.success) {
        setAddresses(prev => prev.filter(a => a.id !== addressId));
        return { success: true };
      }
      throw new Error(res.message || 'Failed to delete address');
    } catch (err) {
      setAddresses(prev => prev.filter(a => a.id !== addressId));
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Set Default Address
   */
  const setDefaultAddress = async (addressId) => {
    try {
      await api.setDefaultAddress(addressId, user.id);
      await fetchAddresses(user.id);
    } catch (err) {
      setAddresses(prev => prev.map(a => ({
        ...a,
        isDefault: a.id === addressId
      })));
    }
  };

  /**
   * Cancel Order
   */
  const cancelOrder = async (orderId, reason = 'Customer requested cancellation') => {
    setIsLoading(true);
    try {
      const res = await api.cancelOrder(orderId, { reason });
      if (res.success) {
        setUserOrders(prev => prev.map(o => o.id === orderId ? {
          ...o,
          status: 'Cancelled',
          cancelReason: reason,
          cancelledAt: new Date().toISOString()
        } : o));
        return { success: true, message: res.message || 'Order cancelled successfully' };
      }
      throw new Error(res.message || 'Cancellation rejected');
    } catch (err) {
      // Local fallback
      setUserOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        status: 'Cancelled',
        cancelReason: reason,
        cancelledAt: new Date().toISOString()
      } : o));
      return { success: true, message: 'Order marked as cancelled' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Return Order
   */
  const returnOrder = async (orderId, reason, comments) => {
    setIsLoading(true);
    try {
      const res = await api.returnOrder(orderId, { reason, comments });
      if (res.success) {
        setUserOrders(prev => prev.map(o => o.id === orderId ? {
          ...o,
          status: 'Return Requested',
          returnReason: reason,
          returnComments: comments,
          returnStatus: 'Requested',
          returnRequestedAt: new Date().toISOString()
        } : o));
        return { success: true, message: res.message || 'Return request submitted successfully' };
      }
      throw new Error(res.message || 'Return request failed');
    } catch (err) {
      // Local fallback
      setUserOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        status: 'Return Requested',
        returnReason: reason,
        returnComments: comments,
        returnStatus: 'Requested',
        returnRequestedAt: new Date().toISOString()
      } : o));
      return { success: true, message: 'Return request recorded' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Submit Review
   */
  const submitReview = async ({ productId, rating, title, comment }) => {
    try {
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
    } catch (err) {
      return {
        success: true,
        message: 'Review saved locally! Thank you for your feedback.',
        data: {
          id: Date.now(),
          productId,
          userName: user?.name || 'Customer',
          rating,
          title,
          comment,
          verifiedPurchase: true,
          createdAt: new Date().toISOString()
        }
      };
    }
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
    fetchAddresses();
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
