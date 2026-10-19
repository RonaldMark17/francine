import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Eye, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, setQuickViewProduct } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  return (
    <div 
      className="group relative flex flex-col bg-white border border-[#EBE8E1] hover:border-black transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div 
        onClick={() => setQuickViewProduct(product)}
        className="relative w-full aspect-[4/5] bg-[#F7F6F2] overflow-hidden cursor-pointer"
      >
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F3F1EC]">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
              {product.category}
            </span>
            <span className="text-sm font-editorial text-neutral-600 mt-2">
              {product.name}
            </span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-[#121212] text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-medium">
              -{discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-[#FAF9F5] text-neutral-900 border border-neutral-300 text-[9px] uppercase tracking-wider px-2 py-0.5 font-medium">
              Featured
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 z-10">
          {product.stock <= 5 ? (
            <span className="bg-amber-100 text-amber-900 text-[9px] tracking-wider uppercase px-2 py-0.5 border border-amber-300">
              Only {product.stock} left
            </span>
          ) : (
            <span className="text-[10px] text-neutral-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 tracking-wider uppercase border border-neutral-200">
              In Stock
            </span>
          )}
        </div>

        {/* Quick Action Overlay (Slide Up on Hover) */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 bg-white text-black text-[11px] uppercase tracking-wider py-2 px-3 hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5 font-medium shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`flex-1 text-[11px] uppercase tracking-wider py-2 px-3 transition-colors flex items-center justify-center gap-1.5 font-medium shadow-sm ${
              addedAnim 
                ? 'bg-emerald-600 text-white' 
                : 'bg-black text-white hover:bg-neutral-800'
            }`}
          >
            {addedAnim ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium mb-1">
            {product.category}
          </div>
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="text-sm font-medium text-[#161616] group-hover:text-neutral-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Price & SKU */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-black tracking-tight">
              ₱{product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                ₱{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] text-neutral-400 font-mono tracking-wider">
            {product.sku}
          </span>
        </div>
      </div>
    </div>
  );
}
