import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useAdmin } from '../../context/AdminContext';
import {
  Zap,
  Mail,
  Shield,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle,
  CreditCard,
  Lock,
  ArrowRight
} from 'lucide-react';

export const Footer = ({ onOpenAdmin }) => {
  const { addToast } = useShop();
  const { isAdminLoggedIn, orders } = useAdmin();
  const [email, setEmail] = useState('');

  const adminAlertCount = (orders || []).filter(
    (o) => (o.status === 'Cancelled' && !o.cancelAcknowledged) || o.returnStatus === 'Requested'
  ).length;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    addToast('🎉 Subscribed! You will receive VIP electronics discounts.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-slate-100 dark:bg-[#070A12] border-t border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 text-sm mt-20 transition-colors duration-300">
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800/60 py-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold text-sm">Free Express Shipping</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">On all orders over $1,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold text-sm">2-Year Official Warranty</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">100% genuine guaranteed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold text-sm">30 Days Money Back</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Hassle-free easy returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold text-sm">24/7 Expert Support</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Instant dedicated tech assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 flex items-center justify-center shadow-sm">
              <div className="w-full h-full bg-white dark:bg-[#0A0E1A] rounded-[6px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 fill-cyan-400/30" />
              </div>
            </div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Outfit']">
              Tech<span className="text-cyan-600 dark:text-cyan-400">Bazzar</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
            TechBazzar is your premier destination for next-generation electronics, high-performance computing, flagship smartphones, noise-cancelling audio, and smart gadgets. Designed for tech enthusiasts and professionals worldwide.
          </p>

          {/* Newsletter Form */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">Subscribe to our Tech Insider newsletter:</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full bg-white dark:bg-[#121829] border border-slate-300 dark:border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-black font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm dark:shadow-glow-cyan"
              >
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Quick Links: Electronics */}
        <div>
          <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-3 font-['Outfit']">Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#catalog-section" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Flagship Smartphones</a></li>
            <li><a href="#catalog-section" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Pro & Gaming Laptops</a></li>
            <li><a href="#catalog-section" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Hi-Res Audio & Headphones</a></li>
            <li><a href="#catalog-section" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Smart Wearables</a></li>
            <li><a href="#catalog-section" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">PlayStation & Consoles</a></li>
            <li><a href="#catalog-section" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">4K Drones & Cameras</a></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-3 font-['Outfit']">Customer Care</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Track Your Order</span></li>
            <li><span className="cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Shipping & Delivery Rates</span></li>
            <li><span className="cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Returns & Refunds</span></li>
            <li><span className="cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Warranty & Tech Protection</span></li>
            <li><span className="cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Terms of Service</span></li>
            <li><span className="cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Privacy Policy</span></li>
          </ul>
        </div>

        {/* Admin Portal & Security */}
        <div>
          <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-3 font-['Outfit']">Admin & Store</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={onOpenAdmin}
                className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 border transition-all cursor-pointer shadow-sm ${
                  isAdminLoggedIn
                    ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-400/50 hover:bg-purple-500/25'
                    : 'bg-white dark:bg-[#121829] text-cyan-600 dark:text-cyan-400 border-slate-300 dark:border-slate-700 hover:border-cyan-500'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{isAdminLoggedIn ? 'Open Admin Control Panel' : 'Admin Login Portal'}</span>
                {adminAlertCount > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white animate-pulse">
                    {adminAlertCount}
                  </span>
                ) : (
                  isAdminLoggedIn && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )
                )}
              </button>
            </li>
            <li><span className="text-slate-500 dark:text-slate-400">Post & Manage Products</span></li>
            <li><span className="text-slate-500 dark:text-slate-400">Hero Banner Management</span></li>
            <li><span className="text-slate-500 dark:text-slate-400">Customer Order & Cancel Review</span></li>
            <li className="pt-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] bg-white dark:bg-slate-800/80 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                <Shield className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright, Admin Quick Link & Payment Methods */}
      <div className="border-t border-slate-200 dark:border-slate-800/50 py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <p>© 2026 TechBazzar Inc. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3 text-cyan-500" />
              <span>Admin Panel</span>
              {adminAlertCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                  {adminAlertCount} Alert{adminAlertCount > 1 ? 's' : ''}
                </span>
              )}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 mr-1">Secure Payments:</span>
            <span className="px-2 py-1 bg-white dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 font-bold font-mono text-[10px] shadow-sm">Fonepay QR</span>
            <span className="px-2 py-1 bg-white dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] shadow-sm">VISA</span>
            <span className="px-2 py-1 bg-white dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] shadow-sm">Mastercard</span>
            <span className="px-2 py-1 bg-white dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] shadow-sm">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
