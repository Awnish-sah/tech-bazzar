import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  MapPin, 
  Star, 
  User, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Truck, 
  FileText, 
  Ban, 
  RotateCcw, 
  LogOut, 
  Home, 
  Building2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useShop } from '../../context/ShopContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { api } from '../../services/api';

export const UserDashboard = () => {
  const { 
    activeModal, 
    activeTab, 
    setActiveTab, 
    closeModal, 
    user, 
    logout, 
    addresses, 
    fetchAddresses,
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress,
    userOrders, 
    fetchOrders,
    openOrderDetails, 
    openTracking, 
    openInvoice, 
    openCancel, 
    openReturn,
    updateProfile,
    isLoading
  } = useUser();

  const { setQuickViewProduct } = useShop();

  // Orders Tab State
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Address Modal/Form State
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    title: 'Home',
    fullName: user?.name || '',
    phone: user?.phone || '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false
  });

  // User Reviews State
  const [userReviews, setUserReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Fetch reviews when Reviews tab is selected
  useEffect(() => {
    if (activeTab === 'reviews' && user?.id) {
      setIsLoadingReviews(true);
      api.getUserReviews(user.id)
        .then(res => {
          if (res.success && Array.isArray(res.data)) {
            setUserReviews(res.data);
          }
        })
        .catch(err => console.warn('Could not load user reviews:', err.message))
        .finally(() => setIsLoadingReviews(false));
    }
  }, [activeTab, user?.id]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  // Refresh orders and delivery addresses whenever the user dashboard modal opens
  useEffect(() => {
    if (activeModal === 'dashboard' && user?.id) {
      fetchOrders();
      fetchAddresses(user.id);
    }
  }, [activeModal, user?.id, fetchOrders, fetchAddresses]);

  if (activeModal !== 'dashboard' || !user) return null;

  // Filter Orders
  const filteredOrders = userOrders.filter(order => {
    // Status filter
    if (statusFilter === 'active' && !['Pending', 'Processing', 'Shipped'].includes(order.status)) {
      return false;
    }
    if (statusFilter === 'delivered' && order.status !== 'Delivered') {
      return false;
    }
    if (statusFilter === 'cancelled' && order.status !== 'Cancelled') {
      return false;
    }
    if (statusFilter === 'returns' && !['Return Requested', 'Returned'].includes(order.status)) {
      return false;
    }

    // Search filter
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = (order.id || '').toLowerCase().includes(q);
      const matchItems = (order.items || []).some(item => (item.name || '').toLowerCase().includes(q));
      const matchCourier = (order.courierName || '').toLowerCase().includes(q) || (order.trackingNumber || '').toLowerCase().includes(q);
      return matchId || matchItems || matchCourier;
    }

    return true;
  });

  // Address Form Actions
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressFormData({
      title: 'Home',
      fullName: user?.name || '',
      phone: user?.phone || '',
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      isDefault: addresses.length === 0
    });
    setIsAddressFormOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressFormData({
      title: addr.title || 'Home',
      fullName: addr.fullName || addr.recipientName || '',
      phone: addr.phone || '',
      streetAddress: addr.streetAddress || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || addr.zipCode || '',
      country: addr.country || 'United States',
      isDefault: Boolean(addr.isDefault)
    });
    setIsAddressFormOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (editingAddressId) {
      await updateAddress(editingAddressId, addressFormData);
    } else {
      await addAddress(addressFormData);
    }
    await fetchAddresses(user.id);
    setIsAddressFormOpen(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const res = await updateProfile({ name: profileName, phone: profilePhone });
    if (res.success) {
      setProfileSuccess('Profile saved successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-5xl h-[88vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/50">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                alt={user.name} 
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-600/30"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email} • {addresses.length} Saved Addresses • {userOrders.length} Orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
            <button 
              onClick={closeModal}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 bg-white dark:bg-slate-900 overflow-x-auto">
          {[
            { id: 'orders', label: 'My Orders', icon: Package, badge: userOrders.length },
            { id: 'addresses', label: 'Addresses', icon: MapPin, badge: addresses.length },
            { id: 'reviews', label: 'My Reviews', icon: Star, badge: userReviews.length },
            { id: 'profile', label: 'Profile Settings', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold border-b-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50">
          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID, Product, or Tracking #"
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {orderSearch && (
                    <button onClick={() => setOrderSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Pills Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'active', label: 'Active / In Transit' },
                    { id: 'delivered', label: 'Delivered' },
                    { id: 'cancelled', label: 'Cancelled' },
                    { id: 'returns', label: 'Returns' }
                  ].map(pill => (
                    <button
                      key={pill.id}
                      onClick={() => setStatusFilter(pill.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        statusFilter === pill.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No orders found
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    {orderSearch || statusFilter !== 'all' 
                      ? 'Try adjusting your search query or filters to find what you are looking for.' 
                      : 'You have not placed any orders yet. Explore our catalog and place your first order!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => {
                    const isDelivered = order.status === 'Delivered';
                    const isCancellable = ['Pending', 'Processing'].includes(order.status);
                    const isReturnable = isDelivered && order.status !== 'Returned' && order.status !== 'Return Requested';

                    return (
                      <div 
                        key={order.id}
                        className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                      >
                        {/* Order Card Top Bar */}
                        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-bold text-slate-900 dark:text-white">
                              #{order.id}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 dark:text-slate-400">
                              {formatDate(order.date || order.createdAt)}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                              order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400' :
                              order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                              order.status.includes('Return') ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400' :
                              'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            }`}>
                              {order.status}
                            </span>
                            {order.status === 'Cancelled' && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.cancelAcknowledged
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              }`}>
                                {order.cancelAcknowledged ? '✓ Admin Acknowledged' : '• Awaiting Admin Review'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 font-semibold">
                            <span className="text-slate-500 dark:text-slate-400">Total:</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            {(order.items || []).slice(0, 3).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <img 
                                  src={item.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=100&q=80'} 
                                  alt={item.name} 
                                  className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-sm">
                                    {item.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    Qty: {item.quantity} × {formatCurrency(item.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {(order.items || []).length > 3 && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                + {(order.items || []).length - 3} more items
                              </p>
                            )}
                          </div>

                          {/* Tracking & Courier Status Pill */}
                          <div className="w-full md:w-auto bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs shrink-0">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                              <Truck className="w-3.5 h-3.5 text-blue-500" />
                              <span>{order.courierName || 'FedEx Express'}</span>
                            </div>
                            <p className="font-mono text-[11px] text-slate-500 mt-1">
                              {order.trackingNumber || `FDX-${order.id.replace(/[^0-9]/g, '').slice(0, 8)}-US`}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {order.status === 'Delivered' 
                                ? `Delivered: ${formatDate(order.deliveredAt || order.date)}`
                                : `Est: ${order.estimatedDelivery ? formatDate(order.estimatedDelivery) : '2-4 Days'}`}
                            </p>
                          </div>
                        </div>

                        {/* Order Actions Bottom Bar */}
                        <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openTracking(order)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 font-semibold transition-colors"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Track Shipment</span>
                            </button>

                            <button
                              onClick={() => openInvoice(order)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-500" />
                              <span>Invoice</span>
                            </button>

                            <button
                              onClick={() => openOrderDetails(order)}
                              className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors"
                            >
                              View Details
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {isCancellable && (
                              <button
                                onClick={() => openCancel(order)}
                                className="px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-semibold transition-colors"
                              >
                                Cancel Order
                              </button>
                            )}
                            {isReturnable && (
                              <button
                                onClick={() => openReturn(order)}
                                className="px-3 py-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg font-semibold transition-colors"
                              >
                                Return Item
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESS BOOK */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Delivery Addresses
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage multiple shipping destinations for fast 1-click checkout.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddAddress}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <div 
                    key={addr.id}
                    className={`relative p-5 rounded-2xl bg-white dark:bg-slate-850 border transition-all ${
                      addr.isDefault 
                        ? 'border-blue-500 shadow-sm ring-1 ring-blue-500/20' 
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {/* Address Type & Default Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {addr.title?.toLowerCase() === 'home' ? (
                          <Home className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Building2 className="w-4 h-4 text-purple-500" />
                        )}
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {addr.title || 'Address'}
                        </span>
                      </div>

                      {addr.isDefault ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          DEFAULT
                        </span>
                      ) : (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[11px] text-slate-400 hover:text-blue-600 font-semibold"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                      <p className="font-semibold text-slate-900 dark:text-white">{addr.fullName || addr.recipientName}</p>
                      <p>{addr.streetAddress}</p>
                      <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postalCode || addr.zipCode}</p>
                      <p>{addr.country || 'United States'}</p>
                      <p className="text-slate-400 pt-1">Phone: {addr.phone}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 text-xs">
                      <button
                        onClick={() => handleOpenEditAddress(addr)}
                        className="flex items-center gap-1 text-slate-500 hover:text-blue-600 font-medium"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      {addresses.length > 1 && (
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="flex items-center gap-1 text-rose-500 hover:text-rose-700 font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add / Edit Address Form Modal */}
              {isAddressFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                  <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {editingAddressId ? 'Edit Address' : 'Add New Address'}
                      </h3>
                      <button onClick={() => setIsAddressFormOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Address Label</label>
                          <select
                            value={addressFormData.title}
                            onChange={(e) => setAddressFormData({ ...addressFormData, title: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                          >
                            <option value="Home">Home</option>
                            <option value="Work / Office">Work / Office</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Full Name *</label>
                          <input
                            type="text"
                            value={addressFormData.fullName}
                            onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                            required
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            value={addressFormData.phone}
                            onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                            required
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Country</label>
                          <input
                            type="text"
                            value={addressFormData.country}
                            onChange={(e) => setAddressFormData({ ...addressFormData, country: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Street Address & Apartment *</label>
                        <input
                          type="text"
                          value={addressFormData.streetAddress}
                          onChange={(e) => setAddressFormData({ ...addressFormData, streetAddress: e.target.value })}
                          required
                          placeholder="House / Flat #, Street name"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">City *</label>
                          <input
                            type="text"
                            value={addressFormData.city}
                            onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                            required
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">State</label>
                          <input
                            type="text"
                            value={addressFormData.state}
                            onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Postal Code *</label>
                          <input
                            type="text"
                            value={addressFormData.postalCode}
                            onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                            required
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="isDefaultCheck"
                          checked={addressFormData.isDefault}
                          onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isDefaultCheck" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                          Set as default delivery address
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setIsAddressFormOpen(false)}
                          className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  My Product Reviews & Ratings
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reviews and feedback you have shared with the TechBazzar community.
                </p>
              </div>

              {isLoadingReviews ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  Loading your reviews...
                </div>
              ) : userReviews.length === 0 ? (
                <div className="py-16 text-center bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Star className="w-12 h-12 mx-auto text-amber-300 dark:text-amber-500/40 mb-3" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No reviews yet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    You can rate and write reviews for any product in your delivered orders or directly from product pages!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userReviews.map((rev, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-start gap-4"
                    >
                      <img 
                        src={rev.productImage || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&q=80'} 
                        alt={rev.productName} 
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {rev.productName}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            {formatDate(rev.createdAt)}
                          </span>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1 my-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating 
                                  ? 'text-amber-400 fill-amber-400' 
                                  : 'text-slate-200 dark:text-slate-700'
                              }`} 
                            />
                          ))}
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                            {rev.rating}/5
                          </span>
                        </div>

                        {rev.title && (
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                            "{rev.title}"
                          </p>
                        )}
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          {rev.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="max-w-xl space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Account Profile
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your personal information, phone number, and security preferences.
                </p>
              </div>

              {profileSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400">Primary email cannot be modified directly</span>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition-all active:scale-[0.98]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Active Session</p>
                  <p className="text-[11px] text-slate-500">Signed in as {user.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                >
                  Sign Out of TechBazzar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
