import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductBundle, Order, StoreSettings, Review, MediaAsset, OrderStatus } from '../types';
import { BrandAssets } from '../assets/images';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  subscribeToOrders,
  createFirestoreOrder,
  updateFirestoreOrderStatus,
  deleteFirestoreOrder,
  fetchOrdersDirectly,
  cleanFirestoreData,
  subscribeToProducts,
  saveFirestoreProduct,
  deleteFirestoreProduct,
  seedInitialProductsIfEmpty,
  subscribeToSettings,
  saveFirestoreSettings,
  subscribeToReviews,
  saveFirestoreReview,
  deleteFirestoreReview,
} from '../lib/firestoreService';

export interface CartItem {
  product: Product;
  bundle?: ProductBundle;
  quantity: number;
}

interface StoreContextType {
  products: Product[];
  settings: StoreSettings;
  orders: Order[];
  reviews: Review[];
  media: MediaAsset[];
  cart: CartItem[];
  isQuickOrderOpen: boolean;
  quickOrderProduct: Product | null;
  quickOrderBundle: ProductBundle | null;
  addToCart: (product: Product, bundle?: ProductBundle, quantity?: number) => void;
  removeFromCart: (productId: string, bundleId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, bundleId?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isLiveBackend: boolean;
  openQuickOrder: (product: Product, bundle?: ProductBundle) => void;
  closeQuickOrder: () => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Order>;
  refreshOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, courierName?: string) => void;
  deleteOrder: (orderId: string) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date' | 'verified'>) => void;
  deleteReview: (id: string) => void;
  addMedia: (asset: Omit<MediaAsset, 'id' | 'uploadedAt'>) => void;
  deleteMedia: (id: string) => void;
}

