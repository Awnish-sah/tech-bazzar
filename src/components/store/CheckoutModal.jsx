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
  Loader2
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

  const { user, addresses, defaultAddress, openAuth } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States'
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Sync default address or user info when available
  useEffect(() => {
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
      setFormData({
        name: defaultAddress.fullName || user?.name || '',
        email: user?.email || '',
        phone: defaultAddress.phone || user?.phone || '',
        address: defaultAddress.streetAddress || '',
        city: defaultAddress.city || '',
        postalCode: defaultAddress.postalCode || '',
        country: defaultAddress.country || 'United States'
      });
    } else if (user) {
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
    setFormData({
      name: addr.fullName,
      email: user?.email || formData.email,
      phone: addr.phone,
      address: addr.streetAddress,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country
    });
    setFormErrors({});
  };

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardDetails, setCardDetails] = useState({
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvc: '888'
  });

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
      await handlePlaceOrder(formData, paymentMethod);
    } catch (err) {
      console.error('Order submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-[#0E1527] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-4 sm:my-8 transition-colors duration-300">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 p-5 sm:p-8">
            
            {/* Left Column: Shipping & Payment (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Not Signed In Banner */}
              {!user && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Signing in allows you to track shipments, get invoices, and manage returns!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsCheckoutOpen(false); if (openAuth) openAuth('login'); }}
                    className="font-bold underline hover:text-amber-900 dark:hover:text-white shrink-0 ml-2"
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

                {/* Saved Address Quick-Select */}
                {addresses && addresses.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                      Select from Saved Addresses:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {addresses.map(addr => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => handleSelectAddress(addr)}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                              isSelected
                                ? 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500/30'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-cyan-400'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white">
                              <span>{addr.title}</span>
                              {addr.isDefault && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {addr.streetAddress}, {addr.city}
                            </p>
                          </button>
                        );
                      })}
                    </div>
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
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>2. Payment Option</span>
                </h3>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {['Credit Card', 'PayPal', 'UPI / Wallet', 'Cash on Delivery'].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        paymentMethod === method
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-800 dark:text-white font-semibold shadow-sm'
                          : 'bg-slate-50 dark:bg-[#131B2E] border-slate-200 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span>{method}</span>
                      {paymentMethod === method && (
                        <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>

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

                {paymentMethod === 'UPI / Wallet' && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-3">
                    <QrCode className="w-10 h-10 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Instant UPI / QR Code Payment</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Scan QR code or approve VPA notification after placing order.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-slate-50 dark:bg-[#131B2E]/90 border border-slate-200 dark:border-slate-800 space-y-5">
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

              {/* Submit Button */}
              <div className="space-y-3">
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
                  <span>Guaranteed safe & secure checkout with PostgreSQL sync</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
