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
  DollarSign,
  MapPin,
  Sparkles
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

  const { user, addresses, defaultAddress } = useUser();

  const [formData, setFormData] = useState(() => {
    if (defaultAddress) {
      return {
        name: defaultAddress.fullName || user?.name || 'Alex Rivera',
        email: user?.email || 'alex.rivera@techbazzar-customer.com',
        phone: defaultAddress.phone || user?.phone || '+1 (555) 321-9876',
        address: defaultAddress.streetAddress || '450 Innovation Parkway, Suite 300',
        city: defaultAddress.city || 'San Jose',
        postalCode: defaultAddress.postalCode || '95134',
        country: defaultAddress.country || 'United States'
      };
    }
    return {
      name: user?.name || 'Alex Rivera',
      email: user?.email || 'alex.rivera@techbazzar-customer.com',
      phone: user?.phone || '+1 (555) 321-9876',
      address: '450 Innovation Parkway, Suite 300',
      city: 'San Jose',
      postalCode: '95134',
      country: 'United States'
    };
  });

  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id || null);

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
  };

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardDetails, setCardDetails] = useState({
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvc: '888'
  });

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) {
      alert('Please fill out all required shipping fields');
      return;
    }
    handlePlaceOrder(formData, paymentMethod);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-[#0E1527] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-8 transition-colors duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">
              Secure TechBazzar Checkout
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
            
            {/* Left Column: Shipping & Payment (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Shipping Address */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>1. Shipping Information</span>
                  </div>
                  {user && (
                    <span className="text-[11px] font-normal text-slate-500 lowercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-500" />
                      signed in as {user.name}
                    </span>
                  )}
                </h3>

                {/* Saved Address Quick-Select */}
                {addresses && addresses.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                      Deliver to Saved Address:
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
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Postal / ZIP Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>2. Select Payment Method</span>
                </h3>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {['Credit Card', 'PayPal', 'UPI / Wallet', 'Cash on Delivery'].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        paymentMethod === method
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-800 dark:text-white font-semibold shadow-sm dark:shadow-glow-cyan'
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
                      <label className="block text-slate-500 dark:text-slate-400 mb-1">Card Number</label>
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
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit'] border-b border-slate-200 dark:border-slate-800 pb-3">
                  Order Summary ({cart.length} items)
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
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-md dark:shadow-glow-cyan flex items-center justify-center gap-2 transition-all transform active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  <span>Place Order ({formatPrice(cartFinalTotal, currency)})</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Guaranteed safe & secure 256-bit encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
