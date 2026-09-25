import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { useUser } from '../../context/UserContext';
import { formatPrice } from '../../utils/formatters';
import {
  X,
  CreditCard,
  ShieldCheck,
  Truck,
  Lock,
  CheckCircle,
  QrCode,
  MapPin,
  Sparkles,
  AlertCircle,
  Loader2,
  Download,
  Maximize2,
  ExternalLink,
  Info
} from 'lucide-react';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    estimatedTax,
    cartFinalTotal,
    currency,
    handlePlaceOrder
  } = useShop();

  const {
    user,
    addresses,
    defaultAddress,
    fetchAddresses,
    addAddress,
    setDefaultAddress,
    openAuth,
    openDashboard
  } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    addressTitle: 'Home',
    paymentRef: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [saveAddressToBook, setSaveAddressToBook] = useState(false);
  const [makeNewAddressDefault, setMakeNewAddressDefault] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Fonepay / Online QR');
  const [showFullQr, setShowFullQr] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvc: '888'
  });

  // Fetch latest addresses from PostgreSQL whenever Checkout modal opens
  useEffect(() => {
    if (isCheckoutOpen && user?.id) {
      fetchAddresses(user.id);
    }
  }, [isCheckoutOpen, user?.id, fetchAddresses]);

  // Sync default address or user info when available
  useEffect(() => {
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
      setSaveAddressToBook(false);
      setFormData(prev => ({
        ...prev,
        name: defaultAddress.fullName || defaultAddress.recipientName || user?.name || '',
        email: user?.email || prev.email || '',
        phone: defaultAddress.phone || user?.phone || '',
        address: defaultAddress.streetAddress || '',
        city: defaultAddress.city || '',
        postalCode: defaultAddress.postalCode || defaultAddress.zipCode || '',
        country: defaultAddress.country || 'United States'
      }));
    } else if (user) {
      setSaveAddressToBook(true);
      setMakeNewAddressDefault(true);
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name || '',
        email: user.email || prev.email || '',
        phone: user.phone || prev.phone || ''
      }));
    }
  }, [defaultAddress, user]);

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setSaveAddressToBook(false);
    setFormData(prev => ({
      ...prev,
      name: addr.fullName || addr.recipientName || user?.name || '',
      email: user?.email || prev.email || '',
      phone: addr.phone || user?.phone || '',
      address: addr.streetAddress || '',
      city: addr.city || '',
      postalCode: addr.postalCode || addr.zipCode || '',
      country: addr.country || 'United States'
    }));
    setFormErrors({});
  };

  const handleStartNewAddress = () => {
    setSelectedAddressId('new');
    setSaveAddressToBook(true);
    setMakeNewAddressDefault(addresses.length === 0);
    setFormData(prev => ({
      ...prev,
      name: user?.name || prev.name || '',
      phone: user?.phone || prev.phone || '',
      address: '',
      city: '',
      postalCode: '',
      addressTitle: 'Home'
    }));
    setFormErrors({});
  };

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters)';
    }

    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    if (!formData.phone.trim() || formData.phone.trim().replace(/\D/g, '').length < 7) {
      errors.phone = 'Please enter a valid phone number (at least 7 digits)';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errors.address = 'Please enter a full street address (at least 5 characters)';
    }

    if (!formData.city.trim() || formData.city.trim().length < 2) {
      errors.city = 'Please enter your city name';
    }

    if (!formData.postalCode.trim() || formData.postalCode.trim().length < 3) {
      errors.postalCode = 'Please enter a valid postal or ZIP code';
    }

    if (cart.length === 0) {
      errors.cart = 'Your cart is empty. Please add items before checking out.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Save new address to PostgreSQL Address Book if requested or if user has no saved addresses
      if (user && (saveAddressToBook || addresses.length === 0)) {
        await addAddress({
          title: formData.addressTitle || 'Home',
          fullName: formData.name.trim(),
          phone: formData.phone.trim(),
          streetAddress: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country || 'United States',
          isDefault: makeNewAddressDefault || addresses.length === 0
        });
      }

      const chosenMethod = paymentMethod === 'Fonepay / Online QR' && formData.paymentRef.trim()
        ? `Fonepay (${formData.paymentRef.trim()})`
        : paymentMethod;

      await handlePlaceOrder(formData, chosenMethod);
    } catch (err) {
      console.error('Order submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-[#0E1527] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden transition-colors duration-300">
          
          {/* Sticky Header */}
          <div className="shrink-0 p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0E1527] z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">
                  Secure TechBazzar Checkout
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct PostgreSQL order fulfillment & real-time inventory deduction
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <form onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 p-4 sm:p-6 items-start">
              
              {/* Left Column: Shipping & Payment (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Not Signed In Banner */}
                {!user && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span>Sign in to track orders, download invoices, and manage returns!</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setIsCheckoutOpen(false); if (openAuth) openAuth('login'); }}
                      className="font-bold underline hover:text-amber-900 dark:hover:text-white shrink-0 ml-2 cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                {/* Shipping Address */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>1. Delivery & Contact Details</span>
                    </div>
                    {user && (
                      <span className="text-[11px] font-normal text-slate-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-500" />
                        Signed in as {user.name}
                      </span>
                    )}
                  </h3>

                  {/* Saved Address Selector (Default & All User Addresses) */}
                  {user && (
                    <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                          <span>Saved Delivery Addresses ({addresses?.length || 0})</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleStartNewAddress}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                              selectedAddressId === 'new'
                                ? 'bg-cyan-600 text-white border-cyan-600'
                                : 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/10'
                            }`}
                          >
                            + Add / Use New Address
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCheckoutOpen(false);
                              if (openDashboard) openDashboard('addresses');
                            }}
                            className="text-[11px] font-semibold text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 underline cursor-pointer"
                          >
                            Manage Book
                          </button>
                        </div>
                      </div>

                      {addresses && addresses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {addresses.map((addr) => {
                            const isSelected = selectedAddressId === addr.id;
                            return (
                              <div
                                key={addr.id}
                                onClick={() => handleSelectAddress(addr)}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                                  isSelected
                                    ? 'bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/25 shadow-sm'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-cyan-400'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1 text-xs font-bold text-slate-900 dark:text-white">
                                  <div className="flex items-center gap-1.5">
                                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />}
                                    <span>{addr.title || 'Home'}</span>
                                  </div>

                                  {addr.isDefault ? (
                                    <span className="text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase bg-cyan-600 text-white">
                                      DEFAULT
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDefaultAddress(addr.id);
                                      }}
                                      className="text-[10px] font-semibold text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 underline cursor-pointer"
                                    >
                                      Set Default
                                    </button>
                                  )}
                                </div>

                                <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                                  <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                                    {addr.fullName || addr.recipientName}
                                  </p>
                                  <p className="truncate">{addr.streetAddress}</p>
                                  <p className="truncate">
                                    {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postalCode || addr.zipCode}
                                  </p>
                                  <p className="text-[10px] text-slate-400">Tel: {addr.phone}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          No saved addresses yet. Fill in your delivery details below and it will be automatically saved as your Default Address!
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Avanish Kumar"
                        className={`w-full bg-slate-50 dark:bg-[#131B2E] border rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none transition-colors ${
                          formErrors.name
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20'
                            : 'border-slate-300 dark:border-slate-700 focus:border-cyan-500 focus:bg-white'
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{formErrors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. avanish@example.com"
                        className={`w-full bg-slate-50 dark:bg-[#131B2E] border rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none transition-colors ${
                          formErrors.email
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20'
                            : 'border-slate-300 dark:border-slate-700 focus:border-cyan-500 focus:bg-white'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{formErrors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +1 (555) 000-0000"
                        className={`w-full bg-slate-50 dark:bg-[#131B2E] border rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none transition-colors ${
                          formErrors.phone
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20'
                            : 'border-slate-300 dark:border-slate-700 focus:border-cyan-500 focus:bg-white'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{formErrors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Street Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="e.g. 100 Innovation Way, Apt 4B"
                        className={`w-full bg-slate-50 dark:bg-[#131B2E] border rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none transition-colors ${
                          formErrors.address
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20'
                            : 'border-slate-300 dark:border-slate-700 focus:border-cyan-500 focus:bg-white'
                        }`}
                      />
                      {formErrors.address && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{formErrors.address}</span>
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. San Jose"
                        className={`w-full bg-slate-50 dark:bg-[#131B2E] border rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none transition-colors ${
                          formErrors.city
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20'
                            : 'border-slate-300 dark:border-slate-700 focus:border-cyan-500 focus:bg-white'
                        }`}
                      />
                      {formErrors.city && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{formErrors.city}</span>
                        </p>
                      )}
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Postal / ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="e.g. 95134"
                        className={`w-full bg-slate-50 dark:bg-[#131B2E] border rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none transition-colors ${
                          formErrors.postalCode
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20'
                            : 'border-slate-300 dark:border-slate-700 focus:border-cyan-500 focus:bg-white'
                        }`}
                      />
                      {formErrors.postalCode && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{formErrors.postalCode}</span>
                        </p>
                      )}
                    </div>

                    {/* Save to Address Book & Default Option for Signed-In User */}
                    {user && (
                      <div className="sm:col-span-2 pt-1 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                        <div className="flex flex-wrap items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-200 font-semibold">
                            <input
                              type="checkbox"
                              checked={saveAddressToBook}
                              onChange={(e) => setSaveAddressToBook(e.target.checked)}
                              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                            />
                            <span>Save this address to my Address Book</span>
                          </label>

                          {saveAddressToBook && (
                            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                              <input
                                type="checkbox"
                                checked={makeNewAddressDefault}
                                onChange={(e) => setMakeNewAddressDefault(e.target.checked)}
                                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                              />
                              <span>Set as Default Address</span>
                            </label>
                          )}
                        </div>

                        {saveAddressToBook && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-500">Label:</span>
                            <select
                              name="addressTitle"
                              value={formData.addressTitle}
                              onChange={handleChange}
                              className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
                            >
                              <option value="Home">Home</option>
                              <option value="Work / Office">Work / Office</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>2. Select Payment Option</span>
                    </div>
                    <span className="text-[11px] font-normal text-slate-400">
                      Total: <span className="font-bold text-slate-900 dark:text-white font-mono">{formatPrice(cartFinalTotal, currency)}</span>
                    </span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {[
                      { id: 'Fonepay / Online QR', name: 'Fonepay / QR Pay', badge: 'Instant QR' },
                      { id: 'Credit Card', name: 'Credit / Debit Card', badge: null },
                      { id: 'PayPal', name: 'PayPal Express', badge: null },
                      { id: 'Cash on Delivery', name: 'Cash on Delivery', badge: null }
                    ].map((method) => (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          paymentMethod === method.id
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-800 dark:text-white font-semibold shadow-sm ring-1 ring-cyan-500/30'
                            : 'bg-slate-50 dark:bg-[#131B2E] border-slate-200 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <span>{method.name}</span>
                          {method.badge && (
                            <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                              {method.badge}
                            </span>
                          )}
                        </div>
                        {paymentMethod === method.id && (
                          <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* FONEPAY QR PAYMENT VIEW (USER QR CODE INTEGRATION) */}
                  {paymentMethod === 'Fonepay / Online QR' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-[#131B2E] dark:to-[#0D1424] border border-cyan-500/30 shadow-sm space-y-4 text-xs">
                      
                      {/* Merchant Header Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-extrabold flex items-center justify-center text-xs tracking-tighter">
                            fpay
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">Fonepay Direct Merchant QR</p>
                            <p className="text-[10px] text-slate-500">Nepal Rastra Bank Approved Online Settlement</p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300 font-mono text-[11px] font-bold">
                          Pay: {formatPrice(cartFinalTotal, currency)}
                        </span>
                      </div>

                      {/* QR Display Card */}
                      <div className="flex flex-col sm:flex-row items-center gap-5 bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        
                        {/* High-res QR Flyer */}
                        <div className="relative group cursor-pointer shrink-0 flex flex-col items-center gap-1.5" onClick={() => setShowFullQr(true)}>
                          <div className="w-36 sm:w-40 bg-white p-2 rounded-xl border border-slate-200 shadow-md">
                            <img
                              src="/fonepay-qr.png"
                              alt="Fonepay QR Code - Avanish Kumar Sah"
                              className="w-full h-auto rounded-lg object-contain transition-transform group-hover:scale-[1.02]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setShowFullQr(true); }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                          >
                            <Maximize2 className="w-3 h-3" />
                            <span>Open Full QR Popup</span>
                          </button>
                        </div>

                        {/* Merchant Details & Instruction Steps */}
                        <div className="flex-1 space-y-2.5 text-left w-full">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Account Name</span>
                              <span className="font-bold text-slate-900 dark:text-white text-xs font-mono">AVANISH KUMAR SAH</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Terminal ID</span>
                              <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold text-xs">2222120015126752</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Bank Branch</span>
                              <span className="text-slate-700 dark:text-slate-300 font-semibold text-xs">NIC ASIA Bank — Kamaladi</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                            <p className="flex items-start gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                              <span>Open your <strong>Mobile Banking app</strong>, <strong>Fonepay</strong>, <strong>eSewa</strong>, or <strong>Khalti</strong>.</span>
                            </p>
                            <p className="flex items-start gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                              <span>Scan this QR code, verify <strong>AVANISH KUMAR SAH</strong> & amount <strong>{formatPrice(cartFinalTotal, currency)}</strong>.</span>
                            </p>
                            <p className="flex items-start gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                              <span>Confirm payment and enter your transaction remark below before clicking Place Order.</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Transaction Reference / Remark input */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Payment Reference / UTR / Remarks (Optional)
                        </label>
                        <input
                          type="text"
                          name="paymentRef"
                          value={formData.paymentRef}
                          onChange={handleChange}
                          placeholder="e.g. Fonepay Trans ID or Bank Ref # (9802331665)"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Simulated Card Form */}
                  {paymentMethod === 'Credit Card' && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 mb-1">Card Number (Simulated)</label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          readOnly
                          className="w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 dark:text-slate-400 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            readOnly
                            className="w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 dark:text-slate-400 mb-1">CVC Code</label>
                          <input
                            type="text"
                            value={cardDetails.cvc}
                            readOnly
                            className="w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'PayPal' && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      <p className="font-semibold text-slate-900 dark:text-white">PayPal Express Checkout</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">You will be redirected to PayPal to complete your purchase securely.</p>
                    </div>
                  )}

                  {paymentMethod === 'Cash on Delivery' && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      <p className="font-semibold text-slate-900 dark:text-white">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Pay with cash upon package arrival at your doorstep.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Sticky Order Summary + Place Order Button (5 cols) */}
              <div className="lg:col-span-5 lg:sticky lg:top-0 flex flex-col gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-[#131B2E]/90 border border-slate-200 dark:border-slate-800">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit'] border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-xs font-normal text-slate-500">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </h4>

                  {/* Items Mini List */}
                  <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{item.quantity}x</span>
                          <span className="text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                        </div>
                        <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                          {formatPrice((item.salePrice || item.price) * item.quantity, currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total Breakdown */}
                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrice(cartSubtotal, currency)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-rose-500 dark:text-rose-400">
                        <span>Coupon Discount</span>
                        <span className="font-mono">-{formatPrice(discountAmount, currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        {shippingFee === 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span> : formatPrice(shippingFee, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (8%)</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrice(estimatedTax, currency)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-base font-extrabold text-slate-900 dark:text-white">
                      <span>Grand Total</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-mono">{formatPrice(cartFinalTotal, currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button (Always visible immediately below Grand Total) */}
                <div className="space-y-3 pt-1">
                  {formErrors.cart && (
                    <p className="text-xs text-red-500 text-center font-medium">
                      {formErrors.cart}
                    </p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-60 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Place Order ({formatPrice(cartFinalTotal, currency)})</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Safe & secure 256-bit encrypted checkout with live DB sync</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* FULL SIZE QR MODAL PREVIEW */}
      {showFullQr && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" onClick={() => setShowFullQr(false)}>
          <div className="relative max-w-sm w-full max-h-[90vh] overflow-y-auto bg-white p-5 rounded-3xl shadow-2xl text-center space-y-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowFullQr(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-900">Scan Fonepay QR Code</h3>
            <p className="text-xs text-slate-500">Merchant: AVANISH KUMAR SAH • Terminal: 2222120015126752</p>
            <div className="p-2 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src="/fonepay-qr.png"
                alt="Fonepay Full Flyer"
                className="w-full max-h-[60vh] object-contain mx-auto rounded-xl"
              />
            </div>
            <a
              href="/fonepay-qr.png"
              download="fonepay-qr-avanish.png"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download High-Res QR Flyer</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};
