import NativeContentInspector from './NativeContentInspector';
import { CoreSelectionContext } from './CoreContentContext';
import PreviewFrame from './PreviewFrame';
import Navbar from '../Navbar';
import Footer from '../Footer';
import CorePageContent from './CorePageContent';
import { normalizeCorePage } from '../../data/builderData';
import ModalOverlay from '../ModalOverlay';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import DynamicPageRenderer from './DynamicPageRenderer';
import MediaLibraryModal from './MediaLibraryModal';
import ExtendedSectionInspector from './ExtendedSectionInspector';
import InspectorAccordion from './InspectorAccordion';
import SectionDesignInspector from './SectionDesignInspector';
import { DEFAULT_SECTION_SETTINGS } from '../../data/sectionSettings';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import {
  clearPageBuilderDraft,
  loadPageBuilderDraft,
  savePageBuilderDraft
} from '../../utils/pageBuilderDraft';
import { 
  X, 
  Save, 
  Send, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Copy, 
  Sliders, 
  Image as ImageIcon, 
  Settings,
  Type
} from 'lucide-react';

const serializeEditorPage = (pageData) => JSON.stringify({
  title: pageData?.title || 'New Custom Page',
  slug: pageData?.slug || 'new-page',
  description: pageData?.description || '',
  showInNav: pageData?.showInNav ?? false,
  showInFooter: pageData?.showInFooter ?? true,
  nativeContent: pageData?.nativeContent || {},
  components: pageData?.components || []
});

