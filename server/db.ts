import fs from 'fs';
import path from 'path';
import { hashPassword } from './auth';

export interface DBProductBundle {
  id: string;
  name: string;
  packCount: number;
  price: number;
  originalPrice?: number;
  savingsText?: string;
  badge?: string;
  isDefault?: boolean;
}

export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  sku: string;
  images: string[];
  category: string;
  stock: number;
  stockStatus: 'in_stock' | 'low_stock' | 'sold_out';
  isFeatured: boolean;
  isBestSeller: boolean;
  badges?: string[];
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  urduBenefits?: string[];
  urduUsage?: string[];
  bundles?: DBProductBundle[];
  active: boolean;
  viewingCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DBCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  active: boolean;
}

export interface DBOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  bundleName?: string;
}

export interface DBOrder {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  nearbyPlace?: string;
  city: string;
  postalCode?: string;
  notes?: string;
  items: DBOrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'COD' | 'Online';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface DBReview {
  id: string;
  productId: string;
  productName?: string;
  reviewerName: string;
  initials: string;
  rating: number;
  date: string;
  comment: string;
  beforeAfterImage?: string;
  verified: boolean;
}

export interface DBSiteSettings {
  brandName: string;
  brandTagline: string;
  logoUrl: string;
  faviconUrl?: string;
  landingImages?: string[];
  bismillahText: string;
  tickerText: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  address: string;
  freeShippingText: string;
  orderNoticeTitle: string;
  orderNoticePoints: string[];
  orderNoticeWarnings: string[];
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  footerText: string;
}

export interface DBAdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}

export interface DatabaseSchema {
  adminUsers: DBAdminUser[];
  products: DBProduct[];
  categories: DBCategory[];
  orders: DBOrder[];
  reviews: DBReview[];
  settings: DBSiteSettings;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'musfira_database.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function getInitialData(): DatabaseSchema {
  const adminPassword = process.env.ADMIN_PASSWORD || 'MusfiraAdmin2026!';
  const hashedPassword = hashPassword(adminPassword);

