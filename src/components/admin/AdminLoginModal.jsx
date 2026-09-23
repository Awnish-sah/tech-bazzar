import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useShop } from '../../context/ShopContext';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  X,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const AdminLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin } = useAdmin();
  const { addToast } = useShop();

  const [email, setEmail] = useState('admin@techbazzar.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await loginAdmin(email, password);
      if (res && res.success) {
        addToast('👋 Welcome back, Admin! Access granted.', 'success');
        onSuccess();
        onClose();
      } else {
        setError(res?.message || 'Invalid email or password. Use demo credentials: admin@techbazzar.com / admin123');
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@techbazzar.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#0E1527] border border-slate-200 dark:border-cyan-500/30 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-glow-cyan">
          <ShieldCheck className="w-7 h-7" />
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
            Admin Control Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign in to post electronic products, manage inventory & review customer orders
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-xs">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] font-mono transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] font-mono transition-colors"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Quick Demo Fill Button */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={handleDemoFill}
              disabled={isSubmitting}
              className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use 1-Click Demo Credentials</span>
            </button>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">admin123</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-75 text-white font-bold text-xs sm:text-sm shadow-glow-cyan transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Enter Admin Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
