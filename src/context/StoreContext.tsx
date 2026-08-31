import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, CartItem, ProductBundle, Review, SiteSettings } from '../types';
import { api } from '../lib/api';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  settings: SiteSettings | null;
  isLoading: boolean;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number, bundle?: ProductBundle) => void;
  removeFromCart: (productId: string, bundleId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, bundleId?: string) => void;
  clearCart: () => void;
  quickOrderModal: {
    isOpen: boolean;
    product: Product | null;
    bundle?: ProductBundle;
  };
  openQuickOrder: (product: Product, bundle?: ProductBundle) => void;
  closeQuickOrder: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshStoreData: () => Promise<void>;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cart local state with persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('musfira_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quickOrderModal, setQuickOrderModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    bundle?: ProductBundle;
  }>({
    isOpen: false,
    product: null,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [fetchedProducts, fetchedCategories, fetchedReviews, fetchedSettings] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getReviews(),
        api.getSettings(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setReviews(fetchedReviews);
      setSettings(fetchedSettings);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('musfira_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Could not save cart:', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, bundle?: ProductBundle) => {
    setCart((prev) => {
      const bundleId = bundle?.id || 'single';
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && (item.selectedBundle?.id || 'single') === bundleId
      );

      const unitPrice = bundle ? bundle.price : product.price;

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            quantity,
            selectedBundle: bundle,
            unitPrice,
          },
        ];
      }
    });

    showToast(`Added "${product.name}${bundle ? ` (${bundle.name})` : ''}" to cart!`);
  };

  const removeFromCart = (productId: string, bundleId?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && (item.selectedBundle?.id || 'single') === (bundleId || 'single'))
      )
    );
  };

  const updateCartQuantity = (productId: string, quantity: number, bundleId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, bundleId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && (item.selectedBundle?.id || 'single') === (bundleId || 'single')) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openQuickOrder = (product: Product, bundle?: ProductBundle) => {
    setQuickOrderModal({
      isOpen: true,
      product,
      bundle,
    });
  };

  const closeQuickOrder = () => {
    setQuickOrderModal({
      isOpen: false,
      product: null,
      bundle: undefined,
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        reviews,
        settings,
        isLoading,
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        quickOrderModal,
        openQuickOrder,
        closeQuickOrder,
        mobileMenuOpen,
        setMobileMenuOpen,
        searchOpen,
        setSearchOpen,
        searchQuery,
        setSearchQuery,
        refreshStoreData: loadData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
