import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Tag, Sparkles, Copy, Check, AlertCircle, ArrowRight, Gift } from 'lucide-react';

export default function PromotionsPage() {
  const { 
    products, 
    promotions, 
    applyPromoCode, 
    setIsCartOpen,
    showToast,
    navigateTo 
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(null);

  // Discounted products list
  const discountedProducts = products.filter(
    p => p.isDiscounted || (p.originalPrice && p.originalPrice > p.price)
  );

  const handleCopyAndApply = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyPromoCode(code);
    showToast(`Code "${code}" copied and applied to your bag!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="border-b border-neutral-200 pb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
          Exclusive Offers
        </span>
        <h1 className="text-3xl sm:text-4xl font-light font-editorial text-black tracking-wide mt-1 uppercase">
          Promotions &amp; Academic Perks
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-2 max-w-xl">
          Discover seasonal price drops, student package bundles, and classroom volume discounts tailored to the university community.
        </p>

        {/* Demo Disclaimer Alert */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 max-w-2xl">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="font-light">
            <strong className="font-medium">Demonstration Notice:</strong> All discount codes and promotional banners shown on this page are sample demonstration data designed for this academic presentation.
          </p>
        </div>
      </div>

      {/* Promotional Cards Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-[#FAF9F5] border border-neutral-300 p-6 flex flex-col justify-between space-y-6 hover:border-black transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest bg-black text-white px-2.5 py-1 font-medium">
                  {promo.discount}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                  {promo.badge}
                </span>
              </div>

              <h3 className="font-editorial text-xl text-black leading-snug">
                {promo.title}
              </h3>

              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                {promo.tagline}
              </p>

              <div className="pt-2 text-[11px] text-neutral-500 font-light border-t border-neutral-200">
                Condition: {promo.condition}
              </div>
            </div>

            {/* Promo Code Copy Row */}
            <div className="pt-2">
              <div className="flex items-center justify-between bg-white border border-neutral-300 p-2.5">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">Code:</span>
                  <span className="font-mono font-bold text-xs text-black tracking-widest">
                    {promo.code}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyAndApply(promo.code)}
                  className="px-3 py-1.5 bg-black text-white text-[10px] uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                >
                  {copiedCode === promo.code ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Apply Code</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-[10px] text-neutral-400 mt-1.5 text-right font-light">
                Valid until {promo.validUntil}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Deals Products Grid */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
              Live Discounts
            </span>
            <h2 className="text-2xl sm:text-3xl font-light font-editorial text-black tracking-wide mt-1">
              Discounted Inventory Items
            </h2>
          </div>
          <span className="text-xs text-neutral-500 font-light mt-2 md:mt-0">
            {discountedProducts.length} discounted products available today
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {discountedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Campus Perks Featurette */}
      <div className="bg-[#161616] text-white p-8 sm:p-12 border border-black">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-amber-300">
            <Gift className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-medium">
              Academic Loyalty Advantage
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-light font-editorial tracking-wide uppercase">
            Are You a Teacher or Department Head?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Mama Mo offers institutional invoicing, bulk classroom delivery, and 30-day corporate terms for recognized schools, colleges, and student organizations.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('contact')}
              className="px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-medium hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
            >
              <span>Inquire for Institutional Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
