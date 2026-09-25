import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  Building, 
  Mail, 
  Phone, 
  Calendar 
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const InvoiceModal = () => {
  const { activeModal, modalData: order, closeModal } = useUser();

  if (activeModal !== 'invoice' || !order) return null;

  const invoiceNumber = order.invoiceNumber || `INV-${new Date(order.date || order.createdAt || Date.now()).getFullYear()}-${order.id.replace(/[^0-9]/g, '').slice(-5)}`;
  const invoiceDate = formatDate(order.date || order.createdAt);
  const items = order.items || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:fixed print:inset-0">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Screen Controls Header (Hidden in Print) */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              Tax Invoice — {invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={closeModal}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="p-8 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-8 bg-white text-slate-900">
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow">
                  TB
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  TechBazzar<span className="text-blue-600">.</span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">Next-Gen Electronics & Technologies Inc.</p>
              <p className="text-xs text-slate-500">100 Innovation Blvd, Suite 800, Silicon Valley, CA</p>
              <p className="text-xs text-slate-500">Tax ID / EIN: 84-9210492-TB | support@techbazzar.com</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-md uppercase tracking-wider mb-2">
                PAID & VERIFIED
              </span>
              <h2 className="text-xl font-bold text-slate-900">TAX INVOICE</h2>
              <p className="text-xs font-mono font-semibold text-slate-600 mt-1">Invoice #: {invoiceNumber}</p>
              <p className="text-xs text-slate-500">Order ID: #{order.id}</p>
              <p className="text-xs text-slate-500">Date: {invoiceDate}</p>
            </div>
          </div>

          {/* Billing & Shipping Columns */}
          <div className="grid grid-cols-2 gap-8 mb-6 pb-6 border-b border-slate-200">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Billed & Shipped To:
              </h3>
              <p className="text-sm font-bold text-slate-900">{order.customer?.name || 'Alex Rivera'}</p>
              <p className="text-xs text-slate-600 mt-0.5">{order.customer?.address || '742 Evergreen Terrace'}</p>
              <p className="text-xs text-slate-600">{order.customer?.city || 'Springfield, OR 97477'}</p>
              <p className="text-xs text-slate-500 mt-1">Email: {order.customer?.email || 'alex@example.com'}</p>
              <p className="text-xs text-slate-500">Phone: {order.customer?.phone || '+1 (555) 234-5678'}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Payment & Fulfillment
              </h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="font-semibold text-slate-800">{order.paymentMethod || 'Credit Card'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Courier Partner:</span>
                  <span className="font-semibold text-slate-800">{order.courierName || 'FedEx Express'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracking Code:</span>
                  <span className="font-mono font-semibold text-blue-600">{order.trackingNumber || 'FDX-847291-US'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Status:</span>
                  <span className="font-semibold text-slate-800">{order.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="mb-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5 w-10">#</th>
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-right w-24">Unit Price</th>
                  <th className="py-2.5 text-center w-16">Qty</th>
                  <th className="py-2.5 text-right w-24">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => (
                  <tr key={idx} className="text-slate-800">
                    <td className="py-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-400">SKU: {item.id || item.productId}</p>
                    </td>
                    <td className="py-3 text-right font-medium">{formatCurrency(item.price)}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right font-bold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-medium text-slate-900">{formatCurrency(order.subtotal || order.total)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount Applied:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping & Handling:</span>
                <span className="font-medium text-slate-900">
                  {order.shipping > 0 ? formatCurrency(order.shipping) : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (8%):</span>
                <span className="font-medium text-slate-900">{formatCurrency(order.tax || 0)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total Paid:</span>
                <span className="text-blue-600 text-base">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Invoice Footer Notes */}
          <div className="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-600">Thank you for shopping with TechBazzar!</p>
            <p>14-day warranty and hassle-free return policy applies to all delivered items.</p>
            <p>For inquiries, contact support@techbazzar.com or visit www.techbazzar.com/support</p>
          </div>
        </div>
      </div>
    </div>
  );
};
