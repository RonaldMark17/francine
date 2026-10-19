import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal';
import PresenterGuideModal from './components/PresenterGuideModal';
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

function MainLayout() {
  const { activeTab } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPresenterGuideOpen, setIsPresenterGuideOpen] = useState(false);

  // Render current tab/page
  const renderContent = () => {
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#161616]">
      {/* Navigation Bar */}
      <Navbar onOpenPresenterGuide={() => setIsPresenterGuideOpen(true)} />

      {/* Main Page View */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer */}
      <Footer onOpenPresenterGuide={() => setIsPresenterGuideOpen(true)} />

      {/* Interactive Overlays */}
      <ProductDetailModal />
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
      <PresenterGuideModal 
        isOpen={isPresenterGuideOpen} 
        onClose={() => setIsPresenterGuideOpen(false)} 
      />
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
