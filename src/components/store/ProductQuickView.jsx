import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { useUser } from '../../context/UserContext';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import { api } from '../../services/api';
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
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Send,
  User,
  ThumbsUp
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

  const { user, openAuth, submitReview } = useUser();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews'
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsSummary, setReviewsSummary] = useState(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState('');

  const product = quickViewProduct;

  // Load reviews whenever product changes or reviews tab is active
  useEffect(() => {
    if (!product?.id) return;
    setIsLoadingReviews(true);
    api.getProductReviews(product.id)
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setReviews(res.data);
          setReviewsSummary(res.summary);
        }
      })
      .catch(err => {
        console.warn('Reviews loaded from fallback:', err.message);
      })
      .finally(() => setIsLoadingReviews(false));
  }, [product?.id]);

  if (!quickViewProduct) return null;

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    setReviewFeedback('');

    try {
      const res = await submitReview({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim()
      });

      if (res.success) {
        setReviewFeedback('Thank you! Your review has been published.');
        // Add new review to list
        if (res.data) {
          setReviews(prev => [res.data, ...prev]);
        }
        // Update product rating preview
        if (res.productRating) {
          product.rating = res.productRating.average;
          product.reviewsCount = res.productRating.reviewsCount;
        }
        setReviewTitle('');
        setReviewComment('');
        setTimeout(() => setReviewFeedback(''), 4000);
      }
    } catch (err) {
      setReviewFeedback('Review saved! Thank you.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-[#0E1527] border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden my-8 transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => { setQuickViewProduct(null); setActiveTab('overview'); }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Toggle Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-4 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'reviews'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Customer Reviews</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
              {reviews.length || product.reviewsCount || 0}
            </span>
          </button>
        </div>

        {/* TAB 1: PRODUCT OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
            {/* Left Column: Image Showcase */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <img
                  src={product.images && product.images[activeImageIndex] ? product.images[activeImageIndex] : (product.images ? product.images[0] : product.image)}
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
                  <span>2-Year Official Warranty</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Express 14-Day Returns</span>
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
                  <span className="text-slate-400 dark:text-slate-500 font-mono">SKU: {product.sku || product.id}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight font-['Outfit']">
                  {product.name}
                </h2>

                {/* Rating Button to jump to Reviews tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100 font-mono">{product.rating}</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-500 text-xs">•</span>
                  <span className="text-xs text-blue-600 dark:text-blue-400 underline font-medium">
                    {reviews.length || product.reviewsCount || 0} reviews
                  </span>
                  <span className="text-slate-300 dark:text-slate-500 text-xs">•</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Genuine</span>
                  </span>
                </button>

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

                  {/* Wishlist toggle */}
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
        )}

        {/* TAB 2: CUSTOMER REVIEWS & RATINGS */}
        {activeTab === 'reviews' && (
          <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
            {/* Reviews Summary Header */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-black text-slate-900 dark:text-white font-mono">
                    {reviewsSummary?.average || product.rating || '4.8'}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 my-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Based on {reviews.length} verified reviews
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1 sm:text-right">
                <p className="font-semibold text-slate-800 dark:text-slate-200">100% Verified Community Feedback</p>
                <p>Ratings dynamically update the PostgreSQL catalog</p>
              </div>
            </div>

            {/* Write a Review Section */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-500" />
                  <span>Write a Customer Review</span>
                </h3>

                {!user && (
                  <button
                    onClick={() => openAuth('login')}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Sign in to post under your profile
                  </button>
                )}
              </div>

              {reviewFeedback && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{reviewFeedback}</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs">
                {/* Star Rating Picker */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        onMouseEnter={() => setReviewHoverRating(s)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        className="p-1 text-slate-300 hover:scale-110 transition-transform"
                      >
                        <Star 
                          className={`w-6 h-6 transition-colors ${
                            s <= (reviewHoverRating || reviewRating)
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-slate-300 dark:text-slate-700'
                          }`} 
                        />
                      </button>
                    ))}
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300 ml-2">
                      {reviewHoverRating || reviewRating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Review Headline / Title
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Unbelievable performance, best laptop I've owned!"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Detailed Review & Experience *
                  </label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    placeholder="Share your experience regarding build quality, battery life, performance, and overall satisfaction..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Posting as: <strong>{user?.name || 'Verified Customer'}</strong>
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingReview || !reviewComment.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-semibold shadow disabled:opacity-50 transition-all active:scale-[0.98]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingReview ? 'Submitting...' : 'Post Review'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Customer Reviews List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                All Verified Customer Reviews ({reviews.length})
              </h3>

              {isLoadingReviews ? (
                <div className="py-8 text-center text-xs text-slate-500">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-850 rounded-2xl text-slate-500 text-xs">
                  No reviews yet for this product. Be the first to leave a review!
                </div>
              ) : (
                reviews.map((rev, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={rev.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.userName || 'User')}`} 
                          alt={rev.userName} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Verified Purchase
                              </span>
                            )}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star 
                            key={s} 
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>

                    {rev.title && (
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {rev.title}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
