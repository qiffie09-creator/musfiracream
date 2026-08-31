import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { db, auth, storage } from './firebase';
import { Product, Category, Order, Review, SiteSettings, AdminStats, AdminUser } from '../types';

// Collection references
const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const REVIEWS_COLLECTION = 'reviews';
const ORDERS_COLLECTION = 'orders';
const SETTINGS_COLLECTION = 'settings';
const ADMIN_USERS_COLLECTION = 'adminUsers';
const SETTINGS_DOC_ID = 'site_settings';

export const firebaseApi = {
  // ============================
  // STOREFRONT / PUBLIC
  // ============================
  async getProducts(params?: { category?: string; search?: string; featured?: boolean; sort?: string }): Promise<Product[]> {
    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      const snapshot = await getDocs(colRef);
      let products: Product[] = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Product));

      // Filter active only
      products = products.filter((p) => p.active !== false);

      if (params?.category && params.category !== 'all') {
        const catLower = params.category.toLowerCase();
        products = products.filter((p) => p.category.toLowerCase() === catLower || p.category.toLowerCase().includes(catLower));
      }

      if (params?.search) {
        const q = params.search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.tagline && p.tagline.toLowerCase().includes(q))
        );
      }

      if (params?.featured) {
        products = products.filter((p) => p.isFeatured || p.isBestSeller);
      }

      if (params?.sort === 'price-low') {
        products.sort((a, b) => a.price - b.price);
      } else if (params?.sort === 'price-high') {
        products.sort((a, b) => b.price - a.price);
      } else if (params?.sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      }

      return products;
    } catch (err) {
      console.warn('Firebase getProducts fallback:', err);
      throw err;
    }
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const found = snapshot.docs.find((d) => {
      const data = d.data();
      return d.id === slug || data.slug === slug;
    });
    if (!found) throw new Error('Product not found');
    return { ...found.data(), id: found.id } as Product;
  },

  async getCategories(): Promise<Category[]> {
    const colRef = collection(db, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(colRef);
    return snapshot.docs
      .map((d) => ({ ...d.data(), id: d.id } as Category))
      .filter((c) => c.active !== false);
  },

  async getReviews(productId?: string): Promise<Review[]> {
    const colRef = collection(db, REVIEWS_COLLECTION);
    const snapshot = await getDocs(colRef);
    let reviews = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Review));
    if (productId) {
      reviews = reviews.filter((r) => r.productId === productId);
    }
    return reviews;
  },

  async submitReview(data: Partial<Review>): Promise<Review> {
    const id = `rev-${Date.now()}`;
    const d = new Date();
    const formattedDate = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
    const initials =
      data.initials ||
      (data.reviewerName || '')
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'M';

    const newReview: Review = {
      id,
      productId: data.productId || 'msf-001',
      productName: data.productName || 'Musfira Special Cream',
      reviewerName: data.reviewerName || 'Anonymous Customer',
      initials,
      rating: Number(data.rating) || 5,
      date: formattedDate,
      comment: data.comment || '',
      beforeAfterImage: data.beforeAfterImage || undefined,
      verified: true,
    };

    const docRef = doc(db, REVIEWS_COLLECTION, id);
    await setDoc(docRef, newReview);
    return newReview;
  },

  async getSettings(): Promise<SiteSettings> {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as SiteSettings;
    }
    throw new Error('Settings document not found');
  },

  async createOrder(orderData: any): Promise<{ success: boolean; order: Order; message: string }> {
    const id = `MSF-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id,
      customerName: orderData.customerName,
      phone: orderData.phone,
      email: orderData.email || '',
      address: orderData.address,
      nearbyPlace: orderData.nearbyPlace || '',
      city: orderData.city,
      postalCode: orderData.postalCode || '',
      notes: orderData.notes || '',
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal) || 0,
      shippingFee: Number(orderData.shippingFee) || 0,
      total: Number(orderData.total) || 0,
      orderStatus: 'pending',
      paymentMethod: orderData.paymentMethod || 'COD',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = doc(db, ORDERS_COLLECTION, id);
    await setDoc(docRef, newOrder);
    return {
      success: true,
      order: newOrder,
      message: 'Order placed successfully in Firebase!',
    };
  },

  async getOrder(id: string): Promise<Order> {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { ...snapshot.data(), id: snapshot.id } as Order;
    }
    throw new Error('Order not found');
  },

  // ============================
  // ADMIN FIRESTORE & STORAGE
  // ============================
  async adminGetStats(): Promise<AdminStats> {
    const [productsSnap, ordersSnap] = await Promise.all([
      getDocs(collection(db, PRODUCTS_COLLECTION)),
      getDocs(collection(db, ORDERS_COLLECTION)),
    ]);

    const products = productsSnap.docs.map((d) => ({ ...d.data(), id: d.id } as Product));
    const orders = ordersSnap.docs.map((d) => ({ ...d.data(), id: d.id } as Order));

    // Sort orders descending
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.active !== false).length;
    const outOfStockProducts = products.filter((p) => p.stockStatus === 'sold_out' || (p.stock || 0) <= 0).length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length;
    const completedOrders = orders.filter((o) => o.orderStatus === 'delivered').length;
    const totalRevenue = orders
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
      recentOrders: orders.slice(0, 8),
      recentProducts: products.slice(0, 6),
    };
  },

  async adminGetProducts(): Promise<Product[]> {
    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Product));
  },

  async adminCreateProduct(data: Partial<Product>): Promise<Product> {
    const id = `msf-${Date.now().toString().slice(-6)}`;
    const newProduct: Product = {
      id,
      name: data.name || 'New Skincare Product',
      slug: data.slug || `product-${Date.now()}`,
      tagline: data.tagline || '',
      price: Number(data.price) || 1499,
      salePrice: data.salePrice ? Number(data.salePrice) : undefined,
      sku: data.sku || `MSF-${Date.now().toString().slice(-4)}`,
      images: data.images && data.images.length > 0 ? data.images : ['/musfira_logo.jpg'],
      category: data.category || 'Beauty Creams',
      stock: Number(data.stock) || 100,
      stockStatus: data.stockStatus || 'in_stock',
      isFeatured: Boolean(data.isFeatured),
      isBestSeller: Boolean(data.isBestSeller),
      badges: data.badges || [],
      rating: Number(data.rating) || 5.0,
      reviewCount: Number(data.reviewCount) || 0,
      description: data.description || '',
      shortDescription: data.shortDescription || '',
      urduBenefits: data.urduBenefits || [],
      urduUsage: data.urduUsage || [],
      bundles: data.bundles || [],
      active: data.active !== undefined ? data.active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, PRODUCTS_COLLECTION, id), newProduct);
    return newProduct;
  },

  async adminUpdateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const updates = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, updates);
    const snap = await getDoc(docRef);
    return { ...snap.data(), id: snap.id } as Product;
  },

  async adminDeleteProduct(id: string): Promise<boolean> {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
    return true;
  },

  async adminGetCategories(): Promise<Category[]> {
    const snap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Category));
  },

  async adminCreateCategory(data: Partial<Category>): Promise<Category> {
    const id = `cat-${Date.now().toString().slice(-5)}`;
    const newCat: Category = {
      id,
      name: data.name || 'New Category',
      slug: data.slug || `cat-${Date.now()}`,
      image: data.image,
      description: data.description,
      active: data.active !== undefined ? data.active : true,
    };
    await setDoc(doc(db, CATEGORIES_COLLECTION, id), newCat);
    return newCat;
  },

  async adminUpdateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, data);
    const snap = await getDoc(docRef);
    return { ...snap.data(), id: snap.id } as Category;
  },

  async adminDeleteCategory(id: string): Promise<boolean> {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
    return true;
  },

  async adminGetOrders(): Promise<Order[]> {
    const snap = await getDocs(collection(db, ORDERS_COLLECTION));
    const orders = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Order));
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return orders;
  },

  async adminUpdateOrderStatus(id: string, orderStatus: string, paymentStatus?: string): Promise<Order> {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    const updates: any = {
      orderStatus,
      updatedAt: new Date().toISOString(),
    };
    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
    }
    await updateDoc(docRef, updates);
    const snap = await getDoc(docRef);
    return { ...snap.data(), id: snap.id } as Order;
  },

  async adminCreateReview(data: Partial<Review> & { reviewerName: string; rating: number; comment: string }): Promise<Review> {
    const id = `rev-${Date.now()}`;
    const d = new Date();
    const formattedDate =
      data.date ||
      `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
    const initials =
      data.initials ||
      data.reviewerName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'M';

    const newRev: Review = {
      id,
      productId: data.productId || 'msf-001',
      productName: data.productName || 'Musfira Special Cream',
      reviewerName: data.reviewerName,
      initials,
      rating: Number(data.rating) || 5,
      date: formattedDate,
      comment: data.comment,
      beforeAfterImage: data.beforeAfterImage || undefined,
      verified: data.verified !== undefined ? Boolean(data.verified) : true,
    };

    await setDoc(doc(db, REVIEWS_COLLECTION, id), newRev);
    return newRev;
  },

  async adminUpdateReview(id: string, data: Partial<Review>): Promise<Review> {
    const docRef = doc(db, REVIEWS_COLLECTION, id);
    await updateDoc(docRef, data);
    const snap = await getDoc(docRef);
    return { ...snap.data(), id: snap.id } as Review;
  },

  async adminDeleteReview(id: string): Promise<boolean> {
    await deleteDoc(doc(db, REVIEWS_COLLECTION, id));
    return true;
  },

  async adminUpdateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
    const snap = await getDoc(docRef);
    return snap.data() as SiteSettings;
  },

  // Firebase Storage direct file upload
  async uploadFileToStorage(file: File, folder = 'uploads'): Promise<string> {
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storageRef = ref(storage, `${folder}/${Date.now()}_${cleanName}`);
      const snap = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snap.ref);
      return downloadUrl;
    } catch (err) {
      console.warn('Firebase Storage upload direct error, using API proxy:', err);
      throw err;
    }
  },
};