export const defaultProducts: Product[] = [
  {
    id: 'prod_musfira_cream',
    name: 'Musfira Beauty Cream',
    urduName: 'مسفرا بیوٹی کریم',
    slug: 'musfira-beauty-cream',
    category: 'Beauty Cream',
    price: 1499,
    originalPrice: 1499,
    stockStatus: 'in_stock',
    rating: 5.0,
    reviewCount: 5,
    images: [BrandAssets.musfiraCreamMain, BrandAssets.beforeAfter1, BrandAssets.beforeAfter2],
    description:
      'Musfira Beauty Cream is formulated with powerful herbal and dermatologist-tested ingredients to visibly reduce dark spots, pigmentation, freckles, and acne marks within 7 days.',
    urduDescription:
      'مسفرا بیوٹی کریم چہرے کی جھائیوں، دانوں، داغ دھبوں اور بے رونق جلد کو صاف اور شفاف بنانے کے لیے 100٪ مؤثر اور محفوظ فارمولا ہے۔',
    shortDescription: 'One Sold Every Minute. 100% Steroid-Free herbal formula with rapid visible results.',
    isFeatured: true,
    benefits: [
      'Visible results within 7 days',
      'Safe for all skin types, including sensitive skin',
      'Reduces acne marks, freckles, pigmentation & dark spots',
      'Tightens open pores and smoothens skin texture',
      '100% Steroid-free formula with zero harmful side effects',
    ],
    urduBenefits: [
      'صرف 7 دن میں نمایاں نتائج',
      'ہر قسم کی جلد کے لیے محفوظ، حتی کہ حساس جلد کے لیے بھی',
      'مہاسوں کے نشانات، چھائیاں (Freckles)، رنگت کی بے ترتیبی (Pigmentation) اور سیاہ دھبوں کو کم کرنے میں مددگار',
      'کھلے مسام (Open Pores) کو کم کر کے جلد کو ہموار اور صاف دکھاتا ہے',
      '100% Steroid-Free فارمولا، بغیر مضر اثرات کے',
    ],
    howToUse: [
      'Wash your face thoroughly and leave it slightly damp.',
      'Apply the cream gently onto the skin.',
      'If you have acne, apply only on the affected acne spots for the first 3 days.',
      'Once acne subsides, apply evenly all over face at night for 7 days for best results.',
    ],
    urduHowToUse: [
      '1. اپنے چہرے کو اچھی طرح دھو لیں اور ہلکا سا نم رہنے دیں۔',
      '2. کریم کو نرمی کے ساتھ جلد پر لگائیں۔',
      '3. اگر آپ کو مہاسے ہیں تو پہلے 3 دن صرف متاثرہ جگہوں (مہاسوں) پر لگائیں۔',
      '4. جب مہاسے کم ہو جائیں، تو بہترین نتائج کے لیے کریم کو رات کے وقت پورے چہرے پر 7 دن لگائیں۔',
    ],
    bundles: [
      {
        id: 'bundle_1',
        name: '1 Pack',
        urduName: '1 پیک',
        quantity: 1,
        price: 1499,
        originalPrice: 1499,
        discountPercentage: 0,
        isDefault: false,
      },
      {
        id: 'bundle_2',
        name: '2 Packs',
        urduName: '2 پیکس (موسٹ پاپولر)',
        quantity: 2,
        price: 2499,
        originalPrice: 2998,
        discountPercentage: 17,
        badge: 'Most Popular',
        isDefault: true,
      },
      {
        id: 'bundle_3',
        name: '3 Packs',
        urduName: '3 پیکس (بڑی بچت)',
        quantity: 3,
        price: 3499,
        originalPrice: 4497,
        discountPercentage: 22,
        badge: 'Save Rs. 1000',
        isDefault: false,
      },
    ],
  },
  {
    id: 'prod_musfira_polish',
    name: 'Musfira Skin Polish',
    urduName: 'مسفرا اسکن پالش',
    slug: 'musfira-skin-polish',
    category: 'Skin Polish',
    price: 1999,
    originalPrice: 3000,
    stockStatus: 'out_of_stock',
    rating: 0,
    reviewCount: 0,
    images: [BrandAssets.wikiSkinPolish],
    description: 'Musfira 20v Ultra Whitening Skin Polish and 24k Gold Brightener dual step skincare system.',
    urduDescription: 'مسفرا اسکن پالش فوری سیلون جیسا گلو اور نکھار فراہم کرتی ہے۔',
    shortDescription: 'Ultra Whitening Skin Polish & 24k Gold Brightener.',
    isFeatured: true,
    benefits: ['Instant salon glow', 'Removes dead skin', 'Deep cleanses pores'],
    urduBenefits: ['فوری پارلر جیسی چمک', 'مردہ جلد کا خاتمہ'],
    howToUse: ['Mix developer and polish powder, apply for 10-15 minutes, rinse.'],
  },
  {
    id: 'prod_musfira_hair_blocker',
    name: 'Musfira Hair Blocker',
    urduName: 'مسفرا ہیئر بلاکر کریم',
    slug: 'musfira-hair-blocker',
    category: 'Hair Removal & Blocker',
    price: 1499,
    originalPrice: 1499,
    stockStatus: 'out_of_stock',
    rating: 0,
    reviewCount: 0,
    images: [BrandAssets.wikiHairBlocker],
    description: 'Permanent blockage of unwanted hairs from any part of body.',
    urduDescription: 'غیر ضروری بالوں کی مستقل کمی کے لیے قدرتی کریم۔',
    shortDescription: 'Permanent reduction of unwanted facial and body hairs.',
    isFeatured: false,
    benefits: ['Slows down hair regrowth', 'Weakens hair follicles', 'Gentle on skin'],
    howToUse: ['Apply daily on cleansed areas after hair removal.'],
  },
  {
    id: 'prod_musfira_face_wash',
    name: 'Musfira Face Wash',
    urduName: 'مسفرا فیس واش',
    slug: 'musfira-face-wash',
    category: 'Face Wash',
    price: 1299,
    originalPrice: 1299,
    stockStatus: 'out_of_stock',
    rating: 0,
    reviewCount: 0,
    images: [BrandAssets.wikiFaceWash],
    description: 'Formulated under dermatologist control whitening creamy facial wash.',
    urduDescription: 'ڈرماٹولوجسٹ تصدیق شدہ وائٹننگ کریمی فیس واش۔',
    shortDescription: 'Whitening creamy facial wash with active skin purifiers.',
    isFeatured: false,
    benefits: ['Deep pore cleansing', 'Non-drying lather', 'Gentle brightening'],
    howToUse: ['Pump small amount, lather on wet face, wash with lukewarm water.'],
  },
  {
    id: 'prod_musfira_brightening_serum',
    name: 'Musfira Skin Brightening Serum',
    urduName: 'مسفرا اسکن برائٹننگ سیرم',
    slug: 'musfira-skin-brightening-serum',
    category: 'Serum',
    price: 1999,
    originalPrice: 3000,
    stockStatus: 'in_stock',
    rating: 0,
    reviewCount: 0,
    images: [BrandAssets.wikiBrighteningSerum],
    description: '24k gold infused skin brightening and spot correction elixir.',
    urduDescription: 'جلد کو چمکدار اور نکھار دینے والا گولڈ سیرم۔',
    shortDescription: '24K Gold extract skin brightening spot corrector.',
    isFeatured: true,
    benefits: ['Adds natural luminosity', 'Fades dullness', 'Hydrates deeply'],
    howToUse: ['Apply 2-3 drops before moisturising.'],
  },
  {
    id: 'prod_musfira_rose_water',
    name: 'Musfira Rose Water',
    urduName: 'مسفرا روز واٹر اسپرے',
    slug: 'musfira-rose-water',
    category: 'Toner',
    price: 850,
    originalPrice: 1200,
    stockStatus: 'in_stock',
    rating: 0,
    reviewCount: 0,
    images: [BrandAssets.wikiRoseWater],
    description: 'Pure organic rose water mist for refreshing hydration and pore toning.',
    urduDescription: 'خالص عرق گلاب اسپرے، جلد کو تروتازہ رکھنے کے لیے۔',
    shortDescription: 'Pure organic refreshing face toner mist.',
    isFeatured: false,
    benefits: ['Balances pH', 'Soothes redness', 'Hydrates instantly'],
    howToUse: ['Spray generously on face anytime during the day.'],
  },
  {
    id: 'prod_musfira_lip_balm',
    name: 'Musfira Lip Balm',
    urduName: 'مسفرا لپ بام',
    slug: 'musfira-lip-balm',
    category: 'Lip Care',
    price: 1500,
    originalPrice: 2000,
    stockStatus: 'out_of_stock',
    rating: 0,
    reviewCount: 0,
    images: [BrandAssets.wikiLipBalm],
    description: 'For instantly soft lips with a natural tint of healthy pink.',
    urduDescription: 'ہونٹوں کو نرم اور قدرتی گلابی بنانے کے لیے۔',
    shortDescription: 'Instantly soft lips with a tint of pink.',
    isFeatured: false,
    benefits: ['Heals cracked lips', 'Provides natural pink gloss', 'Long lasting hydration'],
    howToUse: ['Apply directly to lips whenever needed.'],
  },
  {
    id: 'prod_musfira_acne_serum',
    name: 'Musfira Acne Serum',
    urduName: 'مسفرا اینٹی ایکنی سیرم',
    slug: 'musfira-acne-serum',
    category: 'Serum',
    price: 2000,
    originalPrice: 3000,
    stockStatus: 'out_of_stock',
    rating: 0,
    reviewCount: 0,
    images: [BrandAssets.wikiAcneSerum],
    description: 'Fast acting anti-acne serum that eliminates pimples and prevents recurring breakouts.',
    urduDescription: 'کیل مہاسے اور دانوں کو جڑ سے ختم کرنے والا خصوصی سیرم۔',
    shortDescription: 'Targeted anti-acne spot treatment and redness reliever.',
    isFeatured: false,
    benefits: ['Calms inflamed acne', 'Prevents pore clogging', 'Fades marks'],
    howToUse: ['Apply directly onto acne spots twice daily.'],
  },
];

