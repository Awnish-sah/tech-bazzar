import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const OrderTrackingModal = () => {
  const { activeModal, modalData: order, closeModal, openInvoice, openCancel, openReturn } = useUser();
  const [copied, setCopied] = useState(false);

  if (activeModal !== 'tracking' || !order) return null;

  const trackingNumber = order.trackingNumber || `FDX-${order.id.replace(/[^0-9]/g, '').slice(0, 8)}-US`;
  const courier = order.courierName || 'FedEx Express';

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine active step (0: Pending, 1: Processing, 2: Shipped, 3: Delivered)
  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return -1;
      case 'Return Requested':
      case 'Returned': return 4;
      default: return 1;
    }
  };

  const stepIndex = getStepIndex(order.status);
  const isCancelled = order.status === 'Cancelled';
  const isReturned = order.status === 'Return Requested' || order.status === 'Returned';

  const timelineSteps = [
    { title: 'Order Placed', desc: 'We have received your order', date: formatDate(order.date || order.createdAt) },
    { title: 'Processing & Packed', desc: 'Items checked & packaged in warehouse', date: order.status !== 'Pending' ? 'Warehouse Dispatch' : 'Pending' },
    { title: 'In Transit', desc: 'Carrier moving to local distribution center', date: ['Shipped', 'Delivered'].includes(order.status) ? courier : 'Awaiting dispatch' },
    { title: 'Delivered', desc: 'Safely delivered to your doorstep', date: order.deliveredAt ? formatDate(order.deliveredAt) : (order.estimatedDelivery ? `Est. ${formatDate(order.estimatedDelivery)}` : 'Estimated in 2-4 days') }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Order Tracking
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                  order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400' :
                  order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                  order.status.includes('Return') ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                }`}>
                  {order.status}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Order #{order.id} • Placed on {formatDate(order.date || order.createdAt)}
              </p>
            </div>
          </div>

          <button 
            onClick={closeModal}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Tracking Card */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                Carrier & Tracking ID
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  {courier}:
                </span>
                <span className="font-mono text-sm text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900/50">
                  {trackingNumber}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Copy tracking code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                {order.status === 'Delivered' ? 'Delivery Completed' : 'Estimated Delivery'}
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {order.deliveredAt 
                  ? formatDate(order.deliveredAt)
                  : (order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'Within 2-4 Business Days')}
              </p>
            </div>
          </div>

          {/* Cancellation or Return Banner */}
          {isCancelled && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-700 dark:text-red-300">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Order Cancelled</p>
                <p className="text-xs mt-0.5 text-red-600 dark:text-red-400">
                  Reason: {order.cancelReason || 'Customer requested order cancellation before shipment.'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Inventory has been returned to stock. Any charged amounts will be refunded within 3-5 days.
                </p>
              </div>
            </div>
          )}

          {isReturned && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 flex items-start gap-3 text-purple-700 dark:text-purple-300">
              <RotateCcw className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Return Status: {order.returnStatus || 'Requested'}</p>
                <p className="text-xs mt-0.5 text-purple-600 dark:text-purple-400">
                  Return Reason: {order.returnReason || 'Item Return'} {order.returnComments ? `("${order.returnComments}")` : ''}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Our courier pickup agent will verify the sealed product packaging at your address.
                </p>
              </div>
            </div>
          )}

          {/* Visual Timeline (if not cancelled) */}
          {!isCancelled && (
            <div className="py-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">
                Shipment Progress
              </h3>

              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-8 ml-4">
                {timelineSteps.map((step, idx) => {
                  const isDone = stepIndex >= idx;
                  const isCurrent = stepIndex === idx;

                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 transition-colors ${
                        isDone 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      }`}>
                        {isDone ? <Check className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-semibold ${isDone ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                            {step.title}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium">
                            {step.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {step.desc}
                        </p>
                        {isCurrent && (
                          <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                            Current Milestone
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Destination Address */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Shipping Destination
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {order.customer?.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {order.customer?.address || '742 Evergreen Terrace'}, {order.customer?.city || 'Springfield'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Phone: {order.customer?.phone || '+1 (555) 234-5678'}
              </p>
            </div>
          </div>

          {/* Ordered Items Preview */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Package Contents ({(order.items || []).length} items)
            </h4>
            <div className="space-y-2">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=100&q=80'} 
                      alt={item.name} 
                      className="w-10 h-10 rounded object-cover border border-slate-200 dark:border-slate-700" 
                    />
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => openInvoice(order)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Download Invoice</span>
          </button>

          <div className="flex items-center gap-2">
            {['Pending', 'Processing'].includes(order.status) && (
              <button
                onClick={() => openCancel(order)}
                className="px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
              >
                Cancel Order
              </button>
            )}

            {order.status === 'Delivered' && (
              <button
                onClick={() => openReturn(order)}
                className="px-3 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors"
              >
                Return Item
              </button>
            )}

            <button
              onClick={closeModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
