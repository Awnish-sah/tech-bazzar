import React, { useState } from 'react';
import { useAdmin } from './context/AdminContext';
import { useShop } from './context/ShopContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { HeroBanner } from './components/store/HeroBanner';
import { CategoryPills } from './components/store/CategoryPills';
import { FlashDeals } from './components/store/FlashDeals';
import { ProductGrid } from './components/store/ProductGrid';
import { FeaturesSection } from './components/store/FeaturesSection';
import { CartDrawer } from './components/store/CartDrawer';
import { ProductQuickView } from './components/store/ProductQuickView';
import { CheckoutModal } from './components/store/CheckoutModal';
import { OrderConfirmationModal } from './components/store/OrderConfirmationModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserAuthModal } from './components/user/UserAuthModal';
import { UserDashboard } from './components/user/UserDashboard';
import { OrderTrackingModal } from './components/user/OrderTrackingModal';
import { OrderDetailsModal } from './components/user/OrderDetailsModal';
import { InvoiceModal } from './components/user/InvoiceModal';
import { CancelReturnModal } from './components/user/CancelReturnModal';

export const App = () => {
  const { isAdminLoggedIn } = useAdmin();
  const [currentView, setCurrentView] = useState('store'); // 'store' or 'admin'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E1A] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black transition-colors duration-300">
      
      {/* Toast Notification Container */}
      <Toast />

      {/* Main Content Area */}
      {currentView === 'admin' && isAdminLoggedIn ? (
        <AdminDashboard onBackToStore={() => setCurrentView('store')} />
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Storefront Header */}
            <Navbar
              onOpenAdmin={handleOpenAdmin}
              onViewMode={setCurrentView}
              currentView={currentView}
            />

            {/* Hero Carousel */}
            <HeroBanner />

            {/* Category Browser */}
            <CategoryPills />

            {/* Flash Deals with Countdown */}
            <FlashDeals />

            {/* Catalog Grid with Filters & Search */}
            <ProductGrid />

            {/* Tech Trust Pillars & Reviews */}
            <FeaturesSection />
          </div>

          {/* Storefront Footer */}
          <Footer onOpenAdmin={handleOpenAdmin} />
        </div>
      )}

      {/* Modals & Slide-over Drawers */}
      <CartDrawer />
      <ProductQuickView />
      <CheckoutModal />
      <OrderConfirmationModal />
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* User Module Modals */}
      <UserAuthModal />
      <UserDashboard />
      <OrderTrackingModal />
      <OrderDetailsModal />
      <InvoiceModal />
      <CancelReturnModal />
    </div>
  );
};
