import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { useAdmin } from '../../context/AdminContext';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import { Flame, Clock, ShoppingCart, Eye, Star, Zap } from 'lucide-react';

export const FlashDeals = () => {
  const { products } = useAdmin();
  const { currency, addToCart, setQuickViewProduct } = useShop();

  // Ticking countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashDealProducts = products.filter(p => p.isFlashDeal || (p.salePrice && p.salePrice < p.price)).slice(0, 4);

  if (flashDealProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Header with Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-purple-50 dark:from-rose-950/40 dark:via-[#121829] dark:to-purple-950/30 border border-rose-200 dark:border-rose-500/20 shadow-sm dark:shadow-none mb-6 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
            <Flame className="w-5 h-5 text-rose-500 dark:text-rose-400 fill-rose-500/30 dark:fill-rose-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Lightning Flash Deals</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30">
                Up to 25% OFF
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Exclusive time-limited discounts on flagship electronics</p>
          </div>
        </div>

        {/* Countdown Timer Units */}
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
            <Clock className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            <span>Ends In:</span>
          </span>
          <div className="flex items-center gap-1 font-mono">
            <div className="bg-white dark:bg-[#0A0E1A] border border-rose-200 dark:border-rose-500/30 px-2 py-1 rounded-lg text-sm font-bold text-rose-600 dark:text-rose-400 shadow-sm dark:shadow-none">
              {String(timeLeft.hours).padStart(2, '0')}h
            </div>
            <span className="text-rose-500 dark:text-rose-400 font-bold">:</span>
            <div className="bg-white dark:bg-[#0A0E1A] border border-rose-200 dark:border-rose-500/30 px-2 py-1 rounded-lg text-sm font-bold text-rose-600 dark:text-rose-400 shadow-sm dark:shadow-none">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </div>
            <span className="text-rose-500 dark:text-rose-400 font-bold">:</span>
            <div className="bg-white dark:bg-[#0A0E1A] border border-rose-200 dark:border-rose-500/30 px-2 py-1 rounded-lg text-sm font-bold text-rose-600 dark:text-rose-400 shadow-sm dark:shadow-none">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </div>
          </div>
        </div>
      </div>

      {/* Flash Products Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {flashDealProducts.map((product) => {
          const discount = calculateDiscount(product.price, product.salePrice);
          const currentPrice = product.salePrice || product.price;

          return (
            <div
              key={product.id}
              className="group relative rounded-2xl bg-white dark:bg-[#121829]/90 border border-slate-200/90 dark:border-slate-700/60 hover:border-cyan-500/50 shadow-sm hover:shadow-xl dark:hover:shadow-glow-card transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Image & Discount Badge */}
              <div className="relative aspect-video sm:aspect-square w-full bg-slate-100 dark:bg-slate-900/60 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg bg-rose-600 text-white font-mono font-bold text-xs shadow-lg">
                    -{discount}%
                  </div>
                )}

                {/* Quick View Button */}
                <button
                  onClick={() => setQuickViewProduct(product)}
                  className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-white/90 hover:bg-cyan-500 hover:text-white dark:bg-[#0A0E1A]/80 dark:hover:bg-cyan-500 dark:hover:text-black text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Product Details */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider text-[10px]">
                      {product.brand}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{product.rating}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => setQuickViewProduct(product)}
                    className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors"
                  >
                    {product.name}
                  </h3>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                        {formatPrice(currentPrice, currency)}
                      </span>
                      {product.salePrice && product.salePrice < product.price && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-mono">
                          {formatPrice(product.price, currency)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      In Stock ({product.stock})
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm dark:shadow-glow-cyan transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add To Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
