import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileMenu } from './components/MobileMenu';
import { QuickOrderModal } from './components/QuickOrderModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Product, Order } from './types';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setLastOrder(order);
    setCurrentPage('order_success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in admin mode
  if (currentPage === 'admin') {
    if (isAuthenticated) {
      return <AdminDashboard onBackToStore={() => handleNavigate('home')} />;
    }
    return <AdminLogin onBackToStore={() => handleNavigate('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-slate-900 selection:bg-amber-600 selection:text-white">
      {/* Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={handleNavigate}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPage={currentPage}
        setCurrentPage={handleNavigate}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            setCurrentPage={handleNavigate}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage onSelectProduct={handleSelectProduct} />
        )}

        {currentPage === 'product_detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => handleNavigate('shop')}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage setCurrentPage={handleNavigate} />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={handleOrderSuccess}
            setCurrentPage={handleNavigate}
          />
        )}

        {currentPage === 'order_success' && lastOrder && (
          <OrderSuccessPage
            order={lastOrder}
            setCurrentPage={handleNavigate}
          />
        )}

        {currentPage === 'track' && <TrackOrderPage />}

        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer setCurrentPage={handleNavigate} />

      {/* Quick Cash on Delivery Order Modal */}
      <QuickOrderModal onOrderSuccess={handleOrderSuccess} />

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton />
    </div>
  );
};

export function App() {
  return (
    <AdminAuthProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AdminAuthProvider>
  );
}

export default App;
