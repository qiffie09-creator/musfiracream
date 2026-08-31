import { Product, Category, Order, Review, SiteSettings, AdminStats, AdminUser } from '../types';
import { firebaseApi } from './firebaseApi';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('musfira_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Safe response parser that avoids "Unexpected end of JSON input" errors
async function parseJsonSafely<T>(res: Response, defaultError = 'Request failed'): Promise<T> {
  let text = '';
  try {
    text = await res.text();
  } catch {
    if (!res.ok) throw new Error(`${defaultError} (HTTP ${res.status})`);
    return {} as T;
  }

  if (!text || text.trim() === '') {
    if (!res.ok) throw new Error(`${defaultError} (HTTP ${res.status})`);
    return {} as T;
  }

  try {
    const data = JSON.parse(text);
    if (!res.ok) {
      throw new Error(data?.error || data?.message || `${defaultError} (HTTP ${res.status})`);
    }
    return data as T;
  } catch (err: any) {
    if (!res.ok) {
      throw new Error(err.message?.includes('HTTP') ? err.message : `${defaultError}: HTTP ${res.status}`);
    }
    return text as unknown as T;
  }
}

// Seamless Dual Firebase + Backend Bridge
// Attempts direct Firebase Firestore/Storage first; falls back gracefully to Express REST API
export const api = {
  // Storefront Public APIs
  async getProducts(params?: { category?: string; search?: string; featured?: boolean; sort?: string }): Promise<Product[]> {
    try {
      return await firebaseApi.getProducts(params);
    } catch (firebaseErr) {
      console.warn('Firebase Firestore products fetch fallback to Express REST:', firebaseErr);
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.featured) query.set('featured', 'true');
      if (params?.sort) query.set('sort', params.sort);

      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      return await parseJsonSafely<Product[]>(res, 'Failed to fetch products');
    }
  },

  async getProductBySlug(slug: string): Promise<Product> {
    try {
      return await firebaseApi.getProductBySlug(slug);
    } catch {
      const res = await fetch(`${API_BASE}/products/${encodeURIComponent(slug)}`);
      return await parseJsonSafely<Product>(res, 'Product not found');
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      return await firebaseApi.getCategories();
    } catch {
      const res = await fetch(`${API_BASE}/categories`);
      return await parseJsonSafely<Category[]>(res, 'Failed to fetch categories');
    }
  },

  async getReviews(productId?: string): Promise<Review[]> {
    try {
      return await firebaseApi.getReviews(productId);
    } catch {
      const query = productId ? `?productId=${encodeURIComponent(productId)}` : '';
      const res = await fetch(`${API_BASE}/reviews${query}`);
      return await parseJsonSafely<Review[]>(res, 'Failed to fetch reviews');
    }
  },

  async submitReview(data: Partial<Review>): Promise<Review> {
    try {
      const saved = await firebaseApi.submitReview(data);
      // Also notify backend in background
      fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => {});
      return saved;
    } catch {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await parseJsonSafely<Review>(res, 'Failed to submit review');
    }
  },

  async getSettings(): Promise<SiteSettings> {
    try {
      return await firebaseApi.getSettings();
    } catch {
      const res = await fetch(`${API_BASE}/settings`);
      return await parseJsonSafely<SiteSettings>(res, 'Failed to fetch site settings');
    }
  },

  async createOrder(orderData: any): Promise<{ success: boolean; order: Order; message: string }> {
    try {
      const firebaseOrder = await firebaseApi.createOrder(orderData);
      // Synchronize with backend in background
      fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      }).catch(() => {});
      return firebaseOrder;
    } catch {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      return await parseJsonSafely<{ success: boolean; order: Order; message: string }>(res, 'Failed to place order');
    }
  },

  async getOrder(id: string): Promise<Order> {
    try {
      return await firebaseApi.getOrder(id);
    } catch {
      const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`);
      return await parseJsonSafely<Order>(res, 'Order not found');
    }
  },

  // Admin APIs
  async adminLogin(email: string, password: string): Promise<{ success: boolean; token: string; admin: AdminUser }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await parseJsonSafely<{ success: boolean; token: string; admin: AdminUser }>(res, 'Invalid admin credentials');
  },

  async adminGetMe(): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/admin/me`, {
      headers: { ...getAuthHeader() },
    });
    return await parseJsonSafely<AdminUser>(res, 'Session invalid');
  },

  async adminGetStats(): Promise<AdminStats> {
    try {
      return await firebaseApi.adminGetStats();
    } catch {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: { ...getAuthHeader() },
      });
      return await parseJsonSafely<AdminStats>(res, 'Failed to fetch admin stats');
    }
  },

  async adminGetProducts(): Promise<Product[]> {
    try {
      return await firebaseApi.adminGetProducts();
    } catch {
      const res = await fetch(`${API_BASE}/admin/products`, {
        headers: { ...getAuthHeader() },
      });
      return await parseJsonSafely<Product[]>(res, 'Failed to fetch admin products');
    }
  },

  async adminCreateProduct(data: Partial<Product>): Promise<Product> {
    try {
      const prod = await firebaseApi.adminCreateProduct(data);
      fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      }).catch(() => {});
      return prod;
    } catch {
      const res = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      return await parseJsonSafely<Product>(res, 'Failed to create product');
    }
  },

  async adminUpdateProduct(id: string, data: Partial<Product>): Promise<Product> {
    try {
      const prod = await firebaseApi.adminUpdateProduct(id, data);
      fetch(`${API_BASE}/admin/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      }).catch(() => {});
      return prod;
    } catch {
      const res = await fetch(`${API_BASE}/admin/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      return await parseJsonSafely<Product>(res, 'Failed to update product');
    }
  },

  async adminDeleteProduct(id: string): Promise<boolean> {
    try {
      await firebaseApi.adminDeleteProduct(id);
      fetch(`${API_BASE}/admin/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() },
      }).catch(() => {});
      return true;
    } catch {
      const res = await fetch(`${API_BASE}/admin/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() },
      });
      await parseJsonSafely(res, 'Failed to delete product');
      return true;
    }
  },

  async adminGetCategories(): Promise<Category[]> {
    try {
      return await firebaseApi.adminGetCategories();
    } catch {
      const res = await fetch(`${API_BASE}/admin/categories`, {
        headers: { ...getAuthHeader() },
      });
      return await parseJsonSafely<Category[]>(res, 'Failed to fetch categories');
    }
  },

  async adminCreateCategory(data: Partial<Category>): Promise<Category> {
    try {
      const cat = await firebaseApi.adminCreateCategory(data);
      fetch(`${API_BASE}/admin/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      }).catch(() => {});
      return cat;
    } catch {
      const res = await fetch(`${API_BASE}/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      return await parseJsonSafely<Category>(res, 'Failed to create category');
    }
  },

  async adminUpdateCategory(id: string, data: Partial<Category>): Promise<Category> {
    try {
      const cat = await firebaseApi.adminUpdateCategory(id, data);
      fetch(`${API_BASE}/admin/categories/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      }).catch(() => {});
      return cat;
    } catch {
      const res = await fetch(`${API_BASE}/admin/categories/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      return await parseJsonSafely<Category>(res, 'Failed to update category');
    }
  },

  async adminDeleteCategory(id: string): Promise<boolean> {
    try {
      await firebaseApi.adminDeleteCategory(id);
      fetch(`${API_BASE}/admin/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() },
      }).catch(() => {});
      return true;
    } catch {
      const res = await fetch(`${API_BASE}/admin/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() },
      });
      await parseJsonSafely(res, 'Failed to delete category');
      return true;
    }
  },

  async adminGetOrders(): Promise<Order[]> {
    try {
      return await firebaseApi.adminGetOrders();
    } catch {
      const res = await fetch(`${API_BASE}/admin/orders`, {
        headers: { ...getAuthHeader() },
      });
      return await parseJsonSafely<Order[]>(res, 'Failed to fetch orders');
    }
  },

  async adminUpdateOrderStatus(id: string, orderStatus: string, paymentStatus?: string): Promise<Order> {
    try {
      const ord = await firebaseApi.adminUpdateOrderStatus(id, orderStatus, paymentStatus);
      fetch(`${API_BASE}/admin/orders/${encodeURIComponent(id)}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      }).catch(() => {});
      return ord;
    } catch {
      const res = await fetch(`${API_BASE}/admin/orders/${encodeURIComponent(id)}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      return await parseJsonSafely<Order>(res, 'Failed to update order status');
    }
  },

  async adminCreateReview(data: Partial<Review> & { reviewerName: string; rating: number; comment: string }): Promise<Review> {
    try {
      const rev = await firebaseApi.adminCreateReview(data);
      fetch(`${API_BASE}/admin/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      }).catch(() => {});
      return rev;
    } catch {
      const res = await fetch(`${API_BASE}/admin/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      return await parseJsonSafely<Review>(res, 'Failed to create review');
    }
  },

  async adminUpdateReview(id: string, data: Partial<Review>): Promise<Review> {
    try {
      const rev = await firebaseApi.adminUpdateReview(id, data);
      fetch(`${API_BASE}/admin/reviews/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      }).catch(() => {});
      return rev;
    } catch {
      const res = await fetch(`${API_BASE}/admin/reviews/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      return await parseJsonSafely<Review>(res, 'Failed to update review');
    }
  },

  async adminDeleteReview(id: string): Promise<boolean> {
    try {
      await firebaseApi.adminDeleteReview(id);
      fetch(`${API_BASE}/admin/reviews/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() },
      }).catch(() => {});
      return true;
    } catch {
      const res = await fetch(`${API_BASE}/admin/reviews/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() },
      });
      await parseJsonSafely(res, 'Failed to delete review');
      return true;
    }
  },

  async adminUpdateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    try {
      const updated = await firebaseApi.adminUpdateSettings(settings);
      fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(settings),
      }).catch(() => {});
      return updated;
    } catch {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(settings),
      });
      return await parseJsonSafely<SiteSettings>(res, 'Failed to update settings');
    }
  },

  async adminChangePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    await parseJsonSafely(res, 'Failed to update password');
  },

  async adminUploadImage(file: File): Promise<{ url: string; filename: string }> {
    try {
      const storageUrl = await firebaseApi.uploadFileToStorage(file);
      return { url: storageUrl, filename: file.name };
    } catch (storageErr) {
      console.warn('Firebase storage direct upload failed, fallback to server upload:', storageErr);
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE}/admin/upload`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
        },
        body: formData,
      });
      return await parseJsonSafely<{ url: string; filename: string }>(res, 'Image upload failed');
    }
  },
};
