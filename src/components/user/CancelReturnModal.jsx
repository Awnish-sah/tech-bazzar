import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  RotateCcw, 
  Ban, 
  CheckCircle2, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const CANCEL_REASONS = [
  'Found a better price elsewhere',
  'Ordered by mistake',
  'Delivery time is too long',
  'Need to change shipping address or payment method',
  'Item no longer needed',
  'Other'
];

const RETURN_REASONS = [
  'Product arrived defective or damaged',
  'Item does not match website description',
  'Missing parts or accessories',
  'Performance or quality not as expected',
  'Changed mind / No longer needed',
  'Other reason'
];

export const CancelReturnModal = () => {
  const { activeModal, modalData: order, closeModal, cancelOrder, returnOrder, isLoading } = useUser();
  const [selectedReason, setSelectedReason] = useState('');
  const [comments, setComments] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDone, setIsDone] = useState(false);

  if ((activeModal !== 'cancel' && activeModal !== 'return') || !order) return null;

  const isCancel = activeModal === 'cancel';
  const reasons = isCancel ? CANCEL_REASONS : RETURN_REASONS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedReason) {
      setErrorMsg('Please select a reason from the list');
      return;
    }

    if (isCancel) {
      const res = await cancelOrder(order.id, selectedReason + (comments ? `: ${comments}` : ''));
      if (res.success) {
        setIsDone(true);
      } else {
        setErrorMsg(res.error || 'Cancellation failed');
      }
    } else {
      const res = await returnOrder(order.id, selectedReason, comments);
      if (res.success) {
        setIsDone(true);
      } else {
        setErrorMsg(res.error || 'Return request failed');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCancel 
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400' 
                : 'bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400'
            }`}>
              {isCancel ? <Ban className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isCancel ? 'Cancel Order' : 'Request Product Return'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Order #{order.id} • Total {formatCurrency(order.total)}
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

        {/* Modal Body */}
        {isDone ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isCancel ? 'Order Cancelled' : 'Return Request Submitted'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {isCancel 
                ? 'Your order has been cancelled and stock has been restored. Any charged amounts will be refunded to your original payment method in 3-5 days.'
                : 'Your return ticket has been generated. Our pickup courier will reach out to collect the item. Thank you for your patience.'}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition-colors"
            >
              Done & Return to Orders
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Policy Info Card */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {isCancel ? 'Hassle-Free Cancellation' : '14-Day Return Window'}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isCancel 
                    ? 'Orders in Pending or Processing status can be cancelled immediately without penalty.'
                    : 'Delivered products are eligible for 100% refund or replacement within 14 days of delivery in original packaging.'}
                </p>
              </div>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Reason for {isCancel ? 'Cancellation' : 'Return'} *
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select a reason...</option>
                {reasons.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Additional Comments */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Additional Comments / Feedback (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                placeholder={isCancel ? 'Tell us how we can improve...' : 'Please specify any product defects or details for courier pickup...'}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Nevermind
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-5 py-2.5 text-xs font-semibold text-white rounded-xl shadow transition-all active:scale-[0.98] disabled:opacity-50 ${
                  isCancel 
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20' 
                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                }`}
              >
                {isLoading ? 'Processing...' : (isCancel ? 'Confirm Cancellation' : 'Submit Return Request')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
