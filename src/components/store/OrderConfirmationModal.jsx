import React, { useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { useUser } from '../../context/UserContext';
import { formatPrice } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Truck,
  Download,
  ArrowRight,
  Package,
  Calendar,
  MapPin,
  X
} from 'lucide-react';

export const OrderConfirmationModal = () => {
  const {
    isOrderConfirmationOpen,
    setIsOrderConfirmationOpen,
    lastPlacedOrder,
    currency,
    addToast
  } = useShop();

  const { user, openDashboard } = useUser();

  useEffect(() => {
    if (isOrderConfirmationOpen) {
      // Trigger festive confetti explosion
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log('Confetti trigger', err);
      }
    }
  }, [isOrderConfirmationOpen]);

  if (!isOrderConfirmationOpen || !lastPlacedOrder) return null;

  const order = lastPlacedOrder;

  // Compute estimated delivery (3 days from order date)
  const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleDownloadInvoice = () => {
    addToast('📄 Receipt / Invoice simulated download started!', 'info');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0E1527] border border-slate-200 dark:border-cyan-500/30 shadow-2xl p-6 sm:p-8 my-8 text-center space-y-6 transition-colors duration-300">
        
        {/* Close Button */}
        <button
          onClick={() => setIsOrderConfirmationOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-sm dark:shadow-glow-cyan animate-bounce">
          <CheckCircle className="w-8 h-8" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
            Thank You for Your Order!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Your tech gadgets are being prepared for express delivery.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700/80 text-left space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Order Tracking ID</span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-mono">{order.id}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              <span>{order.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Estimated Express Arrival</span>
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{deliveryDate}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Shipping Destination</span>
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {order.customer.name}, {order.customer.address}, {order.customer.city}
              </p>
            </div>
          </div>

          {/* Ordered Items Preview */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Items Ordered:</span>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {formatPrice((item.salePrice || item.price) * item.quantity, currency)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
            <span>Total Paid ({order.paymentMethod}):</span>
            <span className="text-base text-cyan-600 dark:text-cyan-400 font-mono">{formatPrice(order.total, currency)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {user && (
            <button
              onClick={() => {
                setIsOrderConfirmationOpen(false);
                if (openDashboard) openDashboard('orders');
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>Track in My Orders</span>
            </button>
          )}

          <button
            onClick={handleDownloadInvoice}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Download Invoice</span>
          </button>

          <button
            onClick={() => setIsOrderConfirmationOpen(false)}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md dark:shadow-glow-cyan flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
