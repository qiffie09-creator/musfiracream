import { Product, Category, Order, Review, SiteSettings, AdminStats, AdminUser } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('musfira_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Storefront Public APIs
  async getProducts(params?: { category?: string; search?: string; featured?: boolean; sort?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.featured) query.set('featured', 'true');
    if (params?.sort) query.set('sort', params.sort);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getReviews(productId?: string): Promise<Review[]> {
    const query = productId ? `?productId=${encodeURIComponent(productId)}` : '';
    const res = await fetch(`${API_BASE}/reviews${query}`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async submitReview(data: Partial<Review>): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit review');
    }
    return res.json();
  },

  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch site settings');
    return res.json();
  },

  async createOrder(orderData: any): Promise<{ success: boolean; order: Order; message: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to place order');
    }
    return res.json();
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  // Admin APIs
  async adminLogin(email: string, password: string): Promise<{ success: boolean; token: string; admin: AdminUser }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Invalid credentials');
    }
    return res.json();
  },

  async adminGetMe(): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/admin/me`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Session invalid');
    return res.json();
  },

  async adminGetStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  async adminGetProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to fetch admin products');
    return res.json();
  },

  async adminCreateProduct(data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    return res.json();
  },

  async adminUpdateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update product');
    }
    return res.json();
  },

  async adminDeleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return true;
  },

  async adminGetCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async adminCreateCategory(data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  async adminUpdateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/admin/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },

  async adminDeleteCategory(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return true;
  },

  async adminGetOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async adminUpdateOrderStatus(id: string, orderStatus: string, paymentStatus?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/admin/orders/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ orderStatus, paymentStatus }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  async adminDeleteReview(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/reviews/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete review');
    return true;
  },

  async adminUpdateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
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
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update password');
    }
  },

  async adminUploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Image upload failed');
    }
    return res.json();
  },
};
