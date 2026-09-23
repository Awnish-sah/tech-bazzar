import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import {
  PackageCheck,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

const STATUS_CONFIG = {
  Pending: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/30' },
  Processing: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/30' },
  Shipped: { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/30' },
  Delivered: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/30' },
  Cancelled: { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-500/30' }
};

export const AdminOrdersList = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const { currency, addToast } = useShop();

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    addToast(`Order ${orderId} marked as ${newStatus}`, 'info');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
          Customer Orders Management ({orders.length})
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">Real-time storefront checkout integration</span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const statusStyle = STATUS_CONFIG[order.status] || STATUS_CONFIG.Processing;
          const orderDate = new Date(order.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0E1527] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-colors space-y-4"
            >
              {/* Top Row: Order ID, Date, Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{order.id}</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">{orderDate}</span>
                  </div>
                </div>

                {/* Status Switcher Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} focus:outline-none cursor-pointer bg-white dark:bg-[#121829]`}
                  >
                    <option value="Pending" className="bg-white dark:bg-[#121829] text-amber-700 dark:text-amber-400">Pending</option>
                    <option value="Processing" className="bg-white dark:bg-[#121829] text-blue-700 dark:text-blue-400">Processing</option>
                    <option value="Shipped" className="bg-white dark:bg-[#121829] text-purple-700 dark:text-purple-400">Shipped</option>
                    <option value="Delivered" className="bg-white dark:bg-[#121829] text-emerald-700 dark:text-emerald-400">Delivered</option>
                    <option value="Cancelled" className="bg-white dark:bg-[#121829] text-rose-700 dark:text-rose-400">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Middle Row: Customer Info & Items Ordered */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Customer Details */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                    Customer & Delivery Address
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-white">{order.customer.name}</p>
                  <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>{order.customer.email}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{order.customer.phone || 'N/A'}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{order.customer.address}, {order.customer.city}</span>
                  </p>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                    Items ({order.items.length})
                  </span>
                  <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{item.quantity}x</span>
                          <span className="truncate max-w-[200px]">{item.name}</span>
                        </div>
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">
                          {formatPrice((item.salePrice || item.price) * item.quantity, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-sm">
                    <span>Total ({order.paymentMethod}):</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-mono">{formatPrice(order.total, currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