  return {
    adminUsers: [
      {
        id: 'admin-1',
        name: 'Musfira Official Store Admin',
        email: 'musfirabeautycream@gmail.com',
        passwordHash: hashedPassword,
        role: 'super_admin',
        createdAt: new Date().toISOString(),
      },
    ],
    categories: [
      {
        id: 'cat-1',
        name: 'Beauty Creams',
        slug: 'beauty-creams',
        description: 'Special formulation glowing and brightening creams for natural radiance.',
        active: true,
      },
      {
        id: 'cat-2',
        name: 'Serums & Essences',
        slug: 'serums',
        description: 'Deep penetrating clinical anti-acne and glow brightening serums.',
        active: true,
      },
      {
        id: 'cat-3',
        name: 'Skin Polish & Facials',
        slug: 'skin-polish',
        description: 'Professional 20 volume ultra whitening skin polish kits and brighteners.',
        active: true,
      },
      {
        id: 'cat-4',
        name: 'Daily Care & Cleansers',
        slug: 'daily-care',
        description: 'Dermatologist tested whitening creamy face wash, lip balms, and toners.',
        active: true,
      },
    ],
    products: [
      {
        id: 'msf-001',
        name: 'Musfira Special Cream',
        slug: 'musfira-special-cream',
        tagline: 'One Sold Every Minute*',
        price: 1499,
        salePrice: 1999,
        sku: 'MSF-CRM-01',
        images: [],
        category: 'Beauty Creams',
        stock: 450,
        stockStatus: 'in_stock',
        isFeatured: true,
        isBestSeller: true,
        badges: ['Best Seller', '100% Original'],
        rating: 5.0,
        reviewCount: 5,
        description:
          'Musfira Special Skincare Beauty Cream is enriched with pure natural extracts and multi-vitamin complex that works deep within your skin layers to eliminate dark spots, freckles (chhaiyan), pigmentation, and uneven skin tone while giving a flawless natural radiant glow.',
        shortDescription: '100% Steroid-free skincare formula for radiant fairness and spotless skin in 7 days.',
        urduBenefits: [
          'صرف 7 دن میں نمایاں نتائج',
          'ہر قسم کی جلد کے لیے محفوظ، حتیٰ کہ حساس جلد کے لیے بھی',
          'مہاسوں کے نشانات، چھائیاں (Freckles)، رنگت کی بے ترتیبی (Pigmentation) اور سیاہ دھبوں کو کم کرنے میں مددگار',
          'کھلے مسام (Open Pores) کو کم کر کے جلد کو ہموار اور صاف دکھاتا ہے',
          '100% Steroid-Free فارمولا، بغیر مضر اثرات کے',
        ],
        urduUsage: [
          'اپنے چہرے کو اچھی طرح دھو لیں اور ہلکا سا نم رہنے دیں۔',
          'کریم کو نرمی کے ساتھ جلد پر لگائیں۔',
          'اگر آپ کو مہاسے ہیں تو پہلے 3 دن صرف متاثرہ جگہوں (مہاسوں) پر لگائیں۔',
          'جب مہاسے کم ہو جائیں، تو بہترین نتائج کے لیے کریم کو رات کے وقت پورے چہرے پر 7 دن لگائیں۔',
        ],
        bundles: [
          {
            id: 'b-1',
            name: '1 Pack',
            packCount: 1,
            price: 1499,
            isDefault: false,
          },
          {
            id: 'b-2',
            name: '2 Packs',
            packCount: 2,
            price: 2499,
            originalPrice: 2998,
            savingsText: 'Save Rs. 500',
            badge: 'Most Popular',
            isDefault: true,
          },
          {
            id: 'b-3',
            name: '3 Packs',
            packCount: 3,
            price: 3499,
            originalPrice: 4497,
            savingsText: 'Save Rs. 1000',
            badge: 'Most Popular',
            isDefault: false,
          },
        ],
        active: true,
        viewingCount: 129,
        createdAt: '2026-06-01T10:00:00.000Z',
        updatedAt: '2026-08-31T12:00:00.000Z',
      },
      {
        id: 'msf-002',
        name: 'Musfira Special Skin Polish',
        slug: 'musfira-special-skin-polish',
        tagline: 'Professional 24k Gold Radiance',
        price: 1999,
        salePrice: 3000,
        sku: 'MSF-POL-02',
        images: [],
        category: 'Skin Polish & Facials',
        stock: 0,
        stockStatus: 'sold_out',
        isFeatured: true,
        isBestSeller: false,
        badges: ['Sold out'],
        rating: 4.8,
        reviewCount: 0,
        description: 'Complete 2-step ultra whitening facial polish kit with Developer 20 Volume and 24K Gold Brighter Solution for salon finish skin glow at home.',
        shortDescription: 'Professional 2-in-1 skin whitening Polish + Brightener Duo.',
        active: true,
        createdAt: '2026-06-10T10:00:00.000Z',
        updatedAt: '2026-08-31T12:00:00.000Z',
      },
      {
        id: 'msf-003',
        name: 'Musfira Special Hair Blocker',
        slug: 'musfira-special-hair-blocker',
        tagline: 'Permanent reduction of unwanted facial hair',
        price: 1999,
        salePrice: 2800,
        sku: 'MSF-HRB-03',
        images: [],
        category: 'Body Care',
        stock: 0,
        stockStatus: 'sold_out',
        isFeatured: false,
        isBestSeller: false,
        badges: ['Sold out'],
        rating: 4.6,
        reviewCount: 0,
        description: 'Natural herbal formula specifically formulated to weaken hair roots and permanently reduce unwanted hair growth on face, chin, and body.',
        shortDescription: 'Permanent stoppage of unwanted facial & body hair.',
        active: true,
        createdAt: '2026-06-15T10:00:00.000Z',
        updatedAt: '2026-08-31T12:00:00.000Z',
      },
      {
        id: 'msf-004',
        name: 'Musfira Special Face Wash',
        slug: 'musfira-special-face-wash',
        tagline: 'Dermatologist Control Whitening Creamy Formula',
        price: 1499,
        salePrice: 2200,
        sku: 'MSF-FCW-04',
        images: [],
        category: 'Daily Care & Cleansers',
        stock: 0,
        stockStatus: 'sold_out',
        isFeatured: false,
        isBestSeller: false,
        badges: ['Sold out'],
        rating: 4.9,
        reviewCount: 0,
        description: 'Formulated under strict dermatologist control, this creamy whitening face wash deeply purifies pores and removes dirt while locking in essential hydration.',
        shortDescription: 'Gentle creamy deep pore brightening face wash.',
        active: true,
        createdAt: '2026-06-20T10:00:00.000Z',
        updatedAt: '2026-08-31T12:00:00.000Z',
      },
      {
        id: 'msf-005',
        name: 'Musfira Special Skin Brightening Serum',
        slug: 'musfira-special-skin-brightening-serum',
        tagline: 'High Potency Niacinamide & Alpha Arbutin',
        price: 1999,
        salePrice: 3000,
        sku: 'MSF-SRM-05',
        images: [],
        category: 'Serums & Essences',
        stock: 80,
        stockStatus: 'in_stock',
        isFeatured: true,
        isBestSeller: false,
        rating: 4.9,
        reviewCount: 0,
        description: 'Concentrated serum that fights melanin synthesis, illuminates dark spots and restores glass skin barrier resilience.',
        shortDescription: 'Intense brightening and spot correction elixir.',
        active: true,
        createdAt: '2026-06-22T10:00:00.000Z',
        updatedAt: '2026-08-31T12:00:00.000Z',
      },
      {
        id: 'msf-006',
        name: 'Musfira Special Rose Water',
        slug: 'musfira-special-rose-water',
        tagline: '100% Pure Steam Distilled Damask Rose Mist',
        price: 850,
        salePrice: 1200,
        sku: 'MSF-RSW-06',
        images: [],
        category: 'Daily Care & Cleansers',
        stock: 120,
        stockStatus: 'in_stock',
        isFeatured: false,
        isBestSeller: false,
        rating: 4.7,
        reviewCount: 0,
        description: 'Pure therapeutic grade distilled rose water toner for instant skin refreshing, pH balancing and soothing inflammation.',
        shortDescription: 'Pure organic steam-distilled rose water toner.',
        active: true,
        createdAt: '2026-06-25T10:00:00.000Z',
        updatedAt: '2026-08-31T12:00:00.000Z',
      },
      {
        id: 'msf-007',
        name: 'Musfira Special Lip Balm',
        slug: 'musfira-special-lip-balm',
        tagline: 'For instantly soft lips with a tint of pink',
        price: 1500,
        salePrice: 2000,
        sku: 'MSF-LPB-07',
        images: [],
        category: 'Daily Care & Cleansers',
        stock: 0,
        stockStatus: 'sold_out',
        isFeatured: false,
        isBestSeller: false,
        badges: ['Sold out'],
        rating: 4.8,
        reviewCount: 0,
        description: 'Moisturizing formula enriched with shea butter, vitamin E and rosy botanical pigments that lighten darkened lips and prevent chapping.',
        shortDescription: 'For instantly soft lips with a tint of pink.',
        active: true,
        createdAt: '2026-06-26T10:00:00.000Z',
        updatedAt: '2026-08-31T12:00:00.000Z',
      },
      {
        id: 'msf-008',
        name: 'Musfira Special Acne Serum',
        slug: 'musfira-special-acne-serum',
        tagline: 'Fast Action Anti-Acne & Blemish Clarifying Formula',
        price: 2000,
        salePrice: 3000,
        sku: 'MSF-ACN-08',
        images: [],
        category: 'Serums & Essences',
        stock: 0,
        stockStatus: 'sold_out',
        isFeatured: false,
        isBestSeller: false,
        badges: ['Sold out'],
        rating: 4.9,
        reviewCount: 0,
        description: 'Contains Salicylic Acid and Tea Tree Extract to clear persistent breakouts, reduce redness, and prevent scarring.',
        shortDescription: 'Clinical strength targeted anti-acne relief serum.',
        active: true,
        createdAt: '2026-06-28T10:00:00.000Z',
        updatedAt: '2026-08-31T12:00:00.000Z',
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        productId: 'msf-001',
        productName: 'Musfira Special Cream',
        reviewerName: 'laiba',
        initials: 'L',
        rating: 5,
        date: '06/23/2026',
        comment: 'bht achi cream meri skin kafi glow kr rhi ab',
        beforeAfterImage: '/src/assets/images/musfira_before_after_1788205226012.jpg',
        verified: true,
      },
      {
        id: 'rev-2',
        productId: 'msf-001',
        productName: 'Musfira Special Cream',
        reviewerName: 'Ahmed Raja',
        initials: 'AR',
        rating: 5,
        date: '06/21/2026',
        comment: 'It works! excellent!',
        verified: true,
      },
      {
        id: 'rev-3',
        productId: 'msf-001',
        productName: 'Musfira Special Cream',
        reviewerName: 'Ali Arbaz',
        initials: 'AA',
        rating: 5,
        date: '06/21/2026',
        comment: 'Bht achi cream ha.',
        verified: true,
      },
      {
        id: 'rev-4',
        productId: 'msf-001',
        productName: 'Musfira Special Cream',
        reviewerName: 'Zainab bibi',
        initials: 'ZB',
        rating: 5,
        date: '06/23/2026',
        comment: 'Boht farq parha Allah Kush rakhay app ko 🥺',
        beforeAfterImage: '/src/assets/images/musfira_before_after_1788205226012.jpg',
        verified: true,
      },
      {
        id: 'rev-5',
        productId: 'msf-001',
        productName: 'Musfira Special Cream',
        reviewerName: 'Alishba',
        initials: 'A',
        rating: 5,
        date: '06/20/2026',
        comment: 'Redness and pimple marks almost gone in 5 days! Very satisfied with original packaging.',
        beforeAfterImage: '/src/assets/images/musfira_before_after_1788205226012.jpg',
        verified: true,
      },
    ],
    orders: [
      {
        id: 'MSF-92841',
        customerName: 'Fatima Zahra',
        phone: '03214567890',
        email: 'fatima.zahra@gmail.com',
        address: 'House # 42, Street 7, Block F, DHA Phase 5',
        nearbyPlace: 'Near Jalal Sons',
        city: 'Lahore',
        postalCode: '54000',
        notes: 'Please call before delivery',
        items: [
          {
            productId: 'msf-001',
            name: 'Musfira Special Cream (2 Packs)',
            price: 2499,
            quantity: 1,
            image: '/src/assets/images/musfira_cream_hero_1788205132383.jpg',
            bundleName: '2 Packs',
          },
        ],
        subtotal: 2499,
        shippingFee: 0,
        total: 2499,
        orderStatus: 'confirmed',
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        createdAt: '2026-08-30T15:20:00.000Z',
        updatedAt: '2026-08-30T16:00:00.000Z',
      },
      {
        id: 'MSF-88219',
        customerName: 'Muhammad Usman',
        phone: '03009876543',
        email: 'usman.m@yahoo.com',
        address: 'Flat 302, Al-Noor Heights, Gulshan-e-Iqbal Block 13D',
        nearbyPlace: 'Opposite Disco Bakery',
        city: 'Karachi',
        postalCode: '75300',
        items: [
          {
            productId: 'msf-001',
            name: 'Musfira Special Cream (1 Pack)',
            price: 1499,
            quantity: 1,
            image: '/src/assets/images/musfira_cream_hero_1788205132383.jpg',
            bundleName: '1 Pack',
          },
        ],
        subtotal: 1499,
        shippingFee: 0,
        total: 1499,
        orderStatus: 'delivered',
        paymentMethod: 'COD',
        paymentStatus: 'paid',
        createdAt: '2026-08-28T11:10:00.000Z',
        updatedAt: '2026-08-31T09:30:00.000Z',
      },
    ],
    settings: {
      brandName: 'MUSFIRA',
      brandTagline: 'Special Skincare Beauty Cream',
      logoUrl: '/musfira_logo.jpg',
      faviconUrl: '/musfira_logo.jpg',
      landingImages: [],
      bismillahText: 'بِسْمِ اللَّهِ',
      tickerText: 'Free shipping all over Pakistan',
      phone: '+92 300 1234567',
      email: 'musfirabeautycream@gmail.com',
      whatsappNumber: '923001234567',
      whatsappDefaultMessage: 'Assalam o Alaikum! I would like to order Musfira Beauty Cream.',
      address: 'Musfira Skincare Plaza, Main Boulevard, Gulberg III, Lahore, Pakistan',
      freeShippingText: 'Free shipping all over Pakistan',
      orderNoticeTitle: 'آرڈر دیتے وقت دھیان دیں',
      orderNoticePoints: [
        'اپنا مکمل پتہ لکھیں (گھر نمبر، گلی نمبر، علاقے کا نام، شہر کا نام)',
        'اپنا صحیح موبائل نمبر لازمی درج کریں تاکہ رائیڈر آپ سے رابطہ کر سکے',
        'ہم آپ کا آرڈر کال یا واٹس ایپ سے کنفرم کریں گے — براہ مہربانی کال ریسیو کریں',
      ],
      orderNoticeWarnings: [
        'غلط ایڈریس یا کال ریسیو نہ کرنے کی صورت میں ڈیلیوری میں تاخیر ہو سکتی ہے',
        'صرف سنجیدہ افراد آرڈر کریں تاکہ ہمارا اور آپ کا وقت ضائع نہ ہو',
      ],
      facebookUrl: 'https://facebook.com/musfirabeauty',
      instagramUrl: 'https://instagram.com/musfirabeauty',
      tiktokUrl: 'https://tiktok.com/@musfirabeauty',
      youtubeUrl: 'https://youtube.com/@musfirabeauty',
      footerText: '© 2026, Musfira Special · Privacy policy · Refund policy · Terms of service · Contact information · Shipping policy',
    },
  };
}