export default function VisualPageEditor({ page, isNewPage = false, onClose, onSave }) {
  const { showToast } = useApp();
  useBodyScrollLock(true);
  const previewScrollRef = useRef(null);
  const recoveryNoticeShownRef = useRef(false);
  const [initialEditorData] = useState(() => {
    const recoveredDraft = loadPageBuilderDraft(page?.id);
    return {
      page: normalizeCorePage(recoveredDraft?.page || page || {}),
      recovered: Boolean(recoveredDraft)
    };
  });

  const initialPage = initialEditorData.page;

  // Page basic metadata
  const [pageTitle, setPageTitle] = useState(initialPage.title || 'New Custom Page');
  const [pageSlug, setPageSlug] = useState(initialPage.slug || 'new-page');
  const [pageDesc, setPageDesc] = useState(initialPage.description || '');
  const [showInNav, setShowInNav] = useState(initialPage.showInNav ?? false);
  const [showInFooter, setShowInFooter] = useState(initialPage.showInFooter ?? true);

  const [nativeContent, setNativeContent] = useState(initialPage.nativeContent || {});
  const [selectedField, setSelectedField] = useState(null);

  // Components state
  const [components, setComponents] = useState(initialPage.components ? JSON.parse(JSON.stringify(initialPage.components)) : []);
  const [selectedCompId, setSelectedCompId] = useState(page.systemRoute ? 'native-content' : components[0]?.id || null);
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    initialEditorData.recovered || isNewPage ? null : serializeEditorPage(page)
  );

  // Viewport mode: 'desktop' | 'tablet' | 'mobile'
  const [viewport, setViewport] = useState('desktop');

  // Modals & Panels
  const [isAddComponentOpen, setIsAddComponentOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [activeMediaTargetField, setActiveMediaTargetField] = useState(null); // callback target

  // Active selected component
  const selectedComponent = components.find(c => c.id === selectedCompId);
  const componentOrderKey = components.map(component => component.id).join('|');
  const editorSnapshot = serializeEditorPage({
    title: pageTitle,
    slug: pageSlug,
    description: pageDesc,
    showInNav,
    showInFooter,
    nativeContent,
    components
  });
  const hasUnsavedChanges = editorSnapshot !== savedSnapshot;
  const draftPage = useMemo(() => ({
    ...initialPage,
    id: page?.id || initialPage.id,
    title: pageTitle,
    slug: pageSlug,
    description: pageDesc,
    showInNav,
    showInFooter,
    nativeContent,
    components
  }), [page, initialPage, pageTitle, pageSlug, pageDesc, showInNav, showInFooter, nativeContent, components]);

  useEffect(() => {
    if (initialEditorData.recovered && !recoveryNoticeShownRef.current) {
      recoveryNoticeShownRef.current = true;
      showToast('Recovered your unsaved page builder draft.', 'info');
    }
  }, [initialEditorData.recovered, showToast]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (hasUnsavedChanges) {
        savePageBuilderDraft(draftPage);
      } else {
        clearPageBuilderDraft(draftPage.id);
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [draftPage, hasUnsavedChanges]);

  useEffect(() => {
    if (!hasUnsavedChanges) return undefined;

    const warnAboutUnsavedChanges = (event) => {
      savePageBuilderDraft(draftPage);
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', warnAboutUnsavedChanges);
    return () => window.removeEventListener('beforeunload', warnAboutUnsavedChanges);
  }, [draftPage, hasUnsavedChanges]);

  const scrollPreviewToComponent = useCallback((componentId) => {
    const preview = previewScrollRef.current;
    if (!preview || !componentId) return;

    const previewDocument = preview.querySelector('iframe')?.contentDocument || preview;
    const target = Array.from(previewDocument.querySelectorAll('[data-component-id]'))
      .find(element => element.dataset.componentId === componentId);

    target?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }, []);

  // Keep the canvas aligned after selecting, adding, or reordering sections.
  useEffect(() => {
    scrollPreviewToComponent(selectedCompId);
  }, [selectedCompId, componentOrderKey, scrollPreviewToComponent]);

  const handleSelectComponent = (componentId) => {
    // React will not rerun the selection effect when the same item is clicked,
    // so explicitly refocus it in that case.
    if (componentId === selectedCompId) {
      scrollPreviewToComponent(componentId);
    }
    setSelectedCompId(componentId);
  };

  // Component templates for adding
  const COMPONENT_TYPES = [
    {
      type: 'hero',
      label: 'Hero Banner',
      desc: 'High-impact full-width banner with typography & CTA',
      defaultData: {
        eyebrow: 'Special Edition',
        title: 'New Season Announcement',
        subtitle: 'Elevated supplies designed for academic excellence and university workflows.',
        buttonText: 'Shop Collection',
        buttonLink: 'shop',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80',
        align: 'center',
        theme: 'dark',
        settings: { headlineSize: 'h1', verticalPadding: 'large' }
      }
    },
    {
      type: 'announcement',
      label: 'Announcement Bar',
      desc: 'Slim high-priority alert or coupon notice',
      defaultData: {
        badge: 'Notice',
        text: 'Extended store hours today until 8:30 PM for campus thesis printing.',
        settings: { headlineSize: 'h3', verticalPadding: 'small', containerWidth: 'full' }
      }
    },
    {
      type: 'text_image',
      label: 'Text & Image Split',
      desc: 'Two-column editorial feature with photo & description',
      defaultData: {
        eyebrow: 'Banago, Nagcarlan Retail Store',
        title: 'Crafted For Dependable Productivity',
        description: 'Explore curated student stationery, notebooks, and certified printing paper at student-friendly rates.',
        buttonText: 'Read Store Story',
        buttonLink: 'about',
        imageUrl: '/images/paper_one_ream.jpg',
        imagePosition: 'right'
      }
    },
    {
      type: 'product_grid',
      label: 'Curated Product Grid',
      desc: 'Display filtered store products in a responsive grid',
      defaultData: {
        title: 'Recommended For You',
        subtitle: 'Our top customer favorites this week.',
        category: 'All',
        limit: 4
      }
    },
    {
      type: 'faq',
      label: 'FAQ Accordion',
      desc: 'Collapsible frequently asked questions list',
      defaultData: {
        title: 'Common Questions',
        items: [
          { q: 'What are the pickup schedules?', a: 'Orders placed before 2:00 PM are packed and ready for counter pickup on the same afternoon.' },
          { q: 'Do you deliver to student boarding houses and residences?', a: 'Yes, we deliver across Banago, Nagcarlan, and nearby Laguna barangays via local courier.' }
        ]
      }
    },
    {
      type: 'rich_text',
      label: 'Rich Text / Guidelines',
      desc: 'Detailed narrative block with clean typography',
      defaultData: {
        title: 'Store Guidelines & Policies',
        content: 'Please present your order reference number at Counter 2 when collecting prepaid items. Academic discounts require a valid university student or faculty ID.'
      }
    },
    {
      type: 'cta',
      label: 'Call to Action Banner',
      desc: 'Bold closing section driving customers to order',
      defaultData: {
        title: 'Ready To Print Your Thesis Or Project?',
        subtitle: 'Upload your file or visit our store across Gate 3.',
        buttonText: 'Submit Print Request',
        buttonLink: 'services'
      }
    },
    {
      type: 'features_grid',
      label: 'Value Proposition / Features Grid',
      desc: 'Icon cards highlighting store benefits and service promises',
      defaultData: {
        title: 'Why Customers Choose Mama Mo',
        columns: 4,
        items: [
          { icon: 'printer', title: 'Same-Day Printing', description: 'Fast production for urgent school and business requirements.' },
          { icon: 'graduation-cap', title: 'Student Discounts', description: 'Accessible pricing for students, teachers, and campus groups.' },
          { icon: 'timer', title: 'Rush Processing', description: 'Priority service when every minute matters.' },
          { icon: 'shield-check', title: 'Quality Guarantee', description: 'Carefully checked output before every order leaves the store.' }
        ]
      }
    },
    {
      type: 'testimonials',
      label: 'Testimonials / Reviews',
      desc: 'Customer quotes, roles, and star ratings in cards or a carousel',
      defaultData: {
        title: 'Trusted By Our Community',
        layout: 'grid',
        items: [
          { name: 'Angela Reyes', role: 'College Student', quote: 'My thesis copies were clean, complete, and ready ahead of schedule.', rating: 5 },
          { name: 'Mr. Santos', role: 'Local Teacher', quote: 'Reliable service for classroom handouts and examination materials.', rating: 5 },
          { name: 'Mae Villanueva', role: 'Small Business Owner', quote: 'The team consistently delivers professional prints at fair prices.', rating: 4 }
        ]
      }
    },
    {
      type: 'pricing_table',
      label: 'Services & Pricing Matrix',
      desc: 'Structured printing and binding rates with sizes and turnaround notes',
      defaultData: {
        title: 'Printing & Binding Rates',
        subtitle: 'Transparent starting rates for our most requested services.',
        items: [
          { service: 'Black & White Printing', spec: 'A4 / Short / Long', price: 'From ₱2/page', notes: 'Same-day' },
          { service: 'Full Color Printing', spec: 'A4, high quality', price: 'From ₱10/page', notes: 'Same-day' },
          { service: 'Soft Binding', spec: 'Up to 200 pages', price: 'From ₱60', notes: '30–60 minutes' },
          { service: 'Hard Binding', spec: 'Thesis with gold stamp', price: 'From ₱450', notes: '2–3 working days' }
        ]
      }
    },
    {
      type: 'steps',
      label: 'Order Process Steps',
      desc: 'Numbered steps explaining how customers place an order',
      defaultData: {
        title: 'How It Works',
        items: [
          { title: 'Choose a Service', description: 'Select the service you need.' },
          { title: 'Share Details', description: 'Provide your specifications and timeline.' },
          { title: 'Confirm Your Order', description: 'Review the estimate and submit your request.' }
        ]
      }
    },
    {
      type: 'category_grid',
      label: 'Category Quick Links',
      desc: 'Image cards that take shoppers directly to product categories',
      defaultData: {
        title: 'Shop By Category',
        columns: 4,
        items: [
          { category: 'School Supplies', title: 'Stationery', imageUrl: '/images/mongol_pencils.jpg', buttonText: 'Shop Stationery' },
          { category: 'Printing Materials', title: 'Inks & Toners', imageUrl: '/images/epson_003_ink.jpg', buttonText: 'Browse Inks' },
          { category: 'Paper Products', title: 'Paper Reams', imageUrl: '/images/paper_one_ream.jpg', buttonText: 'View Paper' },
          { category: 'Office Supplies', title: 'Office Essentials', imageUrl: '/images/deli_stapler.jpg', buttonText: 'Shop Office' }
        ]
      }
    },
    {
      type: 'gallery',
      label: 'Image Gallery / Project Showcase',
      desc: 'Responsive project gallery with captions and optional lightbox viewing',
      defaultData: {
        title: 'Recent Print Projects',
        layout: 'grid',
        aspectRatio: 'landscape',
        lightbox: true,
        images: [
          { url: '/images/sterling_record_book.jpg', caption: 'Custom academic record materials' },
          { url: '/images/laminating_film_pouches.jpg', caption: 'Protected and laminated documents' },
          { url: '/images/wire_binding_spines.jpg', caption: 'Professional wire-bound reports' }
        ]
      }
    },
    {
      type: 'location_map',
      label: 'Store Location & Hours',
      desc: 'Store address, contact information, opening hours, and map',
      defaultData: {
        storeName: 'Mama Mo Ink Print and Supplies',
        address: 'Purok 5, Barangay Banago, Nagcarlan, Laguna 4002',
        phone: 'Contact our Banago store for current service inquiries',
        email: '',
        hours: 'Monday–Saturday: 8:00 AM–7:00 PM\nSunday: 9:00 AM–5:00 PM',
        mapEmbedUrl: ''
      }
    }
  ];

  // Actions on components
  const handleAddComponent = (compType) => {
    const template = COMPONENT_TYPES.find(t => t.type === compType);
    if (!template) return;

    const newComp = {
      id: `comp-${Date.now()}`,
      type: compType,
      data: {
        ...template.defaultData,
        settings: {
          ...DEFAULT_SECTION_SETTINGS,
          ...(template.defaultData.settings || {})
        }
      }
    };

    setComponents([...components, newComp]);
    setSelectedCompId(newComp.id);
    setIsAddComponentOpen(false);
  };

  const handleUpdateComponentData = (field, value) => {
    if (!selectedCompId) return;
    setComponents(prev => prev.map(c => {
      if (c.id === selectedCompId) {
        return {
          ...c,
          data: {
            ...c.data,
            [field]: value
          }
        };
      }
      return c;
    }));
  };

  const handleMoveComponent = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= components.length) return;
    const reordered = [...components];
    const temp = reordered[idx];
    reordered[idx] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    setComponents(reordered);
  };

  const handleDeleteComponent = (id) => {
    if (components.length <= 1) {
      alert('A page must contain at least one content section.');
      return;
    }
    const updated = components.filter(c => c.id !== id);
    setComponents(updated);
    if (selectedCompId === id) {
      setSelectedCompId(updated[0]?.id || null);
    }
  };

  const handleDuplicateComponent = (comp) => {
    const cloned = {
      ...comp,
      id: `comp-${Date.now()}`,
      data: JSON.parse(JSON.stringify(comp.data))
    };
    const idx = components.findIndex(c => c.id === comp.id);
    const updated = [...components];
    updated.splice(idx + 1, 0, cloned);
    setComponents(updated);
    setSelectedCompId(cloned.id);
  };

  // Save / Publish
  const handleSaveDraft = () => {
    if (!pageTitle.trim() || !pageSlug.trim()) {
      alert('Please provide a valid page title and URL slug.');
      return;
    }
    const cleanSlug = pageSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const updatedPage = {
      ...initialPage,
      id: page?.id || `page-${Date.now()}`,
      title: pageTitle.trim(),
      slug: cleanSlug,
      description: pageDesc.trim(),
      status: 'draft',
      showInNav,
      showInFooter,
      nativeContent,
      components,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setSavedSnapshot(serializeEditorPage(updatedPage));
    clearPageBuilderDraft(updatedPage.id);
    onSave(updatedPage);
  };

  const handlePublish = () => {
    if (!pageTitle.trim() || !pageSlug.trim()) {
      alert('Please provide a valid page title and URL slug.');
      return;
    }
    const cleanSlug = pageSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const updatedPage = {
      ...initialPage,
      id: page?.id || `page-${Date.now()}`,
      title: pageTitle.trim(),
      slug: cleanSlug,
      description: pageDesc.trim(),
      status: 'published',
      showInNav,
      showInFooter,
      nativeContent,
      components,
      updatedAt: new Date().toISOString().split('T')[0],
      publishedAt: page?.publishedAt || new Date().toISOString().split('T')[0]
    };
    setSavedSnapshot(serializeEditorPage(updatedPage));
    clearPageBuilderDraft(updatedPage.id);
    onSave(updatedPage);
  };

  const handleClose = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved page changes. Exit the editor and keep them as a local draft?')) {
      return;
    }
    if (hasUnsavedChanges) savePageBuilderDraft(draftPage);
    onClose();
  };

  // Preview Page Object
  const previewPageObject = {
    title: pageTitle,
    description: pageDesc,
    nativeContent,
    components
  };
  const pagePath = page.systemRoute || `/${pageSlug}`;

  return (
    <div className="fixed inset-0 z-50 h-screen min-h-0 bg-[#121212] text-white flex flex-col overflow-hidden animate-fade-in">
      
      {/* Top Application Bar */}
      <header className="h-14 border-b border-neutral-800 bg-neutral-900 px-4 sm:px-6 flex items-center justify-between shrink-0">
        
        {/* Page Identity & Status */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black border border-neutral-700 flex items-center justify-center font-editorial text-sm font-semibold">
            MM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                Website Builder
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {pagePath}
              </span>
              <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 font-bold ${
                page?.status === 'published' ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {page?.status || 'Draft'}
              </span>
            </div>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-black/60 p-1 border border-neutral-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 transition-colors ${viewport === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 transition-colors ${viewport === 'tablet' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 transition-colors ${viewport === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Top Actions: Close, Save Draft, Publish */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleClose}
            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Exit Editor
          </button>
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-200 transition-colors uppercase tracking-wider font-medium"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          <button
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-black hover:bg-neutral-200 transition-colors text-xs uppercase tracking-wider font-semibold shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Page</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Sections List, Center Canvas, Right Inspector */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        
        {/* LEFT COLUMN: Page Settings & Section Tree */}
        <aside className="w-56 xl:w-60 min-h-0 bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0">
          
          {/* Page Meta Settings Collapsible */}
          <div className="p-4 border-b border-neutral-800 space-y-3 text-xs">
            <div className="flex items-center justify-between text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
              <span>Page Configuration</span>
              <Settings className="w-3.5 h-3.5" />
            </div>
            
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Page Title</label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">URL Slug</label>
              <div className="flex items-center bg-neutral-950 border border-neutral-800 px-2.5 py-1 text-xs">
                {!page.systemRoute && <span className="text-neutral-500 font-mono">/</span>}
                  {page.systemRoute ? (
                    <span className="w-full text-neutral-400 font-mono pl-1">{page.systemRoute}</span>
                  ) : (
                    <input
                      type="text"
                      value={pageSlug}
                      onChange={(e) => setPageSlug(e.target.value)}
                      className="w-full bg-transparent text-white font-mono focus:outline-none pl-1"
                    />
                  )}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              {!page.systemRoute && (
                <>
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-neutral-300">
                    <input
                      type="checkbox"
                      checked={showInNav}
                      onChange={(e) => setShowInNav(e.target.checked)}
                      className="accent-white"
                    />
                    <span>Show in Header</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-neutral-300">
                    <input
                      type="checkbox"
                      checked={showInFooter}
                      onChange={(e) => setShowInFooter(e.target.checked)}
                      className="accent-white"
                    />
                    <span>Show in Footer</span>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Section Tree Header */}
          <div className="p-3 px-4 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
              Page Sections ({components.length + (page.systemRoute ? 1 : 0)})
            </span>
            <button
              onClick={() => setIsAddComponentOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] text-white hover:text-amber-300 transition-colors uppercase tracking-wider font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section</span>
            </button>
          </div>

          {/* Sections List */}
          <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-2">
            {page.systemRoute && (
              <button type="button" onClick={() => { setSelectedCompId('native-content'); setSelectedField(null); }} className={`w-full rounded-lg p-3 text-left border transition-colors ${selectedCompId === 'native-content' ? 'border-amber-300/60 bg-amber-300/5' : 'border-neutral-700 hover:bg-neutral-800'}`}>
                <span className="flex items-center gap-2 text-xs text-white font-medium"><Type className="w-4 h-4 text-amber-300" />{page.title} content</span>
                <span className="block mt-1.5 pl-6 text-[11px] text-neutral-400">Text, images & page details</span>
              </button>
            )}
            {components.map((comp, idx) => {
              const isSelected = selectedCompId === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => handleSelectComponent(comp.id)}
                  className={`p-2.5 border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'border-white bg-neutral-800 text-white font-medium' 
                      : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-4 h-4 bg-neutral-800 text-[10px] text-neutral-400 flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span className="capitalize font-mono text-[11px] truncate">
                      {comp.type.replace('_', ' ')}
                    </span>
                  </div>
                  {page.hybrid && (
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 mr-2">
                      {comp.data?.placement === 'bottom' ? 'Bottom' : 'Top'}
                    </span>
                  )}

                  {/* Reorder and Delete Mini Controls */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveComponent(idx, -1)}
                      className="p-1 text-neutral-400 hover:text-white disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      disabled={idx === components.length - 1}
                      onClick={() => handleMoveComponent(idx, 1)}
                      className="p-1 text-neutral-400 hover:text-white disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDuplicateComponent(comp)}
                      className="p-1 text-neutral-400 hover:text-white"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteComponent(comp.id)}
                      className="p-1 text-neutral-400 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </aside>

        {/* CENTER COLUMN: Live Interactive Visual Canvas */}
        <main
          ref={previewScrollRef}
          className="flex-1 min-w-0 h-full min-h-0 bg-[#202020] flex flex-col items-center overflow-auto overscroll-contain p-3 xl:p-5"
        >
          
          <div 
            className={`shrink-0 flex flex-col h-full min-h-0 rounded-lg transition-all duration-300 shadow-2xl overflow-hidden bg-[#FAF9F5] text-neutral-900 border border-neutral-700 ${
              viewport === 'desktop' ? 'w-full' : viewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            }`}
          >
            {/* Mock browser header frame for aesthetic Celine preview */}
            <div className="bg-neutral-800 text-neutral-400 px-4 py-2 border-b border-neutral-700 flex items-center justify-between text-[11px] font-mono select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-[10px] truncate max-w-[240px]">
                mamamoinkprint.ph{pagePath}
              </span>
              <span className="text-[10px] text-neutral-500">
                {viewport.toUpperCase()}
              </span>
            </div>

            {/* Use the storefront design within the selected device viewport. */}
            <PreviewFrame>
            {page.systemRoute && <div inert><Navbar previewTab={page.systemRoute === '/' ? 'home' : page.systemRoute.slice(1)} /></div>}
            <CoreSelectionContext.Provider value={true}>
            <style>{`
              [data-editor-preview] [data-core-field] { cursor: pointer; }
              [data-editor-preview] [data-core-field]:hover,
              [data-editor-preview] [data-core-field]:focus-visible { outline: 2px dashed #d97706; outline-offset: 4px; }
              ${selectedField ? `[data-editor-preview] [data-core-field="${selectedField}"] { outline: 2px solid #d97706; outline-offset: 4px; background-color: #fbbf241a; }` : ''}
            `}</style>
            <div data-editor-preview onClickCapture={event => {
              event.preventDefault();
              event.stopPropagation();
              const field = event.target.closest('[data-core-field]');
              if (field) {
                setSelectedCompId('native-content');
                setSelectedField(field.dataset.coreField);
              } else {
                const section = event.target.closest('[data-component-id]');
                if (section) { setSelectedField(null); handleSelectComponent(section.dataset.componentId); }
              }
            }} onKeyDownCapture={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                const field = event.target.closest('[data-core-field]');
                if (field) { event.preventDefault(); event.stopPropagation(); setSelectedCompId('native-content'); setSelectedField(field.dataset.coreField); }
              }
            }}>
            <DynamicPageRenderer
              page={previewPageObject}
              coreContent={page.systemRoute ? <CorePageContent route={page.systemRoute} /> : null}
            />
            </div>
            </CoreSelectionContext.Provider>
            {page.systemRoute && <div inert><Footer /></div>}
            </PreviewFrame>
          </div>

        </main>

        {/* RIGHT COLUMN: Component Property Inspector */}
        <aside className="w-72 2xl:w-80 min-h-0 bg-neutral-900 border-l border-neutral-800 flex flex-col shrink-0">
          <div className="p-3.5 px-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                {selectedCompId === 'native-content' ? 'Page Inspector' : 'Section Inspector'}
              </span>
            </div>
            {selectedComponent && (
              <span className="text-[10px] font-mono text-neutral-400 uppercase">
                {selectedComponent.type}
              </span>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {selectedCompId === 'native-content' && page.systemRoute ? (
              <>
              {selectedField && <button type="button" onClick={() => setSelectedField(null)} className="text-xs text-amber-300 hover:text-white">? All page content</button>}
              <NativeContentInspector key={selectedField || 'all'} selectedField={selectedField} route={page.systemRoute} title={pageTitle} values={nativeContent} onChange={setNativeContent} onChooseImage={id => {
                setActiveMediaTargetField(() => url => setNativeContent(values => ({ ...values, [id]: url })));
                setIsMediaPickerOpen(true);
              }} />
              </>
            ) : !selectedComponent ? (
              <div className="py-12 text-center text-neutral-500 text-xs">
                Select a section from the left tree to inspect and customize its content.
              </div>
            ) : (
              <>
                {page.hybrid && (
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">Section Position</label>
                    <select
                      value={selectedComponent.data.placement === 'bottom' ? 'bottom' : 'top'}
                      onChange={(event) => handleUpdateComponentData('placement', event.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none"
                    >
                      <option value="top">Above the native {page.title} component</option>
                      <option value="bottom">Below the native {page.title} component</option>
                    </select>
                  </div>
                )}
                <InspectorAccordion title="Content" defaultOpen>
                {/* Hero Fields */}
                {selectedComponent.type === 'hero' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Eyebrow Tag</label>
                      <input
                        type="text"
                        value={selectedComponent.data.eyebrow || ''}
                        onChange={(e) => handleUpdateComponentData('eyebrow', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Headline Title *</label>
                      <input
                        type="text"
                        value={selectedComponent.data.title || ''}
                        onChange={(e) => handleUpdateComponentData('title', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none focus:border-neutral-500 font-editorial text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Subtitle Description</label>
                      <textarea
                        rows={3}
                        value={selectedComponent.data.subtitle || ''}
                        onChange={(e) => handleUpdateComponentData('subtitle', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-neutral-400 font-medium">Background Image URL</label>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMediaTargetField('imageUrl');
                            setIsMediaPickerOpen(true);
                          }}
                          className="text-[10px] text-amber-300 hover:underline flex items-center gap-1"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Choose Media</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={selectedComponent.data.imageUrl || ''}
                        onChange={(e) => handleUpdateComponentData('imageUrl', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1 font-medium">Button Label</label>
                        <input
                          type="text"
                          value={selectedComponent.data.buttonText || ''}
                          onChange={(e) => handleUpdateComponentData('buttonText', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none focus:border-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1 font-medium">Button Target Link</label>
                        <select
                          value={selectedComponent.data.buttonLink || 'shop'}
                          onChange={(e) => handleUpdateComponentData('buttonLink', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-white focus:outline-none"
                        >
                          <option value="shop">Shop Page</option>
                          <option value="promotions">Promotions</option>
                          <option value="services">Printing Services</option>
                          <option value="contact">Contact &amp; Store</option>
                          <option value="about">About Mama Mo</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1 font-medium">Alignment</label>
                        <select
                          value={selectedComponent.data.align || 'center'}
                          onChange={(e) => handleUpdateComponentData('align', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-white focus:outline-none"
                        >
                          <option value="center">Center</option>
                          <option value="left">Left Aligned</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1 font-medium">Color Theme</label>
                        <select
                          value={selectedComponent.data.theme || 'dark'}
                          onChange={(e) => handleUpdateComponentData('theme', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-white focus:outline-none"
                        >
                          <option value="dark">Dark Luxury Overlay</option>
                          <option value="light">Light Minimal Overlay</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Announcement Bar Fields */}
                {selectedComponent.type === 'announcement' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Badge Tag</label>
                      <input
                        type="text"
                        value={selectedComponent.data.badge || ''}
                        onChange={(e) => handleUpdateComponentData('badge', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Announcement Message</label>
                      <textarea
                        rows={3}
                        value={selectedComponent.data.text || ''}
                        onChange={(e) => handleUpdateComponentData('text', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Text Image Split Fields */}
                {selectedComponent.type === 'text_image' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Eyebrow</label>
                      <input
                        type="text"
                        value={selectedComponent.data.eyebrow || ''}
                        onChange={(e) => handleUpdateComponentData('eyebrow', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Title</label>
                      <input
                        type="text"
                        value={selectedComponent.data.title || ''}
                        onChange={(e) => handleUpdateComponentData('title', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none font-editorial"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Description</label>
                      <textarea
                        rows={4}
                        value={selectedComponent.data.description || ''}
                        onChange={(e) => handleUpdateComponentData('description', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-neutral-400 font-medium">Feature Image URL</label>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMediaTargetField('imageUrl');
                            setIsMediaPickerOpen(true);
                          }}
                          className="text-[10px] text-amber-300 hover:underline flex items-center gap-1"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Choose Media</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={selectedComponent.data.imageUrl || ''}
                        onChange={(e) => handleUpdateComponentData('imageUrl', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white font-mono text-[11px] focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1 font-medium">Image Position</label>
                        <select
                          value={selectedComponent.data.imagePosition || 'right'}
                          onChange={(e) => handleUpdateComponentData('imagePosition', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-white focus:outline-none"
                        >
                          <option value="right">Right Side</option>
                          <option value="left">Left Side</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1 font-medium">Button Link</label>
                        <select
                          value={selectedComponent.data.buttonLink || 'shop'}
                          onChange={(e) => handleUpdateComponentData('buttonLink', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-white focus:outline-none"
                        >
                          <option value="shop">Shop Page</option>
                          <option value="promotions">Promotions</option>
                          <option value="services">Printing Services</option>
                          <option value="contact">Contact &amp; Store</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Grid Fields */}
                {selectedComponent.type === 'product_grid' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Section Heading</label>
                      <input
                        type="text"
                        value={selectedComponent.data.title || ''}
                        onChange={(e) => handleUpdateComponentData('title', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none font-editorial"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Subtitle</label>
                      <input
                        type="text"
                        value={selectedComponent.data.subtitle || ''}
                        onChange={(e) => handleUpdateComponentData('subtitle', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1 font-medium">Category</label>
                        <select
                          value={selectedComponent.data.category || 'All'}
                          onChange={(e) => handleUpdateComponentData('category', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-white focus:outline-none"
                        >
                          <option value="All">All Categories</option>
                          <option value="School Supplies">School Supplies</option>
                          <option value="Office Materials">Office Materials</option>
                          <option value="Printing Supplies">Printing Supplies</option>
                          <option value="Printing & Binding">Printing &amp; Binding</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1 font-medium">Item Limit</label>
                        <select
                          value={selectedComponent.data.limit || 4}
                          onChange={(e) => handleUpdateComponentData('limit', parseInt(e.target.value))}
                          className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-white focus:outline-none"
                        >
                          <option value={4}>4 Products</option>
                          <option value={8}>8 Products</option>
                          <option value={12}>12 Products</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rich Text Fields */}
                {selectedComponent.type === 'rich_text' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Editorial Title</label>
                      <input
                        type="text"
                        value={selectedComponent.data.title || ''}
                        onChange={(e) => handleUpdateComponentData('title', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none font-editorial"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Paragraph Body Content</label>
                      <textarea
                        rows={8}
                        value={selectedComponent.data.content || ''}
                        onChange={(e) => handleUpdateComponentData('content', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* Call to Action Fields */}
                {selectedComponent.type === 'cta' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Headline</label>
                      <input
                        type="text"
                        value={selectedComponent.data.title || ''}
                        onChange={(e) => handleUpdateComponentData('title', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none font-editorial"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">Subtitle</label>
                      <input
                        type="text"
                        value={selectedComponent.data.subtitle || ''}
                        onChange={(e) => handleUpdateComponentData('subtitle', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1 font-medium">Button Text</label>
                        <input
                          type="text"
                          value={selectedComponent.data.buttonText || ''}
                          onChange={(e) => handleUpdateComponentData('buttonText', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1 font-medium">Target Page</label>
                        <select
                          value={selectedComponent.data.buttonLink || 'shop'}
                          onChange={(e) => handleUpdateComponentData('buttonLink', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-white focus:outline-none"
                        >
                          <option value="shop">Shop Page</option>
                          <option value="services">Printing Services</option>
                          <option value="contact">Contact</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <ExtendedSectionInspector
                  type={selectedComponent.type}
                  data={selectedComponent.data}
                  onChange={handleUpdateComponentData}
                />
                </InspectorAccordion>

                <SectionDesignInspector
                  data={selectedComponent.data}
                  onChange={handleUpdateComponentData}
                />

              </>
            )}
          </div>
        </aside>

      </div>

      {/* MODAL: ADD COMPONENT PICKER */}
      {isAddComponentOpen && (
        <ModalOverlay
          onClick={() => setIsAddComponentOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[85dvh] flex flex-col bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden my-auto animate-modal-pop text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: Keep fixed at top */}
            <div className="flex-shrink-0 p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900">
              <div>
                <h3 className="font-editorial text-lg text-white font-light">
                  Add Page Section Component
                </h3>
                <p className="text-xs text-neutral-400 font-light">
                  Select a reusable block from the Celine-inspired modular library
                </p>
              </div>
              <button
                onClick={() => setIsAddComponentOpen(false)}
                className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Enable vertical scroll */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMPONENT_TYPES.map(comp => (
                <div
                  key={comp.type}
                  onClick={() => handleAddComponent(comp.type)}
                  className="p-4 border border-neutral-800 hover:border-white bg-neutral-950 cursor-pointer transition-all space-y-1.5 group rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs group-hover:text-amber-300">
                      {comp.label}
                    </span>
                    <Plus className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                    {comp.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Footer: Keep fixed at bottom */}
            <div className="flex-shrink-0 p-4 border-t border-neutral-800 bg-neutral-950 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddComponentOpen(false)}
                className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded-lg hover:text-white hover:border-neutral-500 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* MEDIA LIBRARY PICKER MODAL */}
      <MediaLibraryModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectImage={(url) => {
          if (typeof activeMediaTargetField === 'function') {
            activeMediaTargetField(url);
          } else if (activeMediaTargetField) {
            handleUpdateComponentData(activeMediaTargetField, url);
          }
          setIsMediaPickerOpen(false);
        }}
      />

    </div>
  );
}
