import React, { useState, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useShop } from '../../context/ShopContext';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  'Smartphones',
  'Laptops',
  'Audio',
  'Wearables',
  'Gaming',
  'Accessories'
];

export const AdminAddProductModal = ({ isOpen, onClose }) => {
  const { addProduct } = useAdmin();
  const { addToast } = useShop();
  const fileInputRef = useRef(null);

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [category, setCategory] = useState('Smartphones');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('15');
  const [sku, setSku] = useState(`TB-${Math.floor(1000 + Math.random() * 9000)}`);
  const [badge, setBadge] = useState('New Arrival');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isFlashDeal, setIsFlashDeal] = useState(false);
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');

  // Image upload state
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Dynamic Specs
  const [specs, setSpecs] = useState([
    { key: 'Processor', value: '' },
    { key: 'Memory / RAM', value: '' },
    { key: 'Storage', value: '' },
    { key: 'Display', value: '' }
  ]);

  if (!isOpen) return null;

  // File Upload Handler (FileReader -> base64 data URL)
  const handleFileProcess = (file) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setUploadedImages(prev => [...prev, dataUrl]);
      addToast('Image uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(handleFileProcess);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFileProcess);
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setUploadedImages(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
      addToast('Image URL added!', 'info');
    }
  };

  const handleRemoveImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Specs handlers
  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const handleAddSpec = () => {
    setSpecs(prev => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !category) {
      addToast('Please fill out all required product fields', 'error');
      return;
    }

    // Prepare specs object
    const specsObject = {};
    specs.forEach(s => {
      if (s.key.trim() && s.value.trim()) {
        specsObject[s.key.trim()] = s.value.trim();
      }
    });

    const newProduct = {
      name: name.trim(),
      brand: brand.trim(),
      category,
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      stock: parseInt(stock, 10) || 0,
      sku: sku.trim(),
      badge: badge.trim(),
      isFeatured,
      isFlashDeal,
      images: uploadedImages.length > 0
        ? uploadedImages
        : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80'],
      shortDesc: shortDesc.trim() || `${brand} ${name} high-performance electronics.`,
      description: description.trim() || `Experience premium quality with the all-new ${name} from ${brand}. Features state-of-the-art engineering and official 2-year warranty.`,
      specs: specsObject
    };

    addProduct(newProduct);
    addToast(`🚀 Product "${name.slice(0, 25)}..." posted successfully to store!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-[#0E1527] border border-slate-200 dark:border-cyan-500/40 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#11182A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">
                Post New Electronic Product
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add products to your TechBazzar catalog with high-resolution image uploads</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* SECTION 1: Product Images Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                <UploadCloud className="w-4 h-4" />
                <span>Product Images Upload *</span>
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} attached
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-cyan-500 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-500/10'
                  : 'border-slate-300 dark:border-slate-700 hover:border-cyan-500/60 bg-slate-50 dark:bg-[#131B2E]/60 hover:bg-slate-100 dark:hover:bg-[#131B2E]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <UploadCloud className="w-10 h-10 mx-auto text-cyan-600 dark:text-cyan-400 mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Click to browse or drag & drop product photos
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports JPG, PNG, WEBP, and SVG high-res photos
              </p>
            </div>

            {/* Alternative: Add Image via Direct URL */}
            <div className="flex gap-2 text-xs">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Or paste image URL (Unsplash, CDN, etc.)..."
                className="flex-1 bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] transition-colors"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Add URL
              </button>
            </div>

            {/* Uploaded Images Preview Strip */}
            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {uploadedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group bg-slate-100 dark:bg-slate-900"
                  >
                    <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-cyan-600 text-white text-[9px] font-bold text-center py-0.5">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: General Information */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              General Product Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {/* Product Title */}
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dell XPS 16 OLED (Intel Core Ultra 9, 32GB RAM)"
                  required
                  className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] font-medium transition-colors"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Brand Name *</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Apple, Sony, Samsung, Dell"
                  required
                  className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer transition-colors"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Regular Price */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Regular Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 1999"
                  required
                  className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] font-mono transition-colors"
                />
              </div>

              {/* Sale Price */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Sale / Discount Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="e.g. 1799 (Leave blank if no sale)"
                  className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] font-mono transition-colors"
                />
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Initial Stock Count *</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] font-mono transition-colors"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">SKU Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] font-mono transition-colors"
                />
              </div>

              {/* Promo Badge */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Promotional Badge</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. New Arrival, Hot Deal"
                  className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] transition-colors"
                />
              </div>
            </div>

            {/* Checkboxes: Featured & Flash Deal */}
            <div className="flex items-center gap-6 pt-1 text-xs text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-cyan-600 focus:ring-cyan-500 bg-slate-50 dark:bg-[#131B2E] w-4 h-4"
                />
                <span>Feature on Homepage Spotlight</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFlashDeal}
                  onChange={(e) => setIsFlashDeal(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-cyan-600 focus:ring-cyan-500 bg-slate-50 dark:bg-[#131B2E] w-4 h-4"
                />
                <span>Add to Lightning Flash Deals</span>
              </label>
            </div>
          </div>

          {/* SECTION 3: Descriptions */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Product Description
            </h3>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Short Summary (1-2 sentences)</label>
              <input
                type="text"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="High-performance ultraportable laptop with 4K OLED display and Intel AI acceleration."
                className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Detailed Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed technical features, performance benchmarks, included accessories, and build materials..."
                className="w-full bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] transition-colors"
              />
            </div>
          </div>

          {/* SECTION 4: Technical Specifications */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Technical Specifications (Key - Value)
              </h3>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Specification</span>
              </button>
            </div>

            <div className="space-y-2">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                    placeholder="Specification (e.g. Battery Life)"
                    className="w-1/3 bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] transition-colors"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    placeholder="Value (e.g. 5000 mAh with 65W fast charging)"
                    className="flex-1 bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-[#131B2E] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-2 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-glow-cyan flex items-center gap-2 transition-all transform active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Product to Store</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