export class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed: DatabaseSchema = JSON.parse(raw);
        // Strip legacy example image paths if present
        if (parsed.settings?.landingImages) {
          parsed.settings.landingImages = parsed.settings.landingImages.filter(
            (img) => !img.includes('/src/assets/images/')
          );
        }
        if (parsed.products) {
          parsed.products = parsed.products.map((p) => ({
            ...p,
            images: (p.images || []).filter((img) => !img.includes('/src/assets/images/')),
          }));
        }
        return parsed;
      }
    } catch (err) {
      console.error('Error reading database file, resetting to initial data:', err);
    }
    const initial = getInitialData();
    this.save(initial);
    return initial;
  }

  private save(data?: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database file:', err);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  // Products
  public getProducts(): DBProduct[] {
    return this.data.products;
  }

  public getProductById(id: string): DBProduct | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  public getProductBySlug(slug: string): DBProduct | undefined {
    return this.data.products.find((p) => p.slug === slug || p.id === slug);
  }

  public createProduct(productData: Omit<DBProduct, 'id' | 'createdAt' | 'updatedAt'>): DBProduct {
    const newProduct: DBProduct = {
      ...productData,
      id: `msf-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<DBProduct>): DBProduct | null {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.products[index];
  }

  public deleteProduct(id: string): boolean {
    const initialLength = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  // Categories
  public getCategories(): DBCategory[] {
    return this.data.categories;
  }

  public createCategory(cat: Omit<DBCategory, 'id'>): DBCategory {
    const newCat: DBCategory = {
      ...cat,
      id: `cat-${Date.now().toString().slice(-5)}`,
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<DBCategory>): DBCategory | null {
    const index = this.data.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.data.categories[index] = { ...this.data.categories[index], ...updates };
    this.save();
    return this.data.categories[index];
  }

  public deleteCategory(id: string): boolean {
    const initialLength = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    if (this.data.categories.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  // Orders
  public getOrders(): DBOrder[] {
    return this.data.orders;
  }

  public getOrderById(id: string): DBOrder | undefined {
    return this.data.orders.find((o) => o.id === id);
  }

  public createOrder(orderData: Omit<DBOrder, 'id' | 'createdAt' | 'updatedAt' | 'orderStatus' | 'paymentStatus'>): DBOrder {
    const randDigits = Math.floor(10000 + Math.random() * 90000);
    const newOrder: DBOrder = {
      ...orderData,
      id: `MSF-${randDigits}`,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Decrement stock where applicable
    for (const item of newOrder.items) {
      const prod = this.data.products.find((p) => p.id === item.productId || p.name === item.name);
      if (prod && prod.stock > 0) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        if (prod.stock === 0) {
          prod.stockStatus = 'sold_out';
        }
      }
    }

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: DBOrder['orderStatus'], paymentStatus?: DBOrder['paymentStatus']): DBOrder | null {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return null;
    order.orderStatus = status;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  // Reviews
  public getReviews(productId?: string): DBReview[] {
    if (productId) {
      return this.data.reviews.filter((r) => r.productId === productId);
    }
    return this.data.reviews;
  }

  public getReviewById(id: string): DBReview | undefined {
    return this.data.reviews.find((r) => r.id === id);
  }

  public createReview(reviewData: Partial<DBReview> & { productId: string; reviewerName: string; rating: number; comment: string }): DBReview {
    const d = new Date();
    const formattedDate = reviewData.date || `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
    const initials = reviewData.initials || reviewData.reviewerName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'M';
    
    // Determine product name if not provided
    let prodName = reviewData.productName;
    if (!prodName) {
      const prod = this.getProductById(reviewData.productId);
      if (prod) prodName = prod.name;
    }

    const newReview: DBReview = {
      id: `rev-${Date.now()}`,
      productId: reviewData.productId,
      productName: prodName || 'Musfira Special Cream',
      reviewerName: reviewData.reviewerName,
      initials,
      rating: Number(reviewData.rating) || 5,
      date: formattedDate,
      comment: reviewData.comment,
      beforeAfterImage: reviewData.beforeAfterImage || undefined,
      verified: reviewData.verified !== undefined ? reviewData.verified : true,
    };

    this.data.reviews.unshift(newReview);
    this.save();
    return newReview;
  }

  public updateReview(id: string, updates: Partial<DBReview>): DBReview | null {
    const review = this.getReviewById(id);
    if (!review) return null;

    if (updates.reviewerName !== undefined) {
      review.reviewerName = updates.reviewerName;
      if (!updates.initials) {
        review.initials = updates.reviewerName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'M';
      }
    }
    if (updates.initials !== undefined) review.initials = updates.initials;
    if (updates.rating !== undefined) review.rating = Number(updates.rating);
    if (updates.comment !== undefined) review.comment = updates.comment;
    if (updates.date !== undefined) review.date = updates.date;
    if (updates.beforeAfterImage !== undefined) review.beforeAfterImage = updates.beforeAfterImage || undefined;
    if (updates.verified !== undefined) review.verified = Boolean(updates.verified);
    if (updates.productId !== undefined) {
      review.productId = updates.productId;
      const prod = this.getProductById(updates.productId);
      if (prod) review.productName = prod.name;
    }
    if (updates.productName !== undefined) review.productName = updates.productName;

    this.save();
    return review;
  }

  public deleteReview(id: string): boolean {
    const initialLength = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter((r) => r.id !== id);
    if (this.data.reviews.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  // Settings
  public getSettings(): DBSiteSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<DBSiteSettings>): DBSiteSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  // Admin User
  public getAdminByEmail(email: string): DBAdminUser | undefined {
    return this.data.adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public updateAdminPassword(email: string, newPasswordHash: string): boolean {
    const admin = this.getAdminByEmail(email);
    if (!admin) return false;
    admin.passwordHash = newPasswordHash;
    this.save();
    return true;
  }

  // Stats
  public getStats() {
    const totalProducts = this.data.products.length;
    const activeProducts = this.data.products.filter((p) => p.active).length;
    const outOfStockProducts = this.data.products.filter((p) => p.stockStatus === 'sold_out' || p.stock <= 0).length;
    const totalOrders = this.data.orders.length;
    const pendingOrders = this.data.orders.filter((o) => o.orderStatus === 'pending').length;
    const completedOrders = this.data.orders.filter((o) => o.orderStatus === 'delivered').length;
    const totalRevenue = this.data.orders
      .filter((o) => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      recentOrders: this.data.orders.slice(0, 8),
      recentProducts: this.data.products.slice(0, 6),
    };
  }
}

export const db = new Database();
