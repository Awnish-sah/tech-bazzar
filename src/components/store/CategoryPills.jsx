import React from 'react';
import { useShop } from '../../context/ShopContext';
import { useAdmin } from '../../context/AdminContext';
import {
  Sparkles,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Gamepad2,
  Layers,
  Camera
} from 'lucide-react';

const CATEGORY_CONFIG = [
  { id: 'all', name: 'All Products', icon: Sparkles },
  { id: 'Smartphones', name: 'Smartphones', icon: Smartphone },
  { id: 'Laptops', name: 'Laptops & PC', icon: Laptop },
  { id: 'Audio', name: 'Audio & Sound', icon: Headphones },
  { id: 'Wearables', name: 'Smart Watches', icon: Watch },
  { id: 'Gaming', name: 'Gaming Gear', icon: Gamepad2 },
  { id: 'Accessories', name: 'Accessories', icon: Layers }
];

export const CategoryPills = () => {
  const { selectedCategory, setSelectedCategory } = useShop();
  const { products } = useAdmin();

  // Compute live product counts per category
  const getCount = (catId) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 transition-colors">
            <span>Browse By Category</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">Explore cutting-edge tech hardware curated for enthusiasts</p>
        </div>
      </div>

      {/* Category Scroll Container */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 scrollbar-none smooth-scroll">
        {CATEGORY_CONFIG.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = getCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                const el = document.getElementById('catalog-section');
                if (cat.id !== 'all' && el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 border shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500 shadow-sm dark:shadow-glow-cyan'
                  : 'bg-white dark:bg-[#121829]/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-[#1A2238] hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white shadow-sm dark:shadow-none'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-cyan-500 text-white dark:text-black' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
