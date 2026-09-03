export type StockStatus = 'in_stock' | 'out_of_stock' | 'preorder';

export interface ProductBundle {
  id: string;
  name: string;
  urduName?: string;
  quantity: number;
  price: number;
  originalPrice: number;
  discountPercentage?: number;
  badge?: string;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  author: string;
  initials?: string;
  city?: string;
  rating: number;
  date: string;
  verified: boolean;
  comment?: string;
  urduComment?: string;
  avatarUrl?: string;
  beforeAfterImage?: string;
}

export interface Product {
  id: string;
  name: string;
  urduName: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  stockStatus: StockStatus;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  urduDescription: string;
  shortDescription: string;
  isFeatured?: boolean;
  benefits: string[];
  urduBenefits?: string[];
  howToUse: string[];
  urduHowToUse?: string[];
  ingredients?: string[];
  bundles?: ProductBundle[];
}

export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  bundleName?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  nearbyFamousPlace?: string;
  city: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  courierName?: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod: 'cod' | 'bank_transfer' | 'easypaisa' | 'jazzcash';
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  announcementText: string;
  announcementUrdu: string;
  landingImages: string[];
  heroHeadline: string;
  heroHeadlineUrdu: string;
  heroSubheadline: string;
  heroSubheadlineUrdu: string;
  guaranteeDays: number;
  codAvailable: boolean;
  showUrdu: boolean;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  category: 'products' | 'banners' | 'testimonials' | 'general';
  uploadedAt: string;
}
