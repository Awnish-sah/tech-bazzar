import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Shield,
  Truck,
  Flame,
  Star
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'prod-1',
    subtitle: 'Next-Generation Apple Silicon',
    title: 'MacBook Pro 16"',
    tagline: 'Turbocharged by M3 Max with up to 128GB unified memory.',
    price: 3199,
    originalPrice: 3499,
    badge: 'Flagship Performance',
    accentColor: 'from-cyan-500 to-blue-600',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    specs: ['16-Core CPU', '40-Core GPU', '22h Battery', 'Liquid Retina XDR']
  },
  {
    id: 'prod-7',
    subtitle: 'Forged in Grade 5 Titanium',
    title: 'iPhone 16 Pro',
    tagline: 'A18 Pro power, 4K 120fps Dolby Vision, and dedicated Camera Control.',
    price: 999,
    originalPrice: 1099,
    badge: 'Exclusive Launch Offer',
    accentColor: 'from-purple-500 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
    specs: ['A18 Pro Chip', '48MP Fusion Camera', 'Titanium Frame', 'Camera Control']
  },
  {
    id: 'prod-3',
    subtitle: 'Pure Audio Perfection',
    title: 'Sony WH-1000XM5',
    tagline: 'Industry-leading noise canceling with Dual Processor V1 and 8 microphones.',
    price: 329,
    originalPrice: 399,
    badge: 'Best Audio 2026',
    accentColor: 'from-emerald-500 to-teal-600',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    specs: ['Dual Processor V1', '30hr Battery Life', 'Hi-Res Audio LDAC', 'Speak-to-Chat']
  }
];

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currency, addToCart, setQuickViewProduct } = useShop();

  // Auto slide rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-4">
      {/* Banner Container */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-cyan-50/40 to-slate-100 dark:from-[#10172A] dark:via-[#0E1527] dark:to-[#0A0E1A] border border-slate-200/90 dark:border-cyan-500/20 shadow-xl dark:shadow-2xl min-h-[460px] md:min-h-[500px] flex items-center transition-colors duration-300">
        
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-500/15 blur-3xl pointer-events-none"></div>

        {/* Content Grid */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 md:p-14">
          
          {/* Text Information (Left) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Promo Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{slide.badge}</span>
            </div>

            {/* Subtitle & Title */}
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold mb-1">
                {slide.subtitle}
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {slide.title}
              </h1>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed">
              {slide.tagline}
            </p>

            {/* Key Specs Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {slide.specs.map((spec, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-medium shadow-sm dark:shadow-none"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Pricing & CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {formatPrice(slide.price, currency)}
                </span>
                <span className="text-base text-slate-400 dark:text-slate-500 line-through font-mono">
                  {formatPrice(slide.originalPrice, currency)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="#catalog-section"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm shadow-md hover:shadow-cyan-500/20 dark:shadow-glow-cyan flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => {
                    const el = document.getElementById('catalog-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-sm font-medium shadow-sm dark:shadow-none transition-colors"
                >
                  View Deals
                </button>
              </div>
            </div>
          </div>

          {/* Product Cutout/Image (Right) */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative group w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-white/10">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent dark:from-[#0A0E1A]/80"></div>
              
              {/* Floating verified badge */}
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-[#0A0E1A]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-cyan-500/30 flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Official Tech Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-colors"
            title="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-1.5 mx-1">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-cyan-500' : 'w-2 bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-colors"
            title="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
