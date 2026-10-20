import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import PromotionsPage from './pages/PromotionsPage';
import PrintingServicesPage from './pages/PrintingServicesPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import TransactionsPage from './pages/TransactionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';

import DynamicPageRenderer from './components/builder/DynamicPageRenderer';
import { SYSTEM_CORE_PAGES, normalizeCorePage } from './data/builderData';

function MainLayout() {
  const { activeTab, activeCustomPageSlug, customPages, navigateTo } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const renderCorePage = (route, CoreComponent) => {
    const definition = SYSTEM_CORE_PAGES.find(page => page.systemRoute === route);
    const cmsPage = customPages.find(page => page.systemRoute === route && page.status === 'published');
    if (!definition || !cmsPage) return <CoreComponent />;
    return <DynamicPageRenderer page={normalizeCorePage(cmsPage)} coreContent={<CoreComponent />} />;
  };

  // Render current tab/page
  const renderContent = () => {
    if (activeTab === 'custom_page') {
      const page = customPages.find(p => p.slug === activeCustomPageSlug);
      if (page) {
        return <DynamicPageRenderer page={page} />;
      }
      return (
        <div className="py-24 text-center max-w-lg mx-auto px-6 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">Error 404</span>
          <h2 className="font-editorial text-3xl text-black font-light">Page Not Found</h2>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            The page you requested (/{activeCustomPageSlug}) does not exist or has been unpublished by the store administrator.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return renderCorePage('/', HomePage);
      case 'shop':
        return renderCorePage('/shop', ShopPage);
      case 'promotions':
        return renderCorePage('/promotions', PromotionsPage);
      case 'services':
        return renderCorePage('/services', PrintingServicesPage);
      case 'transactions':
        return (
          <ProtectedRoute message="Please sign in to view your orders and transactions.">
            {renderCorePage('/transactions', TransactionsPage)}
          </ProtectedRoute>
        );
      case 'tracking':
        return <OrderTrackingPage />;
      case 'about':
        return renderCorePage('/about', AboutPage);
      case 'contact':
        return renderCorePage('/contact', ContactPage);
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  const isAdminView = activeTab === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#161616]">
      {/* Navigation Bar - displayed on public storefront */}
      {!isAdminView && <Navbar />}

      {/* Main Page View with Animated Transition */}
      <main className="flex-1">
        <div key={activeTab + (activeCustomPageSlug || '')} className="animate-page-enter">
          {renderContent()}
        </div>
      </main>

      {/* Footer - displayed on public storefront */}
      {!isAdminView && <Footer />}

      {/* Interactive Overlays */}
      <ProductDetailModal />
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
      <AuthModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
