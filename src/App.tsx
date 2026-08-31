import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { QuickOrderModal } from './components/QuickOrderModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { ContactPage } from './pages/ContactPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>('musfira-special-cream');
  const [successOrderId, setSuccessOrderId] = useState<string>('');

  const { toastMessage } = useStore();
  const { isAuthenticated, isLoading: isAuthLoading } = useAdminAuth();

  // Listen to browser URL path and hash changes
  useEffect(() => {
    const handleUrlRoute = () => {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.replace('#', '').toLowerCase();

      if (pathname === '/admin' || pathname === '/admin/' || pathname.startsWith('/admin') || hash === 'admin') {
        setCurrentView('admin');
      } else if (hash.startsWith('product/')) {
        const slug = hash.replace('product/', '');
        setSelectedProductSlug(slug);
        setCurrentView('product-detail');
      } else if (hash === 'cart') {
        setCurrentView('cart');
      } else if (hash === 'shop' || hash === 'products') {
        setCurrentView('shop');
      } else if (hash === 'contact') {
        setCurrentView('contact');
      } else if (hash === 'track') {
        setCurrentView('track');
      } else if (pathname === '/' || hash === '' || hash === 'home') {
        if (currentView === 'admin' && !pathname.startsWith('/admin') && hash !== 'admin') {
          setCurrentView('home');
        }
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, [currentView]);

  const handleSelectProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentView('product-detail');
    window.location.hash = `product/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderId: string) => {
    setSuccessOrderId(orderId);
    setCurrentView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToStore = () => {
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin View
  if (currentView === 'admin') {
    if (isAuthLoading) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <AdminLogin onBackToStore={handleReturnToStore} />;
    }

    return <AdminDashboard onGoToStore={handleReturnToStore} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] text-slate-900 selection:bg-blue-900 selection:text-white relative">
      {/* 1. Header Navigation */}
      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectProduct={handleSelectProduct}
      />

      {/* 2. Mobile Sliding Drawer Menu */}
      <MobileMenu
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 3. Main Route Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            setCurrentView={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage onSelectProduct={handleSelectProduct} />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailPage
            slug={selectedProductSlug}
            onBack={() => setCurrentView('shop')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            setCurrentView={setCurrentView}
            onProceedCheckout={() => {
              setCurrentView('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBack={() => setCurrentView('cart')}
            onOrderPlaced={handleOrderSuccess}
          />
        )}

        {currentView === 'order-success' && (
          <OrderSuccessPage
            orderId={successOrderId || 'MSF-94821'}
            onContinueShopping={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'contact' && <ContactPage />}

        {currentView === 'track' && <TrackOrderPage />}
      </main>

      {/* 4. Storefront Footer */}
      <Footer
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 5. Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* 6. Quick Direct Order / Buy It Now Modal */}
      <QuickOrderModal onOrderSuccess={handleOrderSuccess} />

      {/* 7. Toast Alerts */}
      {toastMessage && (
        <div className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div
            className={`px-4 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center space-x-2 border backdrop-blur-md ${
              toastMessage.type === 'error'
                ? 'bg-red-900/90 text-white border-red-700'
                : 'bg-slate-900/95 text-white border-slate-700'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AdminAuthProvider>
        <AppContent />
      </AdminAuthProvider>
    </StoreProvider>
  );
}
