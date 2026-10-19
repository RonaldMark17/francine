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

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import PromotionsPage from './pages/PromotionsPage';
import PrintingServicesPage from './pages/PrintingServicesPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';

import DynamicPageRenderer from './components/builder/DynamicPageRenderer';

function MainLayout() {
  const { activeTab, activeCustomPageSlug, customPages, navigateTo } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'promotions':
        return <PromotionsPage />;
      case 'services':
        return <PrintingServicesPage />;
      case 'tracking':
        return <OrderTrackingPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
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

      {/* Main Page View */}
      <main className="flex-1">
        {renderContent()}
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
