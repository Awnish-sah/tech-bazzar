import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const AdminProductList = ({ onOpenAddModal, onEditProduct }) => {
  const { products, deleteProduct, toggleStock, resetToDefaultCatalog } = useAdmin();
  const { currency, addToast } = useShop();

  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategory, setAdminCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(adminSearch.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(adminSearch.toLowerCase()));
      const matchCategory = adminCategory === 'all' || p.category === adminCategory;
      return matchSearch && matchCategory;
    });
  }, [products, adminSearch, adminCategory]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from TechBazzar?`)) {
      deleteProduct(id);
      addToast(`Deleted product "${name.slice(0, 20)}..."`, 'info');
    }
  };

  const handleResetCatalog = () => {
    if (window.confirm('Reset all products back to default seed collection?')) {
      resetToDefaultCatalog();
      addToast('Restored default catalog products', 'success');
    }
  };

  return (
    <div className="space-y-5">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#11182A] p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Search & Filter */}
        <div className="flex flex-col xs:flex-row flex-1 items-stretch xs:items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search products by title, brand, or SKU..."
              className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={adminCategory}
            onChange={(e) => setAdminCategory(e.target.value)}
            className="bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer transition-colors"
          >
            <option value="all">All Categories</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Laptops">Laptops</option>
            <option value="Audio">Audio</option>
            <option value="Wearables">Wearables</option>
            <option value="Gaming">Gaming</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <button
            onClick={handleResetCatalog}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Reset catalog to seed products"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-1.5 transition-all transform active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Product</span>
          </button>
        </div>
      </div>

      {/* Mobile Cards View (Phones & Small Tablets) */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map((p) => {
          const currentPrice = p.salePrice || p.price;
          const isOut = p.stock <= 0;
          const isLow = p.stock > 0 && p.stock <= 5;
          return (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#0E1527] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=200&q=80'}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                      <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{p.brand}</span>
                      <span>•</span>
                      <span>{p.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono shrink-0">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {formatPrice(currentPrice, currency)}
                  </div>
                  {p.salePrice && p.salePrice < p.price && (
                    <div className="text-[10px] text-slate-400 line-through">
                      {formatPrice(p.price, currency)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => toggleStock(p.id)}
                  className="cursor-pointer"
                >
                  {isOut ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 text-[10px] font-semibold">
                      <AlertTriangle className="w-3 h-3" />
                      Out of Stock
                    </span>
                  ) : isLow ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 text-[10px] font-semibold">
                      Low Stock ({p.stock})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      In Stock ({p.stock})
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditProduct(p)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table Container */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1527] shadow-sm dark:shadow-xl">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-[#11182A] text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4">Product Info</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock Status</th>
              <th className="py-3 px-4 text-center">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {filteredProducts.map((p) => {
              const currentPrice = p.salePrice || p.price;
              const isOut = p.stock <= 0;
              const isLow = p.stock > 0 && p.stock <= 5;

              return (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-[#131B2E]/60 transition-colors">
                  {/* Thumbnail & Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0">
                        <img
                          src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=200&q=80'}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{p.brand}</span>
                          <span>•</span>
                          <span>SKU: {p.sku || 'TB-AUTO'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                      {p.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    <div>{formatPrice(currentPrice, currency)}</div>
                    {p.salePrice && p.salePrice < p.price && (
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 line-through">
                        {formatPrice(p.price, currency)}
                      </div>
                    )}
                  </td>

                  {/* Stock Status */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleStock(p.id)}
                      className="cursor-pointer"
                      title="Click to toggle stock status"
                    >
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30 text-[11px] font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30 text-[11px] font-semibold">
                          Low Stock ({p.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          In Stock ({p.stock})
                        </span>
                      )}
                    </button>
                  </td>

                  {/* Featured */}
                  <td className="py-3 px-4 text-center">
                    {p.isFeatured ? (
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-glow-cyan" title="Featured on home"></span>
                    ) : (
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" title="Standard item"></span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditProduct(p)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-600/30 dark:text-slate-300 dark:hover:text-rose-400 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
            No products match your search query.
          </div>
        )}
      </div>
    </div>
  );
};
