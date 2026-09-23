import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import {
  X,
  Star,
  ShoppingCart,
  Zap,
  Shield,
  Truck,
  Heart,
  Plus,
  Minus,
  CheckCircle2
} from 'lucide-react';

export const ProductQuickView = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    currency,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCheckoutOpen
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorited = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.salePrice);
  const activePrice = product.salePrice || product.price;
  const isOutOfStock = product.stock <= 0;

  const handleIncrement = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-[#0E1527] border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden my-8 transition-colors duration-300">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          
          {/* Left Column: Image Showcase */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <img
                src={product.images && product.images[activeImageIndex] ? product.images[activeImageIndex] : product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono font-bold text-xs shadow-lg">
                  -{discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-cyan-500 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>2-Year Official Tech Warranty</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Express Insured Shipping</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              {/* Category, Brand, SKU */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  {product.brand} • {product.category}
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-mono">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight font-['Outfit']">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100 font-mono">{product.rating}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-500 text-xs">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{product.reviewsCount} verified reviews</span>
                <span className="text-slate-300 dark:text-slate-500 text-xs">•</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Genuine</span>
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {formatPrice(activePrice, currency)}
                </span>
                {discount > 0 && (
                  <span className="text-base text-slate-400 dark:text-slate-500 line-through font-mono">
                    {formatPrice(product.price, currency)}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                  {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} units)`}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                {product.description || product.shortDesc}
              </p>

              {/* Technical Specifications Breakdown */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Key Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-slate-400 dark:text-slate-400 text-[11px]">{key}</span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Quantity & Buy Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Quantity:</span>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-mono font-bold text-slate-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Wishlist toggle in modal */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                    isFavorited
                      ? 'bg-rose-500/10 text-rose-600 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:text-rose-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isFavorited ? 'Wishlisted' : 'Save'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    setQuickViewProduct(null);
                  }}
                  disabled={isOutOfStock}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md dark:shadow-glow-cyan transition-all disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
