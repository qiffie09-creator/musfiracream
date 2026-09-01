import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Category, CartItem, ProductBundle, Review, SiteSettings } from '../types';
import { api } from '../lib/api';
import { BrandAssets } from '../assets/images';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'msf-001',
    sku: 'MSF-001',
    name: 'Musfira Special Skincare Beauty Cream',
    slug: 'musfira-special-cream',
    tagline: '100% Original Formula For Spotless, Radiant & Glowing Skin',
    price: 1499,
    salePrice: 1999,
    discountPercentage: 25,
    category: 'creams',
    stock: 500,
    stockStatus: 'in_stock',
    rating: 4.9,
    reviewCount: 342,
    images: [],
    description:
      'Musfira Special Skincare Beauty Cream is an authentic herbal skin-nourishing formula specially crafted for Pakistani skin tones. It visibly reduces dark spots, hyperpigmentation, uneven skin tone, and freckles while maintaining natural skin barrier moisture.',
    shortDescription: '100% Guaranteed results in 7 days without harmful steroids or mercury.',
    bundles: [
      {
        id: 'b-1',
        name: '1 Pack',
        packCount: 1,
        packsCount: 1,
        price: 1499,
        originalPrice: 1999,
        badge: 'Trial Pack',
        isDefault: false,
      },
      {
        id: 'b-2',
        name: '2 Packs',
        packCount: 2,
        packsCount: 2,
        price: 2499,
        originalPrice: 2998,
        badge: 'Most Popular',
        savingsText: 'Save Rs. 500',
        isDefault: true,
      },
      {
        id: 'b-3',
        name: '3 Packs',
        packCount: 3,
        packsCount: 3,
        price: 3499,
        originalPrice: 4497,
        badge: 'Best Value',
        savingsText: 'Save Rs. 1,000',
        isDefault: false,
      },
    ],
    isFeatured: true,
    isBestSeller: true,
    badges: ['Free Delivery', 'Cash on Delivery', '100% Original', 'No Side Effects'],
    urduBenefits: [
      'چہرے کے تمام داغ دھبے، چھائیاں اور پمپلز جڑ سے ختم کرے',
      'رنگت کو نکھارے اور قدرتی چمک اور شادابی بخشے',
      'سو فیصد اسٹیرائیڈ اور مرکری سے پاک محفوظ فارمولا',
      'صرف سات دنوں میں واضح اور حیرت انگیز نتائج کی ضمانت',
    ],
    urduUsage: [
      'رات سونے سے پہلے چہرے کو اچھے فیس واش سے دھو کر خشک کر لیں۔',
      'تھوڑی سی مسفرا بیوٹی کریم لے کر چہرے اور گردن پر ہلکے ہاتھ سے لگائیں۔',
      'صبح اٹھ کر نیم گرم یا ٹھنڈے پانی سے چہرہ دھو لیں۔',
    ],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'msf-002',
    sku: 'MSF-002',
    name: 'Musfira Glow Skin Polish',
    slug: 'musfira-glow-skin-polish',
    tagline: 'Instant Salon-Grade Radiance & Exfoliation',
    price: 1299,
    salePrice: 1699,
    discountPercentage: 24,
    category: 'polishes',
    stock: 250,
    stockStatus: 'in_stock',
    rating: 4.8,
    reviewCount: 189,
    images: [],
    description: 'Gentle micro-exfoliating skin polish that eliminates dead skin cells, softens texture, and unclogs pores.',
    shortDescription: 'Instant parlor-like facial glow at home.',
    isFeatured: true,
    isBestSeller: false,
    badges: ['Salon Finish', 'Free Delivery'],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'msf-003',
    sku: 'MSF-003',
    name: 'Musfira Organic Acne & Blemish Serum',
    slug: 'musfira-acne-serum',
    tagline: 'Pure Tea Tree, Niacinamide & Salicylic Blend',
    price: 1699,
    salePrice: 2199,
    discountPercentage: 23,
    category: 'serums',
    stock: 180,
    stockStatus: 'in_stock',
    rating: 4.9,
    reviewCount: 215,
    images: [],
    description: 'Targeted spot reducer and pore minimizer with fast soothing action against stubborn breakouts.',
    shortDescription: 'Clears acne marks and calms skin redness.',
    isFeatured: true,
    isBestSeller: true,
    badges: ['Dermatologist Tested', 'Fast Acting'],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('musfira_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PRODUCTS;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('musfira_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(() => {
    try {
      const saved = localStorage.getItem('musfira_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

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
      const [fetchedProducts, fetchedCategories, fetchedReviews, fetchedSettings] = await Promise.all([
        api.getProducts().catch(() => INITIAL_PRODUCTS),
        api.getCategories().catch(() => []),
        api.getReviews().catch(() => []),
        api.getSettings().catch(() => null),
      ]);
      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        try { localStorage.setItem('musfira_products', JSON.stringify(fetchedProducts)); } catch {}
      }
      if (fetchedCategories && fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
        try { localStorage.setItem('musfira_categories', JSON.stringify(fetchedCategories)); } catch {}
      }
      if (fetchedReviews && fetchedReviews.length > 0) {
        setReviews(fetchedReviews);
      }
      if (fetchedSettings) {
        setSettings(fetchedSettings);
        try { localStorage.setItem('musfira_settings', JSON.stringify(fetchedSettings)); } catch {}
      }
    } catch (err) {
      console.error('Failed to load store data:', err);
    }
  };

  useEffect(() => {
    loadData();

    // Set up Real-time Live Firestore Listeners so changes from admin are immediately live
    let unsubProducts = () => {};
    let unsubCategories = () => {};
    let unsubSettings = () => {};
    let unsubReviews = () => {};

    try {
      unsubProducts = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          if (!snapshot.empty) {
            const liveProducts = snapshot.docs
              .map((d) => ({ ...d.data(), id: d.id } as Product))
              .filter((p) => p.active !== false);
            if (liveProducts.length > 0) {
              setProducts(liveProducts);
              try { localStorage.setItem('musfira_products', JSON.stringify(liveProducts)); } catch {}
            }
          }
        },
        (error) => {
          console.warn('Firestore live products listener warning (using fallback polling):', error.message);
        }
      );

      unsubCategories = onSnapshot(
        collection(db, 'categories'),
        (snapshot) => {
          if (!snapshot.empty) {
            const liveCats = snapshot.docs
              .map((d) => ({ ...d.data(), id: d.id } as Category))
              .filter((c) => c.active !== false);
            if (liveCats.length > 0) {
              setCategories(liveCats);
              try { localStorage.setItem('musfira_categories', JSON.stringify(liveCats)); } catch {}
            }
          }
        },
        (error) => {
          console.warn('Firestore live categories listener warning:', error.message);
        }
      );

      unsubSettings = onSnapshot(
        doc(db, 'settings', 'site_settings'),
        (snapshot) => {
          if (snapshot.exists()) {
            const liveSettings = snapshot.data() as SiteSettings;
            if (liveSettings && liveSettings.brandName) {
              setSettings(liveSettings);
              try { localStorage.setItem('musfira_settings', JSON.stringify(liveSettings)); } catch {}
            }
          }
        },
        (error) => {
          console.warn('Firestore live settings listener warning:', error.message);
        }
      );

      unsubReviews = onSnapshot(
        collection(db, 'reviews'),
        (snapshot) => {
          if (!snapshot.empty) {
            const liveReviews = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Review));
            if (liveReviews.length > 0) {
              setReviews(liveReviews);
            }
          }
        },
        (error) => {
          console.warn('Firestore live reviews listener warning:', error.message);
        }
      );
    } catch (e) {
      console.warn('Could not establish initial Firestore onSnapshot listeners:', e);
    }

    // Polling heartbeat every 10 seconds for seamless continuous synchronization
    const pollInterval = setInterval(() => {
      loadData();
    }, 10000);

    const handleSettingsUpdated = (e: any) => {
      if (e.detail) {
        setSettings(e.detail);
      } else {
        loadData();
      }
    };

    const handleDataUpdated = () => {
      loadData();
    };

    window.addEventListener('musfira_settings_updated', handleSettingsUpdated);
    window.addEventListener('musfira_data_updated', handleDataUpdated);

    return () => {
      unsubProducts();
      unsubCategories();
      unsubSettings();
      unsubReviews();
      clearInterval(pollInterval);
      window.removeEventListener('musfira_settings_updated', handleSettingsUpdated);
      window.removeEventListener('musfira_data_updated', handleDataUpdated);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('musfira_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Could not save cart:', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, bundle?: ProductBundle) => {
    if (!product) return;
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
    if (!product) return;
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

