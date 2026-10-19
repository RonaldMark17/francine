import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from '../ProductCard';
import { 
  ArrowRight, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Tag, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function DynamicPageRenderer({ page }) {
  const { products, navigateTo } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  if (!page || !page.components || page.components.length === 0) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4">
        <h2 className="font-editorial text-2xl text-neutral-800 mb-2">{page?.title || 'Untitled Page'}</h2>
        <p className="text-sm text-neutral-500 font-light">
          This page does not have any content sections yet. Authorized administrators can add components in the Website Builder.
        </p>
      </div>
    );
  }

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <article className="min-h-screen bg-[#FAF9F5] text-[#121212]">
      {/* Dynamic Page Header Metadata */}
      <header className="sr-only">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </header>

      {/* Render Components sequentially */}
      {page.components.map((comp) => {
        const { id, type, data = {} } = comp;

        switch (type) {
          /* 1. HERO BANNER */
          case 'hero': {
            const isDark = data.theme === 'dark';
            const isCenter = data.align === 'center';
            return (
              <section 
                key={id}
                className="relative min-h-[460px] sm:min-h-[560px] flex items-center overflow-hidden border-b border-neutral-300"
              >
                {/* Background Image with Overlay */}
                {data.imageUrl && (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={data.imageUrl}
                      alt={data.title || 'Banner'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/70'} backdrop-blur-[1px]`} />
                  </div>
                )}

                <div className={`relative z-10 max-w-6xl mx-auto px-6 py-20 w-full ${isCenter ? 'text-center' : 'text-left'}`}>
                  {data.eyebrow && (
                    <span className={`inline-block text-[11px] uppercase tracking-[0.25em] font-mono mb-4 px-3 py-1 border ${
                      isDark ? 'text-amber-300 border-amber-300/40 bg-black/40' : 'text-neutral-700 border-neutral-300 bg-white/80'
                    }`}>
                      {data.eyebrow}
                    </span>
                  )}
                  <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-light font-editorial uppercase tracking-[0.08em] leading-tight mb-6 max-w-3xl ${
                    isCenter ? 'mx-auto' : ''
                  } ${isDark ? 'text-white' : 'text-black'}`}>
                    {data.title}
                  </h2>
                  {data.subtitle && (
                    <p className={`text-sm sm:text-base font-light leading-relaxed mb-8 max-w-2xl ${
                      isCenter ? 'mx-auto' : ''
                    } ${isDark ? 'text-neutral-200' : 'text-neutral-700'}`}>
                      {data.subtitle}
                    </p>
                  )}
                  {data.buttonText && (
                    <button
                      onClick={() => navigateTo(data.buttonLink || 'shop')}
                      className={`inline-flex items-center gap-3 px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all ${
                        isDark 
                          ? 'bg-white text-black hover:bg-neutral-100 shadow-lg' 
                          : 'bg-black text-white hover:bg-neutral-800 shadow-md'
                      }`}
                    >
                      <span>{data.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </section>
            );
          }

          /* 2. ANNOUNCEMENT BAR */
          case 'announcement': {
            return (
              <section key={id} className="bg-black text-white py-3.5 px-6 border-b border-neutral-800 text-center text-xs">
                <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 flex-wrap">
                  {data.badge && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-amber-400 text-black font-semibold">
                      {data.badge}
                    </span>
                  )}
                  <span className="tracking-wide font-light">{data.text}</span>
                </div>
              </section>
            );
          }

          /* 3. TEXT & IMAGE SPLIT */
          case 'text_image': {
            const isImageRight = data.imagePosition !== 'left';
            return (
              <section key={id} className="py-16 sm:py-24 border-b border-neutral-200">
                <div className="max-w-6xl mx-auto px-6">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    isImageRight ? '' : 'lg:grid-flow-dense'
                  }`}>
                    {/* Text Column */}
                    <div className={`space-y-6 ${!isImageRight ? 'lg:col-start-2' : ''}`}>
                      {data.eyebrow && (
                        <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono block">
                          {data.eyebrow}
                        </span>
                      )}
                      <h3 className="text-2xl sm:text-4xl font-light font-editorial uppercase tracking-[0.06em] text-black">
                        {data.title}
                      </h3>
                      <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed whitespace-pre-line">
                        {data.description}
                      </p>
                      {data.buttonText && (
                        <button
                          onClick={() => navigateTo(data.buttonLink || 'shop')}
                          className="inline-flex items-center gap-2 px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-all text-xs uppercase tracking-[0.2em] font-medium"
                        >
                          <span>{data.buttonText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Image Column */}
                    <div className={`${!isImageRight ? 'lg:col-start-1' : ''}`}>
                      <div className="relative border border-neutral-300 shadow-sm overflow-hidden bg-white aspect-[4/3] group">
                        {data.imageUrl ? (
                          <img
                            src={data.imageUrl}
                            alt={data.title || 'Feature'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                            No image selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          /* 4. PRODUCT GRID */
          case 'product_grid': {
            const categoryFilter = data.category && data.category !== 'All'
              ? products.filter(p => p.category === data.category)
              : products;
            const displayed = categoryFilter.slice(0, data.limit || 4);

            return (
              <section key={id} className="py-16 sm:py-24 border-b border-neutral-200">
                <div className="max-w-6xl mx-auto px-6 space-y-10">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-300 pb-4">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.08em] text-black">
                        {data.title || 'Curated Products'}
                      </h3>
                      {data.subtitle && (
                        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1">
                          {data.subtitle}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => navigateTo('shop')}
                      className="text-xs uppercase tracking-wider font-medium text-black hover:underline flex items-center gap-1.5"
                    >
                      <span>Explore Shop</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayed.map(p => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          /* 5. FAQ ACCORDION */
          case 'faq': {
            const items = data.items || [];
            return (
              <section key={id} className="py-16 sm:py-20 border-b border-neutral-200 bg-white">
                <div className="max-w-3xl mx-auto px-6 space-y-8">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono">
                      Help &amp; Answers
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.06em] text-black">
                      {data.title || 'Frequently Asked Questions'}
                    </h3>
                  </div>

                  <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
                    {items.map((item, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div key={idx} className="py-4">
                          <button
                            onClick={() => toggleFaq(idx)}
                            className="w-full text-left flex items-center justify-between gap-4 focus:outline-none group"
                          >
                            <span className="text-xs sm:text-sm font-medium text-neutral-900 group-hover:text-black">
                              {item.q}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isOpen && (
                            <div className="pt-3 text-xs text-neutral-600 font-light leading-relaxed animate-fade-in pr-6">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          }

          /* 6. RICH TEXT EDITORIAL */
          case 'rich_text': {
            return (
              <section key={id} className="py-16 sm:py-20 border-b border-neutral-200">
                <div className="max-w-3xl mx-auto px-6 space-y-6">
                  {data.title && (
                    <h3 className="text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.06em] text-black text-center">
                      {data.title}
                    </h3>
                  )}
                  <div className="prose prose-neutral max-w-none text-xs sm:text-sm font-light text-neutral-700 leading-relaxed whitespace-pre-line text-justify">
                    {data.content}
                  </div>
                </div>
              </section>
            );
          }

          /* 7. CALL TO ACTION */
          case 'cta': {
            return (
              <section key={id} className="py-16 sm:py-20 bg-neutral-900 text-white text-center">
                <div className="max-w-2xl mx-auto px-6 space-y-6">
                  <h3 className="text-2xl sm:text-4xl font-light font-editorial uppercase tracking-[0.08em] text-white">
                    {data.title}
                  </h3>
                  {data.subtitle && (
                    <p className="text-xs sm:text-sm font-light text-neutral-300 leading-relaxed">
                      {data.subtitle}
                    </p>
                  )}
                  <div>
                    <button
                      onClick={() => navigateTo(data.buttonLink || 'shop')}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-200 transition-all shadow-md"
                    >
                      <span>{data.buttonText || 'Learn More'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>
            );
          }

          default:
            return null;
        }
      })}
    </article>
  );
}
