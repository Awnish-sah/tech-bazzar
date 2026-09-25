import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

const GRADIENT_PRESETS = [
  { label: 'Cyan to Blue', value: 'from-cyan-500 to-blue-600' },
  { label: 'Purple to Indigo', value: 'from-purple-500 to-indigo-600' },
  { label: 'Emerald to Teal', value: 'from-emerald-500 to-teal-600' },
  { label: 'Amber to Rose', value: 'from-amber-500 to-rose-600' },
  { label: 'Violet to Fuchsia', value: 'from-violet-500 to-fuchsia-600' }
];

export const AdminHeroBannerManager = () => {
  const { currency, addToast } = useShop();
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState(null); // null = closed, {} = add new, { ... } = edit
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formState, setFormState] = useState({
    title: '',
    subtitle: '',
    tagline: '',
    price: '',
    originalPrice: '',
    badge: 'Special Feature',
    image: '',
    accentColor: 'from-cyan-500 to-blue-600',
    link: '#catalog-section',
    specsInput: '',
    displayOrder: 1,
    isActive: true
  });

  const loadBanners = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.getBanners(false);
      if (res.success && Array.isArray(res.data)) {
        setBanners(res.data);
      }
    } catch (err) {
      console.error('Failed to load hero banners:', err);
      addToast('Failed to load hero banners from PostgreSQL', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const notifyStorefront = () => {
    window.dispatchEvent(new CustomEvent('techbazzar:banners-updated'));
  };

  const handleOpenAdd = () => {
    setFormState({
      title: '',
      subtitle: '',
      tagline: '',
      price: '',
      originalPrice: '',
      badge: 'Featured Spotlight',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      accentColor: 'from-cyan-500 to-blue-600',
      link: '#catalog-section',
      specsInput: 'M3 Max Chip, 32GB RAM, 1TB SSD, Liquid Retina XDR',
      displayOrder: banners.length + 1,
      isActive: true
    });
    setEditingBanner({});
  };

  const handleOpenEdit = (b) => {
    const specsStr = Array.isArray(b.specs) ? b.specs.join(', ') : (b.specs || '');
    setFormState({
      id: b.id,
      title: b.title || '',
      subtitle: b.subtitle || '',
      tagline: b.tagline || '',
      price: b.price || '',
      originalPrice: b.originalPrice || '',
      badge: b.badge || '',
      image: b.image || '',
      accentColor: b.accentColor || 'from-cyan-500 to-blue-600',
      link: b.link || '#catalog-section',
      specsInput: specsStr,
      displayOrder: b.displayOrder || 1,
      isActive: b.isActive !== false
    });
    setEditingBanner(b);
  };

  const handleToggleActive = async (banner) => {
    try {
      const res = await api.toggleBannerActive(banner.id);
      if (res.success) {
        addToast(`Banner "${banner.title}" is now ${res.data.isActive ? 'Active' : 'Inactive'}`, 'success');
        loadBanners();
        notifyStorefront();
      }
    } catch (err) {
      addToast(err.message || 'Failed to toggle banner status', 'error');
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      const res = await api.deleteBanner(id);
      if (res.success) {
        addToast('Hero banner deleted successfully', 'success');
        setDeleteConfirmId(null);
        loadBanners();
        notifyStorefront();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete banner', 'error');
    }
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    if (!formState.title.trim() || !formState.price || !formState.image.trim()) {
      addToast('Title, price, and image URL are required', 'error');
      return;
    }

    const specsArray = formState.specsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      title: formState.title.trim(),
      subtitle: formState.subtitle.trim(),
      tagline: formState.tagline.trim(),
      price: parseFloat(formState.price),
      originalPrice: formState.originalPrice ? parseFloat(formState.originalPrice) : null,
      badge: formState.badge.trim(),
      image: formState.image.trim(),
      accentColor: formState.accentColor,
      link: formState.link.trim() || '#catalog-section',
      specs: specsArray,
      displayOrder: parseInt(formState.displayOrder, 10) || 1,
      isActive: formState.isActive
    };

    try {
      setIsSaving(true);
      if (editingBanner && editingBanner.id) {
        await api.updateBanner(editingBanner.id, payload);
        addToast('Hero banner updated in PostgreSQL!', 'success');
      } else {
        await api.createBanner(payload);
        addToast('New hero banner created in PostgreSQL!', 'success');
      }
      setEditingBanner(null);
      loadBanners();
      notifyStorefront();
    } catch (err) {
      addToast(err.message || 'Failed to save banner', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#11182A] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>Hero Promotional Banners</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300">
              {banners.length} slides
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage carousel banners displayed on the storefront home page. Real-time PostgreSQL sync.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all transform active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Banners Grid / List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          <p className="text-xs">Loading hero banners from database...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#11182A] rounded-2xl border border-slate-200 dark:border-slate-800">
          <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">No hero banners created yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Create promotional banners to highlight top products on the homepage carousel.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
          >
            Create First Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map((banner) => {
            const specs = Array.isArray(banner.specs) ? banner.specs : [];
            const isDeleting = deleteConfirmId === banner.id;

            return (
              <div
                key={banner.id}
                className={`relative rounded-2xl bg-white dark:bg-[#11182A] border transition-all overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                  banner.isActive
                    ? 'border-slate-200 dark:border-slate-800 hover:border-cyan-500/40'
                    : 'border-slate-200 dark:border-slate-800/60 opacity-75'
                }`}
              >
                {/* Banner Thumbnail & Badge */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Order & Active badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                      Order #{banner.displayOrder}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border ${
                        banner.isActive
                          ? 'bg-emerald-500/80 text-white border-emerald-400'
                          : 'bg-slate-700/80 text-slate-300 border-slate-600'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  {banner.badge && (
                    <div className="absolute bottom-3 left-3 text-[10px] font-semibold text-white bg-cyan-600/80 backdrop-blur-md px-2.5 py-0.5 rounded-md">
                      {banner.badge}
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 text-right">
                    <span className="text-lg font-extrabold text-white font-mono drop-shadow">
                      {formatPrice(banner.price, currency)}
                    </span>
                    {banner.originalPrice && (
                      <span className="block text-[11px] text-slate-300 line-through font-mono">
                        {formatPrice(banner.originalPrice, currency)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content description */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {banner.subtitle && (
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold truncate">
                        {banner.subtitle}
                      </p>
                    )}
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {banner.title}
                    </h4>
                    {banner.tagline && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {banner.tagline}
                      </p>
                    )}
                  </div>

                  {/* Specs pills */}
                  {specs.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {specs.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {spec}
                        </span>
                      ))}
                      {specs.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                          +{specs.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                        banner.isActive
                          ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                      }`}
                      title={banner.isActive ? 'Hide from storefront' : 'Show on storefront'}
                    >
                      {banner.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{banner.isActive ? 'Hide' : 'Activate'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(banner)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Banner"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {isDeleting ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="px-2 py-1 rounded bg-red-600 text-white text-[11px] font-bold hover:bg-red-700"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(banner.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {editingBanner !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#0E1527] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingBanner?.id ? 'Edit Hero Banner' : 'Create New Hero Banner'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Main Title * (e.g. MacBook Pro 16")
                  </label>
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    required
                    placeholder="MacBook Pro 16 M3 Max"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Subtitle (e.g. Next-Generation Apple Silicon)
                  </label>
                  <input
                    type="text"
                    value={formState.subtitle}
                    onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                    placeholder="Next-Gen Architecture"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Promo Badge
                  </label>
                  <input
                    type="text"
                    value={formState.badge}
                    onChange={(e) => setFormState({ ...formState, badge: e.target.value })}
                    placeholder="Flagship Performance"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Tagline */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Tagline / Description
                  </label>
                  <textarea
                    rows={2}
                    value={formState.tagline}
                    onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                    placeholder="Turbocharged with up to 128GB unified memory and Liquid Retina XDR display."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Promotional Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                    required
                    placeholder="2499.00"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Original Price ($) (Strikethrough)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.originalPrice}
                    onChange={(e) => setFormState({ ...formState, originalPrice: e.target.value })}
                    placeholder="2899.00"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Image URL * (Unsplash or direct asset)
                  </label>
                  <input
                    type="url"
                    value={formState.image}
                    onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                    required
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                  {formState.image && (
                    <div className="mt-2 h-28 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img
                        src={formState.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Accent Color Preset */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Accent Color Gradient
                  </label>
                  <select
                    value={formState.accentColor}
                    onChange={(e) => setFormState({ ...formState, accentColor: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  >
                    {GRADIENT_PRESETS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Display Order (1 = first)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formState.displayOrder}
                    onChange={(e) => setFormState({ ...formState, displayOrder: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Specs */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Specifications Pills (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formState.specsInput}
                    onChange={(e) => setFormState({ ...formState, specsInput: e.target.value })}
                    placeholder="16-Core CPU, 40-Core GPU, 22h Battery, Liquid Retina XDR"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Link */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Target Link
                  </label>
                  <input
                    type="text"
                    value={formState.link}
                    onChange={(e) => setFormState({ ...formState, link: e.target.value })}
                    placeholder="#catalog-section"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Is Active Toggle */}
                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isActiveCheckbox"
                    checked={formState.isActive}
                    onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500 border-slate-300"
                  />
                  <label htmlFor="isActiveCheckbox" className="text-slate-700 dark:text-slate-300 font-medium">
                    Publish this banner immediately to the storefront
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-2 transition-all disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to DB...</span>
                    </>
                  ) : (
                    <span>{editingBanner?.id ? 'Save Changes' : 'Create Banner'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
