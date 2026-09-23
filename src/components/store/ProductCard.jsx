import React from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import { Star, ShoppingCart, Heart, Eye, Check, AlertCircle } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const {
    currency,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct
  } = useShop();

  const isFavorited = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.salePrice);
  const activePrice = product.salePrice || product.price;
  const isOutOfStock = product.stock <= 0;

  // Extract first 2 specs for quick pill display
  const keySpecs = product.specs ? Object.entries(product.specs).slice(0, 2) : [];

  return (
    <div className="group relative rounded-2xl bg-white dark:bg-[#121829]/80 border border-slate-200/90 dark:border-slate-700/60 hover:border-cyan-500/50 shadow-sm hover:shadow-xl dark:hover:shadow-glow-card transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Image Showcase */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-900/60 overflow-hidden">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-[#121829]/60 via-transparent to-transparent pointer-events-none"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-rose-600 text-white font-mono font-bold text-[11px] shadow-md">
              -{discount}%
            </span>
          )}
          {product.badge && (
            <span className="px-2 py-0.5 rounded-lg bg-cyan-500 text-white dark:text-black font-bold text-[10px] uppercase tracking-wide shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
            isFavorited
              ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
              : 'bg-white/90 text-slate-700 hover:text-rose-500 border border-slate-200 dark:bg-[#0A0E1A]/70 dark:text-slate-300 dark:hover:text-rose-400 dark:border-white/10'
          }`}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-0 bottom-3 px-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="w-full py-2 px-3 rounded-xl bg-white/95 hover:bg-cyan-500 hover:text-white dark:bg-[#0A0E1A]/90 dark:hover:bg-cyan-500 dark:hover:text-black text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 backdrop-blur-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View Specs</span>
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Brand & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider text-[11px]">
              {product.brand} • {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">{product.rating || '4.8'}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">({product.reviewsCount || 12})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors leading-snug"
          >
            {product.name}
          </h3>

          {/* Key Specs Pills */}
          {keySpecs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {keySpecs.map(([label, val], idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/50 truncate max-w-[200px]"
                  title={`${label}: ${val}`}
                >
                  {val}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Section */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                {formatPrice(activePrice, currency)}
              </span>
              {discount > 0 && (
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-mono">
                  {formatPrice(product.price, currency)}
                </span>
              )}
            </div>

            {/* Stock pill */}
            {isOutOfStock ? (
              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
                Only {product.stock} left!
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                In Stock
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-sm hover:shadow-cyan-500/20 dark:shadow-glow-cyan transform active:scale-98'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
