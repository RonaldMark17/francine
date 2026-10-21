import React, { useEffect, useRef, useState } from 'react';
import { CoreContentContext, CoreSectionsContext } from './CoreContentContext';
import { useApp } from '../../context/AppContext';
import ProductCard from '../ProductCard';
import { DEFAULT_SECTION_SETTINGS } from '../../data/sectionSettings';
import { useBuilderSelection } from './BuilderSelectionContext';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import { 
  ArrowRight, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Tag, 
  GraduationCap,
  Timer,
  Printer,
  Package,
  Star,
  Quote,
  MapPin,
  Phone,
  Mail,
  X,
  Image as ImageIcon
} from 'lucide-react';

const FEATURE_ICONS = {
  printer: Printer,
  'graduation-cap': GraduationCap,
  timer: Timer,
  'shield-check': ShieldCheck,
  truck: Truck,
  tag: Tag,
  sparkles: Sparkles,
  package: Package,
  'map-pin': MapPin,
  phone: Phone,
  mail: Mail,
  clock: Clock
};

const getSafeMapUrl = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : null;
  } catch {
    return null;
  }
};

const SECTION_PADDING = { none: 0, small: 24, medium: 48, large: 96 };

function EditableText({ as: Tag = 'span', value, isEditing, onChange, onFocus, className }) {
  return <Tag
    className={className}
    data-builder-inline-text={isEditing ? 'true' : undefined}
    contentEditable={isEditing}
    suppressContentEditableWarning
    aria-label={isEditing ? 'Edit text in preview' : undefined}
    onFocus={onFocus}
    onBlur={event => {
      const nextValue = event.currentTarget.textContent.replace(/\u200b/g, '');
      if (nextValue !== String(value ?? '')) onChange?.(nextValue);
    }}
  >{value}</Tag>;
}

