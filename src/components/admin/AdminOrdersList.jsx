import React, { useState } from 'react';
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
  Phone,
  AlertTriangle,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

const STATUS_CONFIG = {
  Pending: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/30' },
  Processing: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/30' },
  Shipped: { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/30' },
  Delivered: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/30' },
  Cancelled: { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-500/30' },
  Returned: { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-500/30' }
};

export const AdminOrdersList = () => {
  const { orders, updateOrderStatus, acknowledgeCancellation, resolveReturn } = useAdmin();
  const { currency, addToast } = useShop();

  const [filterStatus, setFilterStatus] = useState('All');

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    addToast(`Order ${orderId} marked as ${newStatus}`, 'info');
  };

  const handleAcknowledgeCancel = async (orderId) => {
    await acknowledgeCancellation(orderId);
    addToast(`Order ${orderId} cancellation acknowledged by Admin`, 'info');
  };

  const handleResolveReturn = async (orderId, action) => {
    await resolveReturn(orderId, action);
    addToast(`Order ${orderId} return request ${action === 'Approve' ? 'approved' : 'rejected'}`, 'info');
  };

  const unacknowledgedCount = orders.filter(
    (o) => (o.status === 'Cancelled' && !o.cancelAcknowledged) || o.returnStatus === 'Requested'
  ).length;

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'ActionNeeded') {
      return (o.status === 'Cancelled' && !o.cancelAcknowledged) || o.returnStatus === 'Requested';
    }
    return o.status === filterStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
            Customer Orders Management ({filteredOrders.length} of {orders.length})
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Real-time storefront checkout, cancellation & return synchronization
          </span>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'All', label: `All (${orders.length})` },
            { id: 'ActionNeeded', label: `Action Needed (${unacknowledgedCount})`, alert: unacknowledgedCount > 0 },
            { id: 'Cancelled', label: `Cancelled (${orders.filter(o => o.status === 'Cancelled').length})` },
            { id: 'Pending', label: 'Pending' },
            { id: 'Processing', label: 'Processing' },
            { id: 'Shipped', label: 'Shipped' },
            { id: 'Delivered', label: 'Delivered' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                  : tab.alert
                  ? 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-500/40'
                  : 'bg-white dark:bg-[#11182A] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const statusStyle = STATUS_CONFIG[order.status] || STATUS_CONFIG.Processing;
          const orderDate = new Date(order.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          const isUnacknowledgedCancel = order.status === 'Cancelled' && !order.cancelAcknowledged;

          return (
            <div
              key={order.id}
              className={`p-5 rounded-2xl bg-white dark:bg-[#0E1527] border shadow-sm transition-colors space-y-4 ${
                isUnacknowledgedCancel
                  ? 'border-rose-400 dark:border-rose-500/60 ring-1 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Top Row: Order ID, Date, Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                    order.status === 'Cancelled'
                      ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400'
                      : 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                  }`}>
                    {order.status === 'Cancelled' ? <XCircle className="w-5 h-5" /> : <PackageCheck className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{order.id}</span>
                      {order.status === 'Cancelled' && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                          order.cancelAcknowledged
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-600 text-white animate-pulse'
                        }`}>
                          {order.cancelAcknowledged ? '✓ Cancellation Acknowledged' : '⚠ Cancelled by User — Needs Acknowledgment'}
                        </span>
                      )}
                    </div>
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
                    <option value="Returned" className="bg-white dark:bg-[#121829] text-orange-700 dark:text-orange-400">Returned</option>
                  </select>
                </div>
              </div>

              {/* CUSTOMER CANCELLATION NOTICE & ADMIN ACKNOWLEDGMENT BANNER */}
              {order.status === 'Cancelled' && (
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
                  order.cancelAcknowledged
                    ? 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800'
                    : 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-200 dark:border-rose-500/40'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Customer Order Cancellation Report</span>
                      {order.cancelledAt && (
                        <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                          • Cancelled on {new Date(order.cancelledAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">Customer Reason:</span>{' '}
                      <span className="italic font-medium text-slate-900 dark:text-white">
                        "{order.cancelReason || 'Cancelled by customer prior to shipment'}"
                      </span>
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Product inventory stock has been automatically restored in PostgreSQL.</span>
                    </p>
                  </div>

                  <div className="shrink-0">
                    {!order.cancelAcknowledged ? (
                      <button
                        onClick={() => handleAcknowledgeCancel(order.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Acknowledge Cancellation</span>
                      </button>
                    ) : (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          Acknowledged by Admin
                          {order.cancelAcknowledgedAt ? ` (${new Date(order.cancelAcknowledgedAt).toLocaleDateString()})` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CUSTOMER RETURN REQUEST BANNER */}
              {order.returnStatus && order.returnStatus !== 'None' && (
                <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                      <RotateCcw className="w-4 h-4 shrink-0" />
                      <span>Customer Return Request ({order.returnStatus})</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">Reason:</span> "{order.returnReason || 'Defective or damaged product'}"
                    </p>
                    {order.returnComments && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">Customer Notes:</span> {order.returnComments}
                      </p>
                    )}
                  </div>

                  {order.returnStatus === 'Requested' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleResolveReturn(order.id, 'Approve')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Refund</span>
                      </button>
                      <button
                        onClick={() => handleResolveReturn(order.id, 'Reject')}
                        className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Middle Row: Customer Info & Items Ordered */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Customer Details */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                    Customer & Delivery Address
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-white">{order.customer?.name}</p>
                  <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>{order.customer?.email}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{order.customer?.phone || 'N/A'}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{order.customer?.address}, {order.customer?.city}</span>
                  </p>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                    Items ({(order.items || []).length})
                  </span>
                  <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
                    {(order.items || []).map((item, idx) => (
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
