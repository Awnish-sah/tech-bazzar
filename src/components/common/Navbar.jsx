import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useAdmin } from '../../context/AdminContext';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { CURRENCIES, formatPrice } from '../../utils/formatters';
import {
  Search,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Zap,
  Menu,
  X,
  Laptop,
  Smartphone,
  Headphones,
  SlidersHorizontal,
  ChevronDown,
  Moon,
  Sun,
  User,
  Package,
  MapPin,
  Star,
  LogOut,
  Sparkles
} from 'lucide-react';

export const Navbar = ({ onOpenAdmin, onViewMode, currentView }) => {
  const {
    cartCount,
    cartSubtotal,
    currency,
    setCurrency,
    wishlist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setIsCartOpen
  } = useShop();

  const { isAdminLoggedIn, orders } = useAdmin();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, openAuth, openDashboard, logout } = useUser();

  const adminAlertCount = (orders || []).filter(
    (o) => (o.status === 'Cancelled' && !o.cancelAcknowledged) || o.returnStatus === 'Requested'
  ).length;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const categories = [
    { label: 'All Tech', id: 'all' },
    { label: 'Smartphones', id: 'Smartphones', icon: Smartphone },
    { label: 'Laptops & PC', id: 'Laptops', icon: Laptop },
    { label: 'Audio', id: 'Audio', icon: Headphones },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-b border-cyan-500/20 text-xs py-1.5 px-4 text-center flex items-center justify-between text-slate-300">
        <div className="hidden sm:flex items-center gap-2 text-cyan-400 font-medium">
          <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 animate-pulse" />
          <span>TECH BAZZAR ELECTRONICS EXPO 2026</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-2">
          <span>Use coupon <span className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">TECH10</span> for 10% off</span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-400">Free Express Shipping & 2-Year Official Tech Warranty</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors bg-white/10 px-2 py-0.5 rounded border border-white/15"
            >
              <span>{CURRENCIES[currency]?.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-700/60 rounded-lg shadow-xl py-1 z-50">
                {Object.keys(CURRENCIES).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-cyan-500/10 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors flex items-center justify-between ${
                      currency === curr ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{CURRENCIES[curr].label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="glass-nav px-4 lg:px-8 py-3.5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onViewMode('store');
                setSelectedCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-md dark:shadow-glow-cyan flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-white dark:bg-[#0A0E1A] rounded-[10px] flex items-center justify-center transition-colors">
                  <Zap className="w-5 h-5 text-cyan-500 dark:text-cyan-400 fill-cyan-400/30" />
                </div>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 font-['Outfit'] transition-colors">
                  Tech<span className="text-cyan-600 dark:text-cyan-400">Bazzar</span>
                </span>
                <span className="block text-[10px] font-medium tracking-widest text-slate-500 dark:text-slate-400 uppercase -mt-1">
                  Electronic Store
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search smartphones, M3 laptops, RTX GPUs, audio..."
                className="w-full bg-slate-100/90 dark:bg-[#121829]/90 border border-slate-200 dark:border-slate-700/60 focus:border-cyan-500 focus:bg-white dark:focus:bg-[#121829] rounded-full py-2 pl-11 pr-10 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner dark:shadow-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full p-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Night / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl border transition-all duration-300 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-cyan-600 border-slate-200 shadow-sm dark:bg-white/5 dark:hover:bg-white/10 dark:text-cyan-300 dark:hover:text-cyan-200 dark:border-white/10 dark:shadow-glow-cyan group"
              title={isDark ? "Switch to Light Mode" : "Switch to Night Mode"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Night Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* View Switcher: only show Back to Store when currently inside Admin View */}
            {currentView === 'admin' && (
              <button
                onClick={() => onViewMode('store')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all shadow-sm dark:shadow-glow-cyan cursor-pointer"
              >
                <span>Back to Store</span>
              </button>
            )}

            {/* User Account / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-400 bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-sm transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-500/50"
                  />
                  <span className="hidden lg:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { openDashboard('orders'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                      >
                        <Package className="w-4 h-4 text-blue-500" />
                        <span>My Orders & Tracking</span>
                      </button>

                      <button
                        onClick={() => { openDashboard('addresses'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-cyan-500" />
                        <span>Delivery Addresses</span>
                      </button>

                      <button
                        onClick={() => { openDashboard('reviews'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                      >
                        <Star className="w-4 h-4 text-amber-500" />
                        <span>My Reviews</span>
                      </button>

                      <button
                        onClick={() => { openDashboard('profile'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                      >
                        <User className="w-4 h-4 text-purple-500" />
                        <span>Profile Settings</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/60 dark:hover:bg-blue-900/40 transition-all shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={() => {
                onViewMode('store');
                const wishlistElem = document.getElementById('catalog-section');
                if (wishlistElem) wishlistElem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-rose-600 shadow-sm dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-slate-300 dark:hover:text-rose-400 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-lg">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md dark:shadow-glow-cyan transition-all transform active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-[#0A0E1A]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline font-mono">
                {cartCount > 0 ? formatPrice(cartSubtotal, currency) : 'Cart'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Sub-Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {/* User Account Mobile Card */}
            {user ? (
              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                      alt="" 
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-500" 
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="p-1.5 text-rose-500 hover:bg-rose-100/50 rounded-lg text-xs"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs">
                  <button
                    onClick={() => { openDashboard('orders'); setMobileMenuOpen(false); }}
                    className="p-2 rounded-lg bg-white dark:bg-slate-700/80 font-medium text-slate-800 dark:text-slate-200 text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Package className="w-3.5 h-3.5 text-blue-500" />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={() => { openDashboard('addresses'); setMobileMenuOpen(false); }}
                    className="p-2 rounded-lg bg-white dark:bg-slate-700/80 font-medium text-slate-800 dark:text-slate-200 text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Addresses</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { openAuth('login'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            )}

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-slate-100 dark:bg-[#121829] border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Mobile Theme Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                {isDark ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>{isDark ? 'Night Mode Active' : 'White (Light) Mode Active'}</span>
              </div>
              <button
                onClick={toggleTheme}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 shadow-sm"
              >
                {isDark ? 'Switch to Light' : 'Switch to Night'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setMobileMenuOpen(false);
                    onViewMode('store');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/40'
                      : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
              <span>Select Currency:</span>
              <div className="flex gap-1.5">
                {Object.keys(CURRENCIES).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-2 py-1 rounded text-xs ${
                      currency === curr
                        ? 'bg-cyan-500 text-white dark:text-black font-bold'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
