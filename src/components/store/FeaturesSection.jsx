import React from 'react';
import {
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  Star,
  Quote,
  CheckCircle2,
  Cpu,
  Award
} from 'lucide-react';

const REVIEWS = [
  {
    name: 'Marcus Vance',
    role: 'Full-Stack Software Engineer',
    comment: 'Ordered the MacBook Pro 16" M3 Max. Delivered in pristine condition within 48 hours with official Apple Care verification. Seamless experience!',
    rating: 5,
    verifiedItem: 'Apple MacBook Pro 16" M3 Max'
  },
  {
    name: 'Elena Rostova',
    role: 'Professional Sound Designer',
    comment: 'The Sony WH-1000XM5 headphones are 100% authentic and the spatial audio tuning is incredible. Customer support answered my questions instantly.',
    rating: 5,
    verifiedItem: 'Sony WH-1000XM5'
  },
  {
    name: 'David Kim',
    role: 'Competitive Gamer & Streamer',
    comment: 'Scored the PS5 Pro with zero markup. TechBazzar has become my #1 electronics retailer. Fast tracking updates and top-notch packaging.',
    rating: 5,
    verifiedItem: 'PlayStation 5 Pro 2TB'
  }
];

export const FeaturesSection = () => {
  return (
    <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-16">
      
      {/* Why Choose TechBazzar Cards */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white via-slate-50 to-cyan-50/20 dark:from-[#11182A] dark:to-[#0A0E1A] border border-slate-200 dark:border-cyan-500/20 p-5 sm:p-8 md:p-12 relative overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>The TechBazzar Advantage</span>
          </div>
          <h2 className="text-xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Outfit'] transition-colors">
            Engineered For Tech Enthusiasts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            We partner directly with leading silicon and consumer hardware manufacturers to bring you guaranteed authentic electronic products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2E]/90 border border-slate-200/90 dark:border-slate-700/60 space-y-3 hover:border-cyan-500/40 shadow-sm dark:shadow-none transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Genuine Tech Only</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every unit is brand new, factory sealed, and verifiable through manufacturer serial lookup. Zero refurbished or counterfeit products.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2E]/90 border border-slate-200/90 dark:border-slate-700/60 space-y-3 hover:border-purple-500/40 shadow-sm dark:shadow-none transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">2-Year Complete Warranty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enjoy peace of mind with 2 full years of comprehensive tech support and hardware protection against manufacturing faults.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2E]/90 border border-slate-200/90 dark:border-slate-700/60 space-y-3 hover:border-emerald-500/40 shadow-sm dark:shadow-none transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Next-Day Priority Dispatch</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Orders placed before 2 PM are packed with anti-shock protective materials and dispatched same-day via express insured freight.
            </p>
          </div>
        </div>
      </div>

      {/* Customer Testimonials Carousel / Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-['Outfit'] transition-colors">
              Loved by 50,000+ Tech Enthusiasts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real customer ratings and reviews from verified purchases</p>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-slate-700 dark:text-slate-200 font-mono">4.9 / 5.0 Average Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#121829] border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm dark:shadow-none transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rev.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{rev.role}</p>
                  </div>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Verified
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                  Purchased: {rev.verifiedItem}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