export const defaultReviews: Review[] = [
  {
    id: 'rev_1',
    author: 'Zainab bibi',
    initials: 'ZB',
    city: 'Lahore',
    rating: 5,
    date: '06/23/2026',
    verified: true,
    comment: 'Boht farq parha Musfira Cream se, Allah khush rakhay aap ko 🥺',
    beforeAfterImage: BrandAssets.beforeAfter1,
  },
  {
    id: 'rev_2',
    author: 'Alishba',
    initials: 'A',
    city: 'Karachi',
    rating: 5,
    date: '06/23/2026',
    verified: true,
    comment: 'Original Musfira cream delivery was very fast. Skin is glowing!',
    beforeAfterImage: BrandAssets.beforeAfter2,
  },
  {
    id: 'rev_3',
    author: 'Laiba',
    initials: 'L',
    city: 'Rawalpindi',
    rating: 5,
    date: '06/23/2026',
    verified: true,
    comment: 'Bht achi cream meri skin kafi glow kr rhi ab. 100% recommended.',
    beforeAfterImage: BrandAssets.beforeAfter1,
  },
  {
    id: 'rev_4',
    author: 'Ahmed Raja',
    initials: 'AR',
    city: 'Islamabad',
    rating: 5,
    date: '06/21/2026',
    verified: true,
    comment: 'Ordered for my wife, freckles are almost gone in 1 week. Excellent!',
  },
  {
    id: 'rev_5',
    author: 'Ali Arbaz',
    initials: 'AA',
    city: 'Faisalabad',
    rating: 5,
    date: '06/21/2026',
    verified: true,
    comment: 'Bht achi Musfira cream ha results are real.',
  },
];

