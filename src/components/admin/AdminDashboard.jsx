import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import { AdminProductList } from './AdminProductList';
import { AdminOrdersList } from './AdminOrdersList';
import { AdminHeroBannerManager } from './AdminHeroBannerManager';
import { AdminAddProductModal } from './AdminAddProductModal';
import { AdminEditProductModal } from './AdminEditProductModal';
import {
  DollarSign,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  ArrowLeft,
  LogOut,
  Layers,
  Sparkles,
  ShieldCheck,
  Database,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard = ({ onBackToStore }) => {
  const {
    products,
    orders,
    logoutAdmin,
    dbConnectionStatus,
    dbDetails,
    refreshFromDb,
    isLoading
  } = useAdmin();
  const { currency, addToast } = useShop();

  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const handleLogout = () => {
    logoutAdmin();
    addToast('Admin logged out successfully', 'info');
    onBackToStore();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Admin Top Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0A0E1A]/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm dark:shadow-glow-purple">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
                <span>TechBazzar Admin Control Panel</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-mono">
                  LIVE
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Post products, upload media & manage customer orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Database Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                dbConnectionStatus === 'connected'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
              }`}
              title={
                dbConnectionStatus === 'connected'
                  ? `Connected to PostgreSQL (${dbDetails?.databaseName || 'techbazzar_db'}) - Latency: ${dbDetails?.latencyMs || 0}ms`
                  : 'PostgreSQL backend is offline or unconfigured. Running in Local Mode with localStorage cache.'
              }
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {dbConnectionStatus === 'connected'
                  ? `DB: ${dbDetails?.databaseName || 'PostgreSQL'}`
                  : 'DB: Local Mode'}
              </span>
              <span className="w-2 h-2 rounded-full animate-pulse bg-current"></span>
            </div>

            {/* Refresh DB Button */}
            <button
              onClick={() => {
                refreshFromDb();
                addToast('Checking PostgreSQL connection...', 'info');
              }}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Test & Refresh PostgreSQL Connection"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onBackToStore}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors shadow-sm dark:shadow-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Revenue */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#11182A] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 transition-all space-y-2 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Total Revenue</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {formatPrice(totalRevenue, currency)}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">From {orders.length} completed & active orders</p>
          </div>

          {/* Active Products */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#11182A] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 transition-all space-y-2 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Catalog Items</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {products.length}
            </div>
            <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">Electronics products active</p>
          </div>

          {/* Customer Orders */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#11182A] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 transition-all space-y-2 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Customer Orders</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {orders.length}
            </div>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Real-time orders tracked</p>
          </div>

          {/* Low Stock Alerts */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#11182A] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 transition-all space-y-2 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Stock Warnings</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {lowStockCount}
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Low or out-of-stock items</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                activeTab === 'products'
                  ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-400 dark:border-cyan-500/40 shadow-sm dark:shadow-glow-cyan'
                  : 'bg-white dark:bg-[#11182A] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white shadow-sm dark:shadow-none'
              }`}
            >
              Products Management ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                activeTab === 'orders'
                  ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-400 dark:border-cyan-500/40 shadow-sm dark:shadow-glow-cyan'
                  : 'bg-white dark:bg-[#11182A] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white shadow-sm dark:shadow-none'
              }`}
            >
              Orders Fulfillment ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                activeTab === 'banners'
                  ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-400 dark:border-cyan-500/40 shadow-sm dark:shadow-glow-cyan'
                  : 'bg-white dark:bg-[#11182A] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white shadow-sm dark:shadow-none'
              }`}
            >
              Hero Banners
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md dark:shadow-glow-cyan flex items-center gap-1.5 transition-all transform active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Product</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <AdminProductList
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onEditProduct={(prod) => setEditingProduct(prod)}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrdersList />
        )}

        {activeTab === 'banners' && (
          <AdminHeroBannerManager />
        )}
      </div>

      {/* Add Product Modal */}
      <AdminAddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Product Modal */}
      <AdminEditProductModal
        product={editingProduct}
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
      />
    </div>
  );
};
