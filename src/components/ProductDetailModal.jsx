import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';

export default function ProductDetailModal() {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    setIsCartOpen 
  } = useApp();
  
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-white max-w-4xl w-full border border-neutral-300 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-neutral-100 text-neutral-800 transition-colors"
          aria-label="Close product modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Image */}
          <div className="relative aspect-[4/5] bg-[#F7F6F2] overflow-hidden flex items-center justify-center">
            {!imageError ? (
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="p-8 text-center">
                <span className="text-xs uppercase tracking-widest text-neutral-400">
                  {product.category}
                </span>
                <p className="font-editorial text-xl text-neutral-700 mt-2">{product.name}</p>
              </div>
            )}

            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-black text-white text-[10px] uppercase tracking-widest px-3 py-1 font-medium">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                  {product.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-light font-editorial text-black tracking-wide mt-1">
                  {product.name}
                </h2>
                
                {/* SKU and Rating */}
                <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500 font-light">
                  <span>SKU: {product.sku}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating || '4.9'} ({product.reviewsCount || 24} student ratings)</span>
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl sm:text-3xl font-semibold text-black tracking-tight">
                  ₱{product.price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-neutral-400 line-through">
                    ₱{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs text-emerald-800 font-medium">
                    (Save ₱{(product.originalPrice - product.price).toLocaleString()})
                  </span>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="py-2 border-y border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500">Stock Availability:</span>
                <span className="font-medium text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  {product.stock > 0 ? `${product.stock} units ready for dispatch` : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Features List */}
              {product.features && (
                <div className="pt-2">
                  <h4 className="text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-2">
                    Key Specifications
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-600 font-light list-disc list-inside">
                    {product.features.map((feat, idx) => (
                      <li key={idx}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons & Quantity */}
            <div className="mt-8 pt-6 border-t border-neutral-200 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-neutral-600 hover:text-black hover:bg-neutral-50 text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-black min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-neutral-600 hover:text-black hover:bg-neutral-50 text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3 px-4 text-xs uppercase tracking-[0.18em] font-medium transition-all flex items-center justify-center gap-2 ${
                    added 
                      ? 'bg-emerald-700 text-white' 
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-3 text-xs uppercase tracking-[0.18em] font-medium border border-black text-black hover:bg-neutral-50 transition-colors"
              >
                Buy Now &amp; Checkout
              </button>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-500 font-light pt-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Pickup or Local Courier</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Guaranteed Authentic Supply</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