const defaultSettings: StoreSettings = {
  storeName: 'Musfira Beauty Cream',
  phone: '0300-1234567',
  whatsappNumber: '923001234567',
  email: 'musfirabeautycream@gmail.com',
  deliveryFee: 0,
  freeDeliveryThreshold: 0,
  announcementText: 'Free shipping all over Pakistan',
  announcementUrdu: 'پورے پاکستان میں فری کیش آن ڈیلیوری کی سہولت دستیاب ہے',
  landingImages: [BrandAssets.musfiraCreamMain],
  heroHeadline: 'Musfira Beauty Cream',
  heroHeadlineUrdu: 'مسفرا بیوٹی کریم',
  heroSubheadline: '100% Herbal & Steroid-Free Skincare Formula',
  heroSubheadlineUrdu: 'صرف 7 دنوں میں داغ دھبوں اور جھائیوں کا خاتمہ',
  guaranteeDays: 7,
  codAvailable: true,
  showUrdu: true,
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sanitizeProduct = (p: Product): Product => {
    let name = p.name.replace(/Wiki Special/gi, 'Musfira').replace(/Wiki/gi, 'Musfira');
    let urduName = p.urduName ? p.urduName.replace(/وکی اسپیشل/g, 'مسفرا').replace(/وکی/g, 'مسفرا') : 'مسفرا بیوٹی کریم';
    let description = p.description.replace(/Wiki Special/gi, 'Musfira').replace(/Wiki/gi, 'Musfira');
    let urduDescription = p.urduDescription ? p.urduDescription.replace(/وکی اسپیشل/g, 'مسفرا').replace(/وکی/g, 'مسفرا') : '';
    return {
      ...p,
      name,
      urduName,
      description,
      urduDescription,
      images: p.images && p.images.length > 0 ? p.images : [BrandAssets.musfiraCreamMain],
    };
  };

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('musfira_products_v3') || localStorage.getItem('wiki_products_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeProduct);
        }
      } catch (e) {
        console.error(e);
      }
    }
    return defaultProducts;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('musfira_settings_v3') || localStorage.getItem('wiki_settings_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSettings,
          ...parsed,
          storeName: 'Musfira Beauty Cream',
          heroHeadline: 'Musfira Beauty Cream',
          heroHeadlineUrdu: 'مسفرا بیوٹی کریم',
        };
      } catch (e) {
        console.error(e);
      }
    }
    return defaultSettings;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('musfira_orders_v3') || localStorage.getItem('wiki_orders_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('musfira_reviews_v3') || localStorage.getItem('wiki_reviews_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r: Review) => ({
            ...r,
            comment: r.comment ? r.comment.replace(/Wiki/gi, 'Musfira') : r.comment,
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return defaultReviews;
  });

  const [media, setMedia] = useState<MediaAsset[]>([
    { id: 'm1', name: 'Musfira Beauty Cream', url: BrandAssets.musfiraCreamMain, category: 'products', uploadedAt: new Date().toISOString() },
  ]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('musfira_cart_v3') || localStorage.getItem('wiki_cart_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        product: defaultProducts[0],
        quantity: 1,
      },
    ];
  });

  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  const [quickOrderBundle, setQuickOrderBundle] = useState<ProductBundle | null>(null);

  // Firestore live subscriptions
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(true);

  useEffect(() => {
    // Seed default products to Firestore if empty
    seedInitialProductsIfEmpty(defaultProducts);

    // Live Orders Listener
    const unsubOrders = subscribeToOrders((liveOrders) => {
      setOrders((prev) => {
        // If there are any local orders from this browser that haven't synced yet, push them to Firestore
        const liveIds = new Set(liveOrders.map((o) => o.id));
        const unsynced = prev.filter((o) => !liveIds.has(o.id));
        if (unsynced.length > 0) {
          unsynced.forEach(async (unsyncedOrder) => {
            try {
              const docRef = doc(db, 'orders', unsyncedOrder.id);
              await setDoc(docRef, cleanFirestoreData(unsyncedOrder));
              console.log('Automatically synced pending order to Firestore:', unsyncedOrder.id);
            } catch (e) {
              console.warn('Failed to sync pending order to Firestore:', unsyncedOrder.id, e);
            }
          });
          return [...liveOrders, ...unsynced];
        }
        return liveOrders;
      });
      setIsLiveBackend(true);
    });

    // Live Products Listener
    const unsubProducts = subscribeToProducts((liveProducts) => {
      if (liveProducts.length > 0) {
        setProducts(liveProducts.map(sanitizeProduct));
      }
    });

    // Live Settings Listener
    const unsubSettings = subscribeToSettings((liveSettings) => {
      setSettings((prev) => ({
        ...prev,
        ...liveSettings,
        storeName: 'Musfira Beauty Cream',
        heroHeadline: 'Musfira Beauty Cream',
        heroHeadlineUrdu: 'مسفرا بیوٹی کریم',
      }));
    });

    // Live Reviews Listener
    const unsubReviews = subscribeToReviews((liveReviews) => {
      if (liveReviews.length > 0) {
        setReviews(
          liveReviews.map((r) => ({
            ...r,
            comment: r.comment ? r.comment.replace(/Wiki/gi, 'Musfira') : r.comment,
          }))
        );
      }
    });

    return () => {
      unsubOrders();
      unsubProducts();
      unsubSettings();
      unsubReviews();
    };
  }, []);

  // Sync state to local storage backup
  useEffect(() => {
    localStorage.setItem('musfira_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('musfira_settings_v3', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('musfira_orders_v3', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('musfira_reviews_v3', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('musfira_cart_v3', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const addToCart = (product: Product, bundle?: ProductBundle, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.bundle?.id === bundle?.id
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, bundle, quantity }];
    });
  };

  const removeFromCart = (productId: string, bundleId?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.bundle?.id === bundleId))
    );
  };

  const updateCartQuantity = (productId: string, quantity: number, bundleId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, bundleId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.bundle?.id === bundleId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => {
    const unitPrice = item.bundle ? item.bundle.price : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Quick Order
  const openQuickOrder = (product: Product, bundle?: ProductBundle) => {
    setQuickOrderProduct(product);
    setQuickOrderBundle(bundle || product.bundles?.find((b) => b.isDefault) || product.bundles?.[0] || null);
    setIsQuickOrderOpen(true);
  };

  const closeQuickOrder = () => {
    setIsQuickOrderOpen(false);
    setQuickOrderProduct(null);
    setQuickOrderBundle(null);
  };

  const refreshOrders = async () => {
    try {
      const freshOrders = await fetchOrdersDirectly();
      if (freshOrders && freshOrders.length > 0) {
        setOrders(freshOrders);
      }
    } catch (e) {
      console.warn('Error refreshing orders:', e);
    }
  };

  // Place Order - saved to live Firestore & state
  const placeOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<Order> => {
    const newOrder = await createFirestoreOrder(orderData);
    setOrders((prev) => {
      const exists = prev.some((o) => o.id === newOrder.id);
      return exists ? prev : [newOrder, ...prev];
    });
    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    courierName?: string
  ) => {
    // Update locally immediately
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            trackingNumber: trackingNumber !== undefined ? trackingNumber : ord.trackingNumber,
            courierName: courierName !== undefined ? courierName : ord.courierName,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    // Sync to Firestore
    await updateFirestoreOrderStatus(orderId, status, trackingNumber, courierName);
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    await deleteFirestoreOrder(orderId);
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    await saveFirestoreSettings(merged);
  };

  const updateProduct = async (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    await saveFirestoreProduct(updatedProduct);
  };

  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    const id = `prod_${Date.now()}`;
    const productWithId: Product = { ...newProduct, id };
    setProducts((prev) => [productWithId, ...prev]);
    await saveFirestoreProduct(productWithId);
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await deleteFirestoreProduct(id);
  };

  const addReview = async (review: Omit<Review, 'id' | 'date' | 'verified'>) => {
    const newRev: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      date: new Date().toLocaleDateString(),
      verified: true,
    };
    setReviews((prev) => [newRev, ...prev]);
    await saveFirestoreReview(newRev);
  };

  const deleteReview = async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    await deleteFirestoreReview(id);
  };

  const addMedia = (asset: Omit<MediaAsset, 'id' | 'uploadedAt'>) => {
    const newAsset: MediaAsset = {
      ...asset,
      id: `media_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setMedia((prev) => [newAsset, ...prev]);
  };

  const deleteMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        orders,
        reviews,
        media,
        cart,
        isQuickOrderOpen,
        quickOrderProduct,
        quickOrderBundle,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isLiveBackend,
        openQuickOrder,
        closeQuickOrder,
        placeOrder,
        refreshOrders,
        updateOrderStatus,
        deleteOrder,
        updateSettings,
        updateProduct,
        addProduct,
        deleteProduct,
        addReview,
        deleteReview,
        addMedia,
        deleteMedia,
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