function SectionFrame({ component, navigateTo, children, isEditing = false, onAddSubSection, onRemoveSubSection, onUpdateItems, onUpdateCollectionItem }) {
  const { activeSectionId, activeItemId, setActiveSectionId, setActiveItemId, setActiveInspectorNode } = useBuilderSelection();
  const { data = {} } = component;
  const subSections = Array.isArray(data.subSections) ? data.subSections : [];
  const itemCardTypes = ['faq', 'features_grid', 'testimonials', 'pricing_table', 'steps', 'category_grid', 'gallery'];
  const supportsItemCards = itemCardTypes.includes(component.type);
  const items = Array.isArray(data.items) ? data.items : [];
  const itemFields = {
    faq: ['q', 'a'],
    features_grid: ['title', 'description'],
    testimonials: ['name', 'quote'],
    pricing_table: ['service', 'spec'],
    steps: ['title', 'description'],
    category_grid: ['category', 'description'],
    gallery: ['caption', 'caption']
  }[component.type] || ['title', 'description'];
  const frameRef = useRef(null);
  const [animationVisible, setAnimationVisible] = useState(() => typeof IntersectionObserver === 'undefined');
  const hasStoredSettings = Boolean(data.settings);
  const settings = { ...DEFAULT_SECTION_SETTINGS, ...(data.settings || {}) };
  const hasCustomBackground = settings.backgroundType !== 'default';
  const safeAnchorId = settings.anchorId.trim().replace(/^#/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
  const minHeight = settings.height === 'fullscreen'
    ? '100vh'
    : settings.height === 'compact'
      ? '400px'
      : settings.height === 'custom'
        ? `${Math.max(100, Number(settings.customHeight) || 600)}px`
        : undefined;
  const padding = hasStoredSettings ? SECTION_PADDING[settings.verticalPadding] ?? SECTION_PADDING.medium : null;
  const overlayColor = settings.overlayTint === 'custom'
    ? settings.overlayCustomColor || '#000000'
    : settings.overlayTint;
  const visibilityClass = settings.hideOnMobile && settings.hideOnDesktop
    ? 'hidden'
    : settings.hideOnMobile
      ? 'hidden sm:block'
      : settings.hideOnDesktop ? 'lg:hidden' : '';
  const containerClass = !hasStoredSettings
    ? ''
    : settings.containerWidth === 'full'
      ? 'builder-container-full'
      : settings.containerWidth === 'narrow' ? 'builder-container-narrow' : 'builder-container-standard';
  const textClass = settings.textMode === 'light'
    ? 'builder-text-light'
    : settings.textMode === 'dark'
      ? 'builder-text-dark'
      : settings.textMode === 'custom' ? 'builder-text-custom' : '';
  const headlineClass = hasStoredSettings ? `builder-headline-${settings.headlineSize}` : '';
  const animationClass = settings.scrollAnimation === 'fade'
    ? 'builder-animate-fade'
    : settings.scrollAnimation === 'slide'
      ? 'builder-animate-slide' : settings.scrollAnimation === 'zoom' ? 'builder-animate-zoom' : '';
  const appliedAnimationClass = settings.scrollAnimation === 'none'
    ? ''
    : animationVisible ? animationClass : 'builder-animation-pending';
  const wrapperStyle = {
    minHeight,
    backgroundColor: settings.backgroundType === 'solid' ? settings.backgroundColor : undefined,
    backgroundImage: settings.backgroundType === 'gradient'
      ? `linear-gradient(${settings.gradientDirection}, ${settings.gradientFrom}, ${settings.gradientTo})`
      : settings.backgroundType === 'image' && (settings.backgroundImageUrl || data.imageUrl)
        ? `url("${String(settings.backgroundImageUrl || data.imageUrl).replace(/"/g, '%22')}")`
        : undefined,
    backgroundPosition: settings.imagePosition,
    backgroundSize: settings.backgroundType === 'image' ? 'cover' : undefined,
    '--builder-text-color': settings.customTextColor
  };
  const styledChild = React.isValidElement(children)
    ? React.cloneElement(children, {
        className: `${children.props.className || ''} relative z-10`,
        style: {
          ...children.props.style,
          minHeight,
          paddingTop: padding === null ? undefined : `${padding}px`,
          paddingBottom: padding === null ? undefined : `${padding}px`,
          background: hasCustomBackground ? 'transparent' : children.props.style?.background
        }
      })
    : children;
  const secondaryButtonClass = settings.secondaryButtonStyle === 'primary'
    ? 'bg-black text-white border-black hover:bg-neutral-800'
    : settings.secondaryButtonStyle === 'minimal'
      ? 'border-transparent border-b-current px-1 py-2'
      : 'bg-transparent border-current hover:bg-black hover:text-white';

  useEffect(() => {
    if (settings.scrollAnimation === 'none' || typeof IntersectionObserver === 'undefined' || !frameRef.current) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setAnimationVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });

    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [settings.scrollAnimation]);

  return (
    <div
      ref={frameRef}
      id={safeAnchorId || undefined}
      data-component-id={component.id}
      className={`relative isolate overflow-hidden ${visibilityClass} ${containerClass} ${textClass} ${headlineClass} ${appliedAnimationClass} ${activeSectionId === component.id ? 'ring-2 ring-amber-400 ring-inset z-20' : ''}`}
      style={wrapperStyle}
    >
      {settings.backgroundType === 'video' && settings.backgroundVideoUrl && (
        <video className="absolute inset-0 z-0 w-full h-full object-cover" src={settings.backgroundVideoUrl} autoPlay muted loop playsInline aria-hidden="true" />
      )}
      {['image', 'video'].includes(settings.backgroundType) && Number(settings.overlayOpacity) > 0 && (
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ backgroundColor: overlayColor, opacity: Number(settings.overlayOpacity) / 100 }} />
      )}
      {styledChild}
      {isEditing && supportsItemCards && <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-6 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => <button key={item.id || index} type="button" data-builder-item-id={item.id || `item-${index}`} onClick={event => { event.stopPropagation(); setActiveItemId?.(item.id || `item-${index}`); }} className={`min-h-24 rounded-xl border border-neutral-300 bg-white/80 p-5 text-left shadow-sm ${activeItemId === (item.id || `item-${index}`) ? 'ring-2 ring-amber-400' : ''}`}>
          <EditableText className="block truncate text-sm font-medium text-neutral-900" value={item[itemFields[0]] || `Item ${index + 1}`} isEditing={isEditing} onFocus={() => { setActiveSectionId?.(component.id); setActiveItemId?.(item.id || null); }} onChange={value => onUpdateCollectionItem?.(component.id, 'items', index, itemFields[0], value)} />
          <EditableText className="mt-1 block line-clamp-2 text-xs text-neutral-500" value={item[itemFields[1]] || ''} isEditing={isEditing} onFocus={() => { setActiveSectionId?.(component.id); setActiveItemId?.(item.id || null); }} onChange={value => onUpdateCollectionItem?.(component.id, 'items', index, itemFields[1], value)} />
        </button>)}
        <button type="button" data-add-subsection="true" onClick={() => onUpdateItems?.(component.id, [...items, createPreviewItem(component.type)])} className="min-h-24 rounded-xl border-2 border-dashed border-amber-500/70 px-4 py-6 text-sm font-medium text-amber-700 hover:bg-amber-50">+ Add Sub-Section / Card</button>
      </div>}
      {(subSections.length > 0 || isEditing) && (
        <div className={`relative z-10 mx-auto grid w-full max-w-6xl gap-5 px-6 pb-10 ${textClass}`} style={{ gridTemplateColumns: `repeat(${Math.min(4, Math.max(1, Number(data.subSectionColumns) || Math.min(subSections.length, 3)))}, minmax(0, 1fr))` }}>
          {subSections.map((item, index) => (
            <article key={item.id || index} data-builder-item-id={item.id || `subsection-${index}`} onClick={event => { event.stopPropagation(); setActiveItemId?.(item.id || `subsection-${index}`); }} className={`relative rounded-xl border border-neutral-300 bg-white/80 p-5 shadow-sm ${activeItemId === item.id ? 'ring-2 ring-amber-400' : ''}`}>
              {isEditing && <button type="button" data-subsection-action="true" onClick={() => onRemoveSubSection?.(component.id, item.id)} aria-label={`Delete ${item.title || 'sub-section'}`} title="Delete sub-section" className="absolute right-2 top-2 rounded-md border border-rose-200 bg-white px-2 py-1 text-sm text-rose-600 hover:bg-rose-50">×</button>}
              {item.eyebrow && <EditableText as="p" className="mb-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500" value={item.eyebrow} isEditing={isEditing} onFocus={() => { const itemId = item.id || `subsection-${index}`; setActiveSectionId?.(component.id); setActiveItemId?.(itemId); setActiveInspectorNode?.(`component:${component.id}:${itemId}:eyebrow`); }} onChange={value => onUpdateCollectionItem?.(component.id, 'subSections', index, 'eyebrow', value)} />}
              {item.icon && <span className="mb-3 inline-flex rounded-lg bg-amber-50 p-2 text-amber-700">{FEATURE_ICONS[item.icon] ? React.createElement(FEATURE_ICONS[item.icon], { className: 'h-5 w-5' }) : item.icon}</span>}
              <EditableText as="h3" className="mb-2 text-lg font-medium" value={item.title || 'New sub-section'} isEditing={isEditing} onFocus={() => { const itemId = item.id || `subsection-${index}`; setActiveSectionId?.(component.id); setActiveItemId?.(itemId); setActiveInspectorNode?.(`component:${component.id}:${itemId}:title`); }} onChange={value => onUpdateCollectionItem?.(component.id, 'subSections', index, 'title', value)} />
              {item.description && <EditableText as="p" className="text-sm leading-relaxed text-neutral-600" value={item.description} isEditing={isEditing} onFocus={() => { const itemId = item.id || `subsection-${index}`; setActiveSectionId?.(component.id); setActiveItemId?.(itemId); setActiveInspectorNode?.(`component:${component.id}:${itemId}:description`); }} onChange={value => onUpdateCollectionItem?.(component.id, 'subSections', index, 'description', value)} />}
              {item.image && <img src={item.image} alt={item.title || ''} className="mt-4 max-h-48 w-full rounded-lg object-cover" />}
            </article>
          ))}
          {isEditing && <button type="button" data-add-subsection="true" onClick={onAddSubSection} className="min-h-32 rounded-xl border-2 border-dashed border-amber-500/70 px-4 py-6 text-sm font-medium text-amber-700 hover:bg-amber-50">+ Add Sub-Section / Card</button>}
        </div>
      )}
      {settings.secondaryButtonEnabled && settings.secondaryButtonText && (
        <div className="relative z-10 flex justify-center px-6 pb-8 -mt-4">
          <button
            type="button"
            onClick={() => navigateTo(settings.secondaryButtonLink || 'about')}
            className={`inline-flex items-center gap-2 border px-6 py-3 text-[10px] uppercase tracking-[0.18em] font-semibold transition-colors ${secondaryButtonClass}`}
          >
            {settings.secondaryButtonText}<ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function createPreviewItem(type) {
  const defaults = {
    faq: { q: 'New question', a: 'Add an answer.' },
    features_grid: { icon: 'sparkles', title: 'New Feature', description: 'Describe this feature.' },
    testimonials: { name: 'Customer Name', role: 'Role / School', quote: 'Add a review.', rating: 5 },
    pricing_table: { service: 'New Service', spec: 'Size / specification', price: 'From ₱0', notes: 'Turnaround time' },
    steps: { title: 'New Step', description: 'Describe this step.' },
    category_grid: { category: 'New Category', description: 'Describe this category.' },
    gallery: { image: '', caption: 'New card' }
  };
  return { id: `item-${crypto.randomUUID()}`, ...(defaults[type] || { title: 'New Card', description: 'Add a description.' }) };
}

export default function DynamicPageRenderer({ page, asFragment = false, coreContent = null, isEditing = false, onAddSubSection, onRemoveSubSection, onUpdateItems, onUpdateComponentData, onUpdateCollectionItem }) {
  const { products, navigateTo } = useApp();
  const { setActiveSectionId, setActiveItemId, setActiveInspectorNode } = useBuilderSelection();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  useBodyScrollLock(Boolean(lightboxImage));

  if (!page || (!coreContent && !asFragment && (!page.components || page.components.length === 0))) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4">
        <h2 className="font-editorial text-2xl text-neutral-800 mb-2">{page?.title || 'Untitled Page'}</h2>
        <p className="text-sm text-neutral-500 font-light">
          This page does not have any content sections yet. Authorized administrators can add components in the Website Builder.
        </p>
      </div>
    );
  }
  if (!page.components?.length && !coreContent) return null;

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const PageContainer = asFragment ? 'div' : 'article';
  const componentsToRender = coreContent
    ? [
        ...page.components.filter(component => component.data?.placement !== 'bottom' && !component.data?.placement?.startsWith('before:')),
        { id: 'system-core-content', type: 'system-core-content', data: {} },
        ...page.components.filter(component => component.data?.placement === 'bottom')
      ]
    : page.components;
  return (
    <PageContainer className={`${asFragment ? '' : 'min-h-screen'} bg-[#FAF9F5] text-[#121212]`}>
      {/* Dynamic Page Header Metadata */}
      <header className="sr-only">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </header>

      {/* Render Components sequentially */}
      {componentsToRender.map((comp) => {
        const { id, type, data = {} } = comp;
        if (type === 'system-core-content') {
          return <CoreContentContext.Provider key={id} value={page.nativeContent || {}}>
            <CoreSectionsContext.Provider value={placement => {
              const sections = page.components.filter(component => component.data?.placement === placement);
              return sections.length ? <DynamicPageRenderer
                page={{ ...page, components: sections }}
                asFragment
                isEditing={isEditing}
                onAddSubSection={onAddSubSection}
                onRemoveSubSection={onRemoveSubSection}
                onUpdateItems={onUpdateItems}
                onUpdateComponentData={onUpdateComponentData}
                onUpdateCollectionItem={onUpdateCollectionItem}
              /> : null;
            }}>{coreContent}</CoreSectionsContext.Provider>
          </CoreContentContext.Provider>;
        }

        const editText = (value, field, as = 'span', itemIndex = null, collectionKey = 'items') => <EditableText
          as={as}
          value={value}
          isEditing={isEditing}
          onFocus={() => {
            const itemId = itemIndex === null ? null : data[collectionKey]?.[itemIndex]?.id || `item-${itemIndex}`;
            setActiveSectionId?.(id);
            setActiveItemId?.(itemId);
            setActiveInspectorNode?.(itemIndex === null
              ? `component:${id}:${field}`
              : `component:${id}:${itemId}:${field}`);
          }}
          onChange={nextValue => itemIndex === null
            ? onUpdateComponentData?.(id, field, nextValue)
            : onUpdateCollectionItem?.(id, collectionKey, itemIndex, field, nextValue)}
        />;

        return (
          <SectionFrame key={id} component={comp} navigateTo={navigateTo} isEditing={isEditing} onAddSubSection={() => onAddSubSection?.(id)} onRemoveSubSection={onRemoveSubSection} onUpdateItems={onUpdateItems} onUpdateCollectionItem={onUpdateCollectionItem}>
          {(() => {
          switch (type) {
          /* 1. HERO BANNER */
          case 'hero': {
            const isDark = data.theme === 'dark';
            const isCenter = data.align === 'center';
            return (
              <section 
                key={id}
                data-component-id={id}
                className="relative min-h-[460px] sm:min-h-[560px] flex items-center overflow-hidden border-b border-neutral-300"
              >
                {/* Background Image with Overlay */}
                {data.imageUrl && (!data.settings?.backgroundType || data.settings.backgroundType === 'default') && (
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
                      {editText(data.eyebrow, 'eyebrow')}
                    </span>
                  )}
                  <h2 className={`builder-section-headline text-3xl sm:text-5xl lg:text-6xl font-light font-editorial uppercase tracking-[0.08em] leading-tight mb-6 max-w-3xl ${
                    isCenter ? 'mx-auto' : ''
                  } ${isDark ? 'text-white' : 'text-black'}`}>
                    {editText(data.title, 'title')}
                  </h2>
                  {data.subtitle && (
                    <p className={`builder-section-copy text-sm sm:text-base font-light leading-relaxed mb-8 max-w-2xl ${
                      isCenter ? 'mx-auto' : ''
                    } ${isDark ? 'text-neutral-200' : 'text-neutral-700'}`}>
                      {editText(data.subtitle, 'subtitle')}
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
                      {editText(data.buttonText, 'buttonText')}
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
              <section key={id} data-component-id={id} className="bg-black text-white py-3.5 px-6 border-b border-neutral-800 text-center text-xs">
                <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 flex-wrap">
                  {data.badge && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-amber-400 text-black font-semibold">
                      {editText(data.badge, 'badge')}
                    </span>
                  )}
                  {editText(data.text, 'text')}
                </div>
              </section>
            );
          }

          /* 3. TEXT & IMAGE SPLIT */
          case 'text_image': {
            const isImageRight = data.imagePosition !== 'left';
            return (
              <section key={id} data-component-id={id} className="py-16 sm:py-24 border-b border-neutral-200">
                <div className="max-w-6xl mx-auto px-6">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    isImageRight ? '' : 'lg:grid-flow-dense'
                  }`}>
                    {/* Text Column */}
                    <div className={`space-y-6 ${!isImageRight ? 'lg:col-start-2' : ''}`}>
                      {data.eyebrow && (
                        <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono block">
                          {editText(data.eyebrow, 'eyebrow')}
                        </span>
                      )}
                      <h3 className="builder-section-headline text-2xl sm:text-4xl font-light font-editorial uppercase tracking-[0.06em] text-black">
                        {editText(data.title, 'title')}
                      </h3>
                      <p className="builder-section-copy text-sm sm:text-base font-light text-neutral-600 leading-relaxed whitespace-pre-line">
                        {editText(data.description, 'description')}
                      </p>
                      {data.buttonText && (
                        <button
                          onClick={() => navigateTo(data.buttonLink || 'shop')}
                          className="inline-flex items-center gap-2 px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-all text-xs uppercase tracking-[0.2em] font-medium"
                        >
                          {editText(data.buttonText, 'buttonText')}
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
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/paper_one_ream.jpg';
                            }}
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
              <section key={id} data-component-id={id} className="py-16 sm:py-24 border-b border-neutral-200">
                <div className="max-w-6xl mx-auto px-6 space-y-10">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-300 pb-4">
                    <div>
                      <h3 className="builder-section-headline text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.08em] text-black">
                        {editText(data.title || 'Curated Products', 'title')}
                      </h3>
                      {data.subtitle && (
                        <p className="builder-section-copy text-xs sm:text-sm text-neutral-500 font-light mt-1">
                          {editText(data.subtitle, 'subtitle')}
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
              <section key={id} data-component-id={id} className="py-16 sm:py-20 border-b border-neutral-200 bg-white">
                <div className="max-w-3xl mx-auto px-6 space-y-8">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono">
                      Help &amp; Answers
                    </span>
                    <h3 className="builder-section-headline text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.06em] text-black">
                      {editText(data.title || 'Frequently Asked Questions', 'title')}
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
                              {editText(item.q, 'q', 'span', idx)}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isOpen && (
                            <div className="pt-3 text-xs text-neutral-600 font-light leading-relaxed animate-fade-in pr-6">
                              {editText(item.a, 'a', 'span', idx)}
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
              <section key={id} data-component-id={id} className="py-16 sm:py-20 border-b border-neutral-200">
                <div className="max-w-3xl mx-auto px-6 space-y-6">
                  {data.title && (
                    <h3 className="builder-section-headline text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.06em] text-black text-center">
                      {editText(data.title, 'title')}
                    </h3>
                  )}
                  <div className="builder-section-copy prose prose-neutral max-w-none text-xs sm:text-sm font-light text-neutral-700 leading-relaxed whitespace-pre-line text-justify">
                    {editText(data.content, 'content')}
                  </div>
                </div>
              </section>
            );
          }

          /* 7. CALL TO ACTION */
          case 'cta': {
            return (
              <section key={id} data-component-id={id} className="py-16 sm:py-20 bg-neutral-900 text-white text-center">
                <div className="max-w-2xl mx-auto px-6 space-y-6">
                  <h3 className="builder-section-headline text-2xl sm:text-4xl font-light font-editorial uppercase tracking-[0.08em] text-white">
                    {editText(data.title, 'title')}
                  </h3>
                  {data.subtitle && (
                    <p className="builder-section-copy text-xs sm:text-sm font-light text-neutral-300 leading-relaxed">
                      {editText(data.subtitle, 'subtitle')}
                    </p>
                  )}
                  <div>
                    <button
                      onClick={() => navigateTo(data.buttonLink || 'shop')}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-200 transition-all shadow-md"
                    >
                      {editText(data.buttonText || 'Learn More', 'buttonText')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>
            );
          }

          /* 8. VALUE PROPOSITION / FEATURES GRID */
          case 'features_grid': {
            const items = data.items || [];
            const columnClass = Number(data.columns) === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
            return (
              <section key={id} data-component-id={id} className="py-16 sm:py-20 border-b border-neutral-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 space-y-10">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono">Our Promise</span>
                    <h3 className="builder-section-headline text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.07em] text-black">
                      {editText(data.title || 'Why Choose Us', 'title')}
                    </h3>
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${columnClass} gap-4`}>
                    {items.map((item, index) => {
                      const Icon = FEATURE_ICONS[item.icon] || Sparkles;
                      return (
                        <div key={index} className="border border-neutral-200 bg-[#FAF9F5] p-6 text-center space-y-4 hover:border-neutral-400 transition-colors">
                          <span className="mx-auto w-11 h-11 border border-neutral-300 bg-white flex items-center justify-center">
                            <Icon className="w-5 h-5 text-neutral-800" />
                          </span>
                          <h4 className="font-editorial uppercase tracking-[0.08em] text-base text-black">{editText(item.title, 'title', 'span', index)}</h4>
                          <p className="text-xs text-neutral-600 font-light leading-relaxed">{editText(item.description, 'description', 'span', index)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          }

          /* 9. TESTIMONIALS / REVIEWS */
          case 'testimonials': {
            const items = data.items || [];
            const isCarousel = data.layout === 'carousel';
            return (
              <section key={id} data-component-id={id} className="py-16 sm:py-20 border-b border-neutral-200 bg-neutral-950 text-white overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 space-y-10">
                  <div className="flex items-end justify-between gap-4 border-b border-neutral-800 pb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300 font-mono">Customer Stories</span>
                      <h3 className="builder-section-headline mt-2 text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.07em]">{editText(data.title || 'What Customers Say', 'title')}</h3>
                    </div>
                    {isCarousel && <span className="text-[10px] uppercase tracking-wider text-neutral-500">Scroll to explore</span>}
                  </div>
                  <div className={isCarousel
                    ? 'flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4'
                    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'}>
                    {items.map((item, index) => {
                      const rating = Math.min(5, Math.max(1, Number(item.rating) || 1));
                      return (
                        <article key={index} className={`${isCarousel ? 'min-w-[280px] sm:min-w-[340px] snap-start' : ''} border border-neutral-800 bg-neutral-900 p-6 flex flex-col gap-5`}>
                          <Quote className="w-6 h-6 text-amber-300" />
                          <p className="text-sm text-neutral-200 font-light leading-relaxed flex-1">“{editText(item.quote, 'quote', 'span', index)}”</p>
                          <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} className={`w-3.5 h-3.5 ${star <= rating ? 'fill-amber-300 text-amber-300' : 'text-neutral-700'}`} />
                            ))}
                          </div>
                          <div className="border-t border-neutral-800 pt-4">
                            <div className="text-xs font-semibold uppercase tracking-wider">{editText(item.name, 'name', 'span', index)}</div>
                            <div className="text-[11px] text-neutral-500 mt-1">{editText(item.role, 'role', 'span', index)}</div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          }

          /* 10. SERVICES & PRICING MATRIX */
          case 'pricing_table': {
            const items = data.items || [];
            return (
              <section key={id} data-component-id={id} className="py-16 sm:py-20 border-b border-neutral-200">
                <div className="max-w-6xl mx-auto px-6 space-y-8">
                  <div className="max-w-2xl">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono">Service Menu</span>
                    <h3 className="builder-section-headline mt-2 text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.07em] text-black">{editText(data.title || 'Services & Pricing', 'title')}</h3>
                    {data.subtitle && <p className="builder-section-copy mt-3 text-sm text-neutral-600 font-light leading-relaxed">{editText(data.subtitle, 'subtitle')}</p>}
                  </div>
                  <div className="border border-neutral-300 bg-white overflow-x-auto">
                    <div className="min-w-[680px]">
                      <div className="grid grid-cols-[1.35fr_1fr_0.8fr_1fr] bg-neutral-950 text-white text-[10px] uppercase tracking-[0.18em] font-semibold">
                        <div className="p-4">Service</div><div className="p-4">Spec / Size</div><div className="p-4">Price</div><div className="p-4">Notes</div>
                      </div>
                      {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-[1.35fr_1fr_0.8fr_1fr] border-t border-neutral-200 text-xs items-center hover:bg-neutral-50">
                          <div className="p-4 font-semibold text-neutral-900">{editText(item.service, 'service', 'span', index)}</div>
                          <div className="p-4 text-neutral-600">{editText(item.spec, 'spec', 'span', index)}</div>
                          <div className="p-4 font-mono font-semibold text-neutral-900">{editText(item.price, 'price', 'span', index)}</div>
                          <div className="p-4 text-neutral-500">{editText(item.notes, 'notes', 'span', index)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          case 'steps': {
            const items = data.items || [];
            return (
              <section key={id} data-component-id={id} className="py-16 sm:py-20 border-b border-neutral-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 space-y-8">
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono">Simple Process</span>
                    <h3 className="builder-section-headline mt-2 text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.07em] text-black">{editText(data.title || 'How It Works', 'title')}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((item, index) => (
                      <div key={index} className="border border-neutral-200 bg-[#FAF9F5] p-6 space-y-4">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">{index + 1}</span>
                        <h4 className="font-editorial text-base uppercase tracking-wider text-black">{editText(item.title, 'title', 'span', index)}</h4>
                        <p className="text-xs leading-relaxed text-neutral-600">{editText(item.description, 'description', 'span', index)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          /* 11. CATEGORY QUICK LINKS */
          case 'category_grid': {
            const items = data.items || [];
            const columnClass = Number(data.columns) === 2
              ? 'lg:grid-cols-2'
              : Number(data.columns) === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
            return (
              <section key={id} data-component-id={id} className="py-16 sm:py-20 border-b border-neutral-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 space-y-8">
                  <h3 className="builder-section-headline text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.07em] text-black text-center">{editText(data.title || 'Shop By Category', 'title')}</h3>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${columnClass} gap-5`}>
                    {items.map((item, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => navigateTo('shop', { category: item.category })}
                        className="relative aspect-[4/5] overflow-hidden bg-neutral-200 text-left group border border-neutral-300"
                      >
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title || item.category} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center"><ImageIcon className="w-8 h-8 text-neutral-400" /></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                          <h4 className="font-editorial text-xl uppercase tracking-[0.08em]">{editText(item.title || item.category, item.title ? 'title' : 'category', 'span', index)}</h4>
                          <span className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] border-b border-white/60 pb-1">
                            {editText(item.buttonText || 'Shop Now', 'buttonText', 'span', index)} <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          /* 12. IMAGE GALLERY / PROJECT SHOWCASE */
          case 'gallery': {
            const images = data.images || [];
            const aspectClass = data.aspectRatio === 'square'
              ? 'aspect-square'
              : data.aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]';
            const isMasonry = data.layout === 'masonry';
            return (
              <section key={id} data-component-id={id} className="py-16 sm:py-20 border-b border-neutral-200">
                <div className="max-w-6xl mx-auto px-6 space-y-8">
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono">Our Work</span>
                    <h3 className="builder-section-headline mt-2 text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.07em] text-black">{editText(data.title || 'Project Showcase', 'title')}</h3>
                  </div>
                  <div className={isMasonry ? 'columns-1 sm:columns-2 lg:columns-3 gap-5' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'}>
                    {images.map((image, index) => {
                      const content = (
                        <>
                          <div className={`${isMasonry ? (index % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[4/3]') : aspectClass} overflow-hidden bg-neutral-200`}>
                            {image.url ? <img src={image.url} alt={image.caption || `Gallery image ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-neutral-400" /></div>}
                          </div>
                          {image.caption && <p className="pt-3 text-xs text-neutral-600 font-light">{editText(image.caption, 'caption', 'span', index, 'images')}</p>}
                        </>
                      );
                      return data.lightbox ? (
                        <button type="button" key={index} onClick={() => image.url && setLightboxImage(image)} className={`group text-left w-full ${isMasonry ? 'break-inside-avoid mb-5' : ''}`}>{content}</button>
                      ) : (
                        <figure key={index} className={`group ${isMasonry ? 'break-inside-avoid mb-5' : ''}`}>{content}</figure>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          }

          /* 13. STORE LOCATION & HOURS */
          case 'location_map': {
            const safeMapUrl = getSafeMapUrl(data.mapEmbedUrl);
            return (
              <section key={id} data-component-id={id} className="py-16 sm:py-20 border-b border-neutral-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 border border-neutral-300 bg-[#FAF9F5]">
                  <div className="p-8 sm:p-12 space-y-7">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono">Visit Our Store</span>
                      <h3 className="builder-section-headline mt-2 text-2xl sm:text-3xl font-light font-editorial uppercase tracking-[0.07em] text-black">{editText(data.storeName || 'Store Location', 'storeName')}</h3>
                    </div>
                    <div className="space-y-4 text-sm text-neutral-600 font-light">
                      {data.address && <div className="flex gap-3"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-black" /><span>{editText(data.address, 'address')}</span></div>}
                      {data.phone && <div className="flex gap-3"><Phone className="w-4 h-4 mt-0.5 shrink-0 text-black" /><span>{editText(data.phone, 'phone')}</span></div>}
                      {data.email && <div className="flex gap-3"><Mail className="w-4 h-4 mt-0.5 shrink-0 text-black" /><span>{editText(data.email, 'email')}</span></div>}
                      {data.hours && <div className="flex gap-3"><Clock className="w-4 h-4 mt-0.5 shrink-0 text-black" /><span className="whitespace-pre-line">{editText(data.hours, 'hours')}</span></div>}
                    </div>
                  </div>
                  <div className="min-h-[340px] bg-neutral-200 relative overflow-hidden border-t lg:border-t-0 lg:border-l border-neutral-300">
                    {safeMapUrl ? (
                      <iframe src={safeMapUrl} title={`${data.storeName || 'Store'} map`} className="absolute inset-0 w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                    ) : (
                      <div className="absolute inset-0">
                        <img src="/images/banago_store_location_map.png" alt="Banago store location map" className="w-full h-full object-cover opacity-75" loading="lazy" />
                        <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                          <span className="inline-flex items-center gap-2 bg-white/95 border border-neutral-300 px-4 py-2 text-[10px] uppercase tracking-wider font-semibold"><MapPin className="w-3.5 h-3.5" /> Map Preview</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          }

          default:
            return null;
          }
          })()}
          </SectionFrame>
        );
      })}

      {lightboxImage && (
        <div className="fixed inset-0 z-[80] bg-black/90 p-5 sm:p-10 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Gallery image preview" onClick={() => setLightboxImage(null)}>
          <button type="button" onClick={() => setLightboxImage(null)} className="absolute top-5 right-5 text-white/70 hover:text-white" aria-label="Close image preview">
            <X className="w-6 h-6" />
          </button>
          <figure className="max-w-5xl max-h-full" onClick={(event) => event.stopPropagation()}>
            <img src={lightboxImage.url} alt={lightboxImage.caption || 'Gallery preview'} className="max-w-full max-h-[82vh] object-contain mx-auto" />
            {lightboxImage.caption && <figcaption className="text-center text-sm text-neutral-300 mt-4">{lightboxImage.caption}</figcaption>}
          </figure>
        </div>
      )}
    </PageContainer>
  );
}
