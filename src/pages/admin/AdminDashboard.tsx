import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Star,
  Image,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  Save,
  Check,
  RefreshCw,
  Eye,
  DollarSign,
  User,
  Phone,
  MapPin,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useStore } from '../../context/StoreContext';
import { api } from '../../lib/api';
import { Product, Order, Category, Review, SiteSettings, AdminStats, ProductBundle } from '../../types';
import { BrandAssets } from '../../assets/images';

interface AdminDashboardProps {
  onGoToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onGoToStore }) => {
  const { admin, logout } = useAdminAuth();
  const { showToast, refreshStoreData } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories' | 'reviews' | 'media' | 'settings' | 'security'>('overview');

  // Stats state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);

  // Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Password state
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  // Media upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Initial load
  const loadAllData = async () => {
    try {
      setLoadingStats(true);
      const [st, pr, ord, cat, rev, sett] = await Promise.all([
        api.adminGetStats(),
        api.adminGetProducts(),
        api.adminGetOrders(),
        api.adminGetCategories(),
        api.getReviews(),
        api.getSettings(),
      ]);
      setStats(st);
      setProducts(pr);
      setOrders(ord);
      setCategories(cat);
      setReviews(rev);
      setSiteSettings(sett);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers for Products
  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (selectedProduct?.id) {
        await api.adminUpdateProduct(selectedProduct.id, productData);
        showToast(`Product "${productData.name}" updated successfully!`);
      } else {
        await api.adminCreateProduct(productData);
        showToast(`Product "${productData.name}" created successfully!`);
      }
      setShowProductModal(false);
      setSelectedProduct(null);
      loadAllData();
      refreshStoreData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await api.adminDeleteProduct(id);
        showToast(`Product "${name}" deleted`);
        loadAllData();
        refreshStoreData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  // Handlers for Orders
  const handleUpdateOrderStatus = async (orderId: string, status: string, payStatus?: string) => {
    try {
      await api.adminUpdateOrderStatus(orderId, status, payStatus);
      showToast(`Order #${orderId} status updated to ${status}`);
      loadAllData();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, orderStatus: status as any, paymentStatus: payStatus as any || prev.paymentStatus } : null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  // Handlers for Categories
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.adminCreateCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim(),
        active: true,
      });
      setNewCatName('');
      setNewCatDesc('');
      showToast('Category created!');
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Delete this category?')) {
      try {
        await api.adminDeleteCategory(id);
        showToast('Category removed');
        loadAllData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete category');
      }
    }
  };

  // Handlers for Reviews
  const handleDeleteReview = async (id: string) => {
    if (confirm('Delete this customer review?')) {
      try {
        await api.adminDeleteReview(id);
        showToast('Review removed');
        loadAllData();
        refreshStoreData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete review');
      }
    }
  };

  // Handlers for Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    try {
      setSavingSettings(true);
      await api.adminUpdateSettings(siteSettings);
      showToast('Store settings updated successfully!');
      refreshStoreData();
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Handlers for Password
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg('');
    if (newPassword !== confirmPassword) {
      setPwdMsg('New passwords do not match');
      return;
    }
    try {
      await api.adminChangePassword(currPassword, newPassword);
      setPwdMsg('Password changed successfully!');
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Admin password updated!');
    } catch (err: any) {
      setPwdMsg(err.message || 'Failed to change password');
    }
  };

  // Handlers for Media
  const handleMediaUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    try {
      setIsUploading(true);
      const res = await api.adminUploadImage(uploadFile);
      setUploadedUrl(res.url);
      showToast('Image uploaded successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.orderStatus === orderFilter;
  });

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        {/* Brand Banner */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img
              src={siteSettings?.logoUrl || BrandAssets.logo}
              alt="Logo"
              className="h-9 w-auto rounded object-contain bg-slate-900 p-0.5"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-serif-brand font-bold text-lg text-[#d4af37] block leading-none">
                MUSFIRA
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Store Admin</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 flex-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'overview' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'products' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'orders' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </div>
            {stats && stats.pendingOrders > 0 && (
              <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {stats.pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'categories' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'reviews' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'media' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Media Library</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'settings' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'security' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Admin Password</span>
          </button>
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2 text-xs">
          <button
            onClick={onGoToStore}
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Store</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-red-900/40 hover:bg-red-900/60 text-red-300 rounded-lg transition-colors font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-screen">
        {/* Top bar info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-brand text-white capitalize">
              {activeTab === 'overview' ? 'Dashboard & Metrics' : `${activeTab}`}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Store Account: <span className="text-blue-400">{admin?.email}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadAllData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center space-x-1 text-xs font-semibold"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {activeTab === 'products' && (
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setShowProductModal(true);
                }}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center space-x-1 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Total Revenue</span>
                <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-serif-brand mt-1 block">
                  Rs.{stats?.totalRevenue.toLocaleString() || '0'} PKR
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">Nationwide Deliveries</span>
              </div>

              <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Total Orders</span>
                <span className="text-2xl sm:text-3xl font-bold text-white font-serif-brand mt-1 block">
                  {stats?.totalOrders || 0}
                </span>
                <span className="text-[11px] text-amber-400 mt-1 block">
                  {stats?.pendingOrders || 0} Pending Verification
                </span>
              </div>

              <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Total Products</span>
                <span className="text-2xl sm:text-3xl font-bold text-white font-serif-brand mt-1 block">
                  {stats?.totalProducts || 0}
                </span>
                <span className="text-[11px] text-blue-400 mt-1 block">
                  {stats?.activeProducts || 0} Active for Sale
                </span>
              </div>

              <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Customer Rating</span>
                <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-serif-brand mt-1 block">
                  5.0 ★
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {reviews.length} Verified Customer Reviews
                </span>
              </div>
            </div>

            {/* Recent Orders in Overview */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-serif-brand">Recent Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-blue-400 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-750">
                        <td className="p-3 font-mono font-bold text-blue-400">{ord.id}</td>
                        <td className="p-3 font-medium text-white">{ord.customerName}</td>
                        <td className="p-3">{ord.phone}</td>
                        <td className="p-3">{ord.city}</td>
                        <td className="p-3 font-bold text-white font-serif-brand">Rs.{ord.total.toLocaleString()}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              ord.orderStatus === 'delivered'
                                ? 'bg-emerald-900/50 text-emerald-300'
                                : ord.orderStatus === 'pending'
                                ? 'bg-amber-900/50 text-amber-300'
                                : 'bg-blue-900/50 text-blue-300'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Search Filter */}
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title or category..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-750">
                      <td className="p-3 flex items-center space-x-3">
                        <img
                          src={prod.images[0] || BrandAssets.creamHero}
                          alt=""
                          className="w-10 h-10 object-cover rounded-lg bg-slate-900 border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-white font-serif-brand">{prod.name}</p>
                          <span className="text-[10px] text-slate-500">SKU: {prod.sku}</span>
                        </div>
                      </td>
                      <td className="p-3">{prod.category}</td>
                      <td className="p-3 font-bold text-white font-serif-brand">
                        Rs.{prod.price.toLocaleString()} PKR
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.stockStatus === 'sold_out' || prod.stock <= 0
                              ? 'bg-red-900/50 text-red-300'
                              : 'bg-emerald-900/50 text-emerald-300'
                          }`}
                        >
                          {prod.stockStatus === 'sold_out' || prod.stock <= 0 ? 'Sold Out' : `${prod.stock} in stock`}
                        </span>
                      </td>
                      <td className="p-3">
                        {prod.active !== false ? (
                          <span className="text-emerald-400 font-semibold">Active</span>
                        ) : (
                          <span className="text-slate-500 font-semibold">Inactive</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(prod);
                            setShowProductModal(true);
                          }}
                          className="p-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded-lg"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
                    orderFilter === st ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {st} ({st === 'all' ? orders.length : orders.filter((o) => o.orderStatus === st).length})
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Address & City</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total (COD)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-750">
                      <td className="p-3 font-mono font-bold text-blue-400">{ord.id}</td>
                      <td className="p-3">
                        <p className="font-bold text-white">{ord.customerName}</p>
                        <p className="text-[11px] text-slate-400">{ord.phone}</p>
                      </td>
                      <td className="p-3">
                        <p className="line-clamp-1">{ord.address}</p>
                        <span className="text-slate-400 font-semibold">{ord.city}</span>
                      </td>
                      <td className="p-3">
                        {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td className="p-3 font-bold text-white font-serif-brand">
                        Rs.{ord.total.toLocaleString()} PKR
                      </td>
                      <td className="p-3">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none capitalize"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="text-base font-bold text-white font-serif-brand">Add New Category</h3>
              <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Skin Polish"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Description (Optional)</label>
                  <textarea
                    rows={2}
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Category details..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg"
                >
                  Create Category
                </button>
              </form>
            </div>

            <div className="md:col-span-7 bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-3">
              <h3 className="text-base font-bold text-white font-serif-brand">Existing Categories</h3>
              <div className="divide-y divide-slate-700">
                {categories.map((cat) => (
                  <div key={cat.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{cat.name}</p>
                      <p className="text-xs text-slate-400">{cat.slug}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 text-red-400 hover:bg-red-900/30 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Reviewer</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Feedback</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-750">
                    <td className="p-3 font-bold text-white">{rev.reviewerName}</td>
                    <td className="p-3 text-amber-400 font-bold">{rev.rating} ★</td>
                    <td className="p-3 max-w-xs truncate">{rev.comment}</td>
                    <td className="p-3 text-slate-400">{rev.date}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="text-base font-bold text-white font-serif-brand">Upload New Media Asset</h3>
              <form onSubmit={handleMediaUpload} className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
                <button
                  type="submit"
                  disabled={!uploadFile || isUploading}
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                </button>
              </form>

              {uploadedUrl && (
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 truncate">{uploadedUrl}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(uploadedUrl);
                      showToast('URL copied to clipboard!');
                    }}
                    className="text-xs font-bold text-blue-400 hover:underline shrink-0 ml-3"
                  >
                    Copy URL
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS */}
        {activeTab === 'settings' && siteSettings && (
          <form onSubmit={handleSaveSettings} className="bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={siteSettings.brandName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, brandName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={siteSettings.brandTagline}
                  onChange={(e) => setSiteSettings({ ...siteSettings, brandTagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Bismillah Arabic Bar Text</label>
                <input
                  type="text"
                  value={siteSettings.bismillahText}
                  onChange={(e) => setSiteSettings({ ...siteSettings, bismillahText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-urdu"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Marquee Ticker Text</label>
                <input
                  type="text"
                  value={siteSettings.tickerText}
                  onChange={(e) => setSiteSettings({ ...siteSettings, tickerText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">WhatsApp Order Number</label>
                <input
                  type="text"
                  value={siteSettings.whatsappNumber}
                  onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Support Phone</label>
                <input
                  type="text"
                  value={siteSettings.phone}
                  onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Support Email</label>
                <input
                  type="email"
                  value={siteSettings.email}
                  onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={siteSettings.address}
                  onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'Saving Settings...' : 'Save Settings'}</span>
            </button>
          </form>
        )}

        {/* TAB 8: SECURITY */}
        {activeTab === 'security' && (
          <div className="bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 max-w-lg space-y-4">
            <h3 className="text-base font-bold text-white font-serif-brand">Change Admin Password</h3>
            {pwdMsg && (
              <div className="p-3 bg-blue-900/40 border border-blue-700 rounded-lg text-xs text-blue-200">
                {pwdMsg}
              </div>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg mt-2"
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Product Edit / Create Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full p-6 border border-slate-700 text-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-lg font-bold font-serif-brand">
                {selectedProduct ? `Edit ${selectedProduct.name}` : 'Create New Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const price = Number(formData.get('price'));
                const salePrice = Number(formData.get('salePrice')) || undefined;
                const category = formData.get('category') as string;
                const stock = Number(formData.get('stock')) || 0;
                const description = formData.get('description') as string;
                const imageUrl = formData.get('imageUrl') as string;

                handleSaveProduct({
                  name,
                  price,
                  salePrice,
                  category,
                  stock,
                  stockStatus: stock > 0 ? 'in_stock' : 'sold_out',
                  description,
                  images: imageUrl ? [imageUrl] : selectedProduct?.images || [BrandAssets.creamHero],
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1 text-slate-300">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={selectedProduct?.name || ''}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Active Price (PKR)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    defaultValue={selectedProduct?.price || 1499}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Crossed Original Price (Optional)</label>
                  <input
                    type="number"
                    name="salePrice"
                    defaultValue={selectedProduct?.salePrice || 3000}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Category</label>
                  <select
                    name="category"
                    defaultValue={selectedProduct?.category || 'Beauty Creams'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Inventory Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={selectedProduct?.stock || 50}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  defaultValue={selectedProduct?.images[0] || ''}
                  placeholder="/src/assets/images/musfira_cream_hero_1788205132383.jpg"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">Product Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={selectedProduct?.description || ''}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-700 text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-lg font-bold font-serif-brand">Order #{selectedOrder.id} Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-900 rounded-xl space-y-1">
                <span className="font-bold text-white block">Customer Info:</span>
                <p>Name: {selectedOrder.customerName}</p>
                <p>Phone: {selectedOrder.phone}</p>
                <p>Address: {selectedOrder.address}, {selectedOrder.city}</p>
                {selectedOrder.nearbyPlace && <p>Nearby Landmark: {selectedOrder.nearbyPlace}</p>}
                {selectedOrder.notes && <p className="text-amber-400">Notes: {selectedOrder.notes}</p>}
              </div>

              <div className="p-3 bg-slate-900 rounded-xl space-y-1">
                <span className="font-bold text-white block">Items:</span>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.name} (x{it.quantity})</span>
                    <span className="font-bold">Rs.{(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                  <span>Total Amount (COD):</span>
                  <span className="text-emerald-400">Rs.{selectedOrder.total.toLocaleString()} PKR</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
