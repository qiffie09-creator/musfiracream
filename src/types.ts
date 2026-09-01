export interface ProductBundle {
  id: string;
  name: string;
  packCount: number;
  packsCount?: number;
  price: number;
  originalPrice?: number;
  savingsText?: string;
  badge?: string;
  isDefault?: boolean;
}

export interface Product {
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
  showOnHomeScreen?: boolean;
  isHeroProduct?: boolean;
  badges?: string[];
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  urduBenefits?: string[];
  urduUsage?: string[];
  bundles?: ProductBundle[];
  active: boolean;
  viewingCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  active: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedBundle?: ProductBundle;
  unitPrice: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  bundleName?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  nearbyPlace?: string;
  city: string;
  postalCode?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'COD' | 'Online';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
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

export interface SiteSettings {
  brandName: string;
  brandTagline: string;
  logoUrl: string;
  faviconUrl?: string;
  heroProductId?: string;
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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminStats {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  recentProducts: Product[];
}
