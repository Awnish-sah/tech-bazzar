import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useAdmin } from './AdminContext';
import { useUser } from './UserContext';
import { generateOrderId } from '../utils/formatters';
import { api } from '../services/api';

const ShopContext = createContext();

const STORAGE_KEY_CART = 'techbazzar_cart_v1';
const STORAGE_KEY_WISHLIST = 'techbazzar_wishlist_v1';
const STORAGE_KEY_CURRENCY = 'techbazzar_currency_v1';

export const ShopProvider = ({ children }) => {
  const { products, recordNewOrder } = useAdmin();
  const { user, fetchOrders, openAuth } = useUser();

  // Cart state - active only when signed in
  const [cart, setCart] = useState(() => {
    return user ? loadFromStorage(STORAGE_KEY_CART, []) : [];
  });

  // Wishlist state - active only when signed in
  const [wishlist, setWishlist] = useState(() => {
    return user ? loadFromStorage(STORAGE_KEY_WISHLIST, []) : [];
  });

  // Reset cart & wishlist immediately upon logout
  useEffect(() => {
    if (!user) {
      setCart([]);
      setWishlist([]);
      localStorage.removeItem(STORAGE_KEY_CART);
      localStorage.removeItem(STORAGE_KEY_WISHLIST);
    }
  }, [user]);

  // Currency
  const [currency, setCurrency] = useState(() => {
    return loadFromStorage(STORAGE_KEY_CURRENCY, 'USD');
  });

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync cart & wishlist when user is authenticated
  useEffect(() => {
    if (user) {
      saveToStorage(STORAGE_KEY_CART, cart);
    }
  }, [cart, user]);

  useEffect(() => {
    if (user) {
      saveToStorage(STORAGE_KEY_WISHLIST, wishlist);
    }
  }, [wishlist, user]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_CURRENCY, currency);
  }, [currency]);

  // Add to cart with auth verification
  const addToCart = (product, quantity = 1) => {
    if (!user) {
      addToast('🔒 Please sign in to add products to your cart!', 'info');
      if (openAuth) openAuth('login');
      return false;
    }

    if (product.stock <= 0) {
      addToast('Sorry, this product is currently out of stock!', 'error');
      return false;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    addToast(`Added "${product.name.slice(0, 30)}..." to your cart!`, 'success');
    return true;
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    addToast('Item removed from cart', 'info');
  };

  // Update quantity
  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const prod = products.find(p => p.id === productId);
    const maxStock = prod ? prod.stock : 99;
    const finalQty = Math.min(quantity, maxStock);

    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: finalQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist toggle with auth verification
  const toggleWishlist = (productId) => {
    if (!user) {
      addToast('🔒 Please sign in to save products to your wishlist!', 'info');
      if (openAuth) openAuth('login');
      return false;
    }

    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast('Saved to your wishlist!', 'success');
        return [...prev, productId];
      }
    });
    return true;
  };

  const isInWishlist = (productId) => Boolean(user && wishlist.includes(productId));

  // Apply Coupon
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'TECH10') {
      setAppliedCoupon({ code: 'TECH10', discountPercent: 10, label: '10% Off Electronics' });
      addToast('Coupon TECH10 applied! (10% discount)', 'success');
      return true;
    } else if (clean === 'SUPER50') {
      setAppliedCoupon({ code: 'SUPER50', discountFlat: 50, label: '$50 Flat Off' });
      addToast('Coupon SUPER50 applied! ($50 discount)', 'success');
      return true;
    } else {
      addToast('Invalid coupon code. Try TECH10 or SUPER50', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Computations
  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.salePrice || item.price;
    return acc + price * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountFlat) {
      discountAmount = Math.min(appliedCoupon.discountFlat, cartSubtotal);
    }
  }

  // Free shipping over $1000 or $25 flat
  const isFreeShipping = cartSubtotal >= 1000 || cartSubtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 25;
  const estimatedTax = Math.round((cartSubtotal - discountAmount) * 0.08); // 8% sales tax
  const cartFinalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + estimatedTax);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Complete Checkout
  const handlePlaceOrder = async (customerData, paymentMethod) => {
    const newOrder = {
      id: generateOrderId(),
      userId: user?.id || null,
      date: new Date().toISOString(),
      customer: customerData,
      paymentMethod,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingFee,
      tax: estimatedTax,
      total: cartFinalTotal,
      status: 'Processing'
    };

    recordNewOrder(newOrder);
    setLastPlacedOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setIsOrderConfirmationOpen(true);
    addToast('🎉 Order placed successfully!', 'success');

    // Persist to PostgreSQL database asynchronously
    try {
      await api.createOrder(newOrder);
      if (user?.id && fetchOrders) {
        fetchOrders();
      }
    } catch (err) {
      console.warn('Order saved locally (PostgreSQL sync offline):', err.message);
    }
  };

  return (
    <ShopContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartSubtotal,
      discountAmount,
      shippingFee,
      estimatedTax,
      cartFinalTotal,
      cartCount,
      isFreeShipping,
      wishlist,
      toggleWishlist,
      isInWishlist,
      currency,
      setCurrency,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      selectedBrand,
      setSelectedBrand,
      priceRange,
      setPriceRange,
      sortBy,
      setSortBy,
      quickViewProduct,
      setQuickViewProduct,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isOrderConfirmationOpen,
      setIsOrderConfirmationOpen,
      isAdminModalOpen,
      setIsAdminModalOpen,
      lastPlacedOrder,
      handlePlaceOrder,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
