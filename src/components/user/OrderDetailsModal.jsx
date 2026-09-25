import React from 'react';
import { 
  X, 
  Package, 
  MapPin, 
  Truck, 
  FileText, 
  Star, 
  Ban, 
  RotateCcw, 
  CreditCard,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useShop } from '../../context/ShopContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const OrderDetailsModal = () => {
  const { 
    activeModal, 
    modalData: order, 
    closeModal, 
    openTracking, 
    openInvoice, 
    openCancel, 
    openReturn 
  } = useUser();
  const { setQuickViewProduct } = useShop();

  if (activeModal !== 'orderDetails' || !order) return null;

  const items = order.items || [];
  const isDelivered = order.status === 'Delivered';
  const isCancellable = ['Pending', 'Processing'].includes(order.status);
  const isReturnable = isDelivered && order.status !== 'Returned' && order.status !== 'Return Requested';

  const handleReviewItem = (item) => {
    closeModal();
    // Open product quick view for this item so user can review it
    setQuickViewProduct({
      id: item.productId || item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: 'Electronics'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Order #{order.id}
                </h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                  order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400' :
                  order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                  order.status.includes('Return') ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Placed on {formatDate(order.date || order.createdAt)}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={closeModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => openTracking(order)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-900/60 text-xs font-semibold hover:bg-blue-100 transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Live Shipment</span>
            </button>
            <button
              onClick={() => openInvoice(order)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>View Invoice</span>
            </button>
            {isCancellable && (
              <button
                onClick={() => openCancel(order)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-200 dark:border-rose-900/60 text-xs font-semibold hover:bg-rose-100 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Order</span>
              </button>
            )}
            {isReturnable && (
              <button
                onClick={() => openReturn(order)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-lg border border-purple-200 dark:border-purple-900/60 text-xs font-semibold hover:bg-purple-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return Items</span>
              </button>
            )}
          </div>

          {/* Items Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Order Items ({items.length})
            </h3>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&q=80'} 
                      alt={item.name} 
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                      <button
                        onClick={() => handleReviewItem(item)}
                        className="mt-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        Write a Review
                      </button>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-slate-900 dark:text-white shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Delivery Details */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Delivery Address</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {order.customer?.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {order.customer?.address}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {order.customer?.city}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Phone: {order.customer?.phone}
              </p>
            </div>

            {/* Payment Summary */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 mb-2 font-bold text-slate-400 uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-slate-500" />
                <span>Payment Summary</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Payment Method:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{order.paymentMethod || 'Credit Card'}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal:</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(order.subtotal || order.total)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {order.shipping > 0 ? formatCurrency(order.shipping) : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Tax (8%):</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(order.tax || 0)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total Amount:</span>
                <span className="text-blue-600 dark:text-blue-400">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
