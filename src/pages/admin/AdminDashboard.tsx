import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  ShieldCheck,
  Star,
  Image,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  AlertTriangle,
  Lock,
  Key,
  RefreshCw,
  Truck,
  Eye,
  ExternalLink,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useStore } from '../../context/StoreContext';
import { OrderStatus, Product } from '../../types';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const { logout, changePassword } = useAdminAuth();
  const {
    orders,
    products,
    settings,
    reviews,
    media,
    updateOrderStatus,
    updateSettings,
    deleteProduct,
    addProduct,
    deleteReview,
    addMedia,
    deleteMedia,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'add_product' | 'reviews' | 'media' | 'settings' | 'security'>('orders');

  // Filter state for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Security tab state
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdStatus, setPwdStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  // Add product form state
  const [pName, setPName] = useState('');
  const [pUrduName, setPUrduName] = useState('');
  const [pCategory, setPCategory] = useState('Face Cream');
  const [pPrice, setPPrice] = useState('1499');
  const [pOriginalPrice, setPOriginalPrice] = useState('2200');
  const [pShortDesc, setPShortDesc] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pUrduDesc, setPUrduDesc] = useState('');
  const [pImageUrl, setPImageUrl] = useState('');
  const [productSavedMsg, setProductSavedMsg] = useState('');

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg('');
    setPwdStatus('idle');

    if (!currPassword) {
      setPwdMsg('Please enter your current admin password.');
      setPwdStatus('error');
      return;
    }

    if (newPassword.length < 6) {
      setPwdMsg('New password must be at least 6 characters long.');
      setPwdStatus('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdMsg('New passwords do not match. Please verify.');
      setPwdStatus('error');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const res = await changePassword(currPassword, newPassword);
      if (res.success) {
        setPwdStatus('success');
        setPwdMsg('Admin password changed successfully! Your new credentials are now active.');
        setCurrPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwdStatus('error');
        setPwdMsg(res.message);
      }
    } catch (err: any) {
      setPwdStatus('error');
      setPwdMsg(err.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle save settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSavedMsg('Store settings updated successfully!');
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  // Handle create new product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = pName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addProduct({
      name: pName.trim(),
      urduName: pUrduName.trim(),
      slug,
      category: pCategory,
      price: Number(pPrice) || 1499,
      originalPrice: Number(pOriginalPrice) || 2200,
      stockStatus: 'in_stock',
      rating: 5.0,
      reviewCount: 1,
      images: pImageUrl.trim() ? [pImageUrl.trim()] : [],
      description: pDesc.trim() || pName,
      urduDescription: pUrduDesc.trim() || pUrduName,
      shortDescription: pShortDesc.trim() || pName,
      benefits: ['100% Herbal Formula', 'Fast Guaranteed Results'],
      howToUse: ['Apply evenly at night before sleep.'],
    });

    setPName('');
    setPUrduName('');
    setPShortDesc('');
    setPDesc('');
    setPUrduDesc('');
    setPImageUrl('');
    setProductSavedMsg('Product added successfully!');
    setTimeout(() => {
      setProductSavedMsg('');
      setActiveTab('products');
    }, 1500);
  };

  const filteredOrders =
    orderStatusFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === orderStatusFilter);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-serif-brand font-bold text-slate-950 text-lg">
            M
          </div>
          <div>
            <h1 className="font-serif-brand font-bold text-base text-white">Musfira Admin Panel</h1>
            <p className="text-[10px] text-slate-400">Store Management Console</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToStore}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Store</span>
          </button>

          <button
            onClick={logout}
            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-semibold rounded-xl border border-red-500/30 transition-colors flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 mb-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Revenue</span>
            <span className="text-xl font-black text-amber-400">Rs. {totalRevenue.toLocaleString()}</span>
            <p className="text-[11px] text-slate-400">{orders.length} total customer orders</p>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="flex-1 text-left">Orders (آرڈرز)</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded-full text-[10px] text-amber-300">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'products' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="flex-1 text-left">Products Catalog</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded-full text-[10px]">{products.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('add_product')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'add_product' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span className="flex-1 text-left">Add New Product</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'reviews' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Star className="w-4 h-4" />
            <span className="flex-1 text-left">Customer Reviews</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded-full text-[10px]">{reviews.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'media' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Image className="w-4 h-4" />
            <span className="flex-1 text-left">Media Gallery</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="flex-1 text-left">Store Settings</span>
          </button>

          <button
            id="admin-security-tab-btn"
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'security' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span className="flex-1 text-left">Admin Password</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold font-serif-brand text-white">Order Management</h2>
                  <p className="text-xs text-slate-400">View and update customer COD orders</p>
                </div>

                {/* Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Filter:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-xs rounded-xl px-3 py-1.5 text-white focus:outline-none"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">No orders in this status.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-700/80 gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm font-bold text-amber-400">
                              {ord.orderNumber}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(ord.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-white block mt-0.5">
                            {ord.customerName} ({ord.city})
                          </span>
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-slate-900 border border-slate-600 text-xs rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Phone:</span>
                          <a href={`tel:${ord.phone}`} className="text-amber-400 hover:underline">
                            {ord.phone}
                          </a>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Address:</span>
                          <p className="line-clamp-2">{ord.address}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Total Amount:</span>
                          <strong className="text-sm font-black text-white">
                            Rs. {ord.total.toLocaleString()} (COD)
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-serif-brand text-white">Products Catalog</h2>
                  <p className="text-xs text-slate-400">Manage existing beauty creams and skincare items</p>
                </div>
                <button
                  onClick={() => setActiveTab('add_product')}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-slate-800 rounded-2xl border border-slate-700 flex items-center space-x-4"
                  >
                    <img
                      src={p.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-white line-clamp-1">{p.name}</h3>
                      <p className="font-urdu text-[11px] text-amber-400 line-clamp-1">{p.urduName}</p>
                      <span className="text-xs font-black text-slate-200 mt-1 block">
                        Rs. {p.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ADD PRODUCT */}
          {activeTab === 'add_product' && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-bold font-serif-brand text-white">Add New Product</h2>
                <p className="text-xs text-slate-400">Publish a new skincare formula or package</p>
              </div>

              {productSavedMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold">
                  {productSavedMsg}
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Product Name (English) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Musfira Whitening Serum"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Product Name (Urdu) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. مسفرا وائٹننگ سیرم"
                      value={pUrduName}
                      onChange={(e) => setPUrduName(e.target.value)}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-right font-urdu focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Category</label>
                    <input
                      type="text"
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Price (Rs.) *</label>
                    <input
                      type="number"
                      required
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Original Price (Rs.)</label>
                    <input
                      type="number"
                      value={pOriginalPrice}
                      onChange={(e) => setPOriginalPrice(e.target.value)}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Image URL (WebP or JPG)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={pImageUrl}
                    onChange={(e) => setPImageUrl(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Short Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Herbal Results in 7 Days"
                    value={pShortDesc}
                    onChange={(e) => setPShortDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
                >
                  Create Product (پراڈکٹ محفوظ کریں)
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <h2 className="text-lg font-bold font-serif-brand text-white">Customer Reviews</h2>
                <p className="text-xs text-slate-400">Moderate testimonials displayed on the storefront</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{r.author} ({r.city})</span>
                        <span className="text-[10px] text-amber-400 font-bold">★ {r.rating}/5</span>
                      </div>
                      <p className="text-xs text-slate-300 italic mt-1">"{r.comment}"</p>
                      {r.urduComment && (
                        <p className="font-urdu text-right text-xs text-amber-300/80 mt-1">
                          "{r.urduComment}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-700 flex justify-end">
                      <button
                        onClick={() => deleteReview(r.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA */}
          {activeTab === 'media' && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <h2 className="text-lg font-bold font-serif-brand text-white">Media Assets</h2>
                <p className="text-xs text-slate-400">Store media and product photograph gallery</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {media.map((m) => (
                  <div key={m.id} className="relative group rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 aspect-square">
                    <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                      <button
                        onClick={() => deleteMedia(m.id)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-bold font-serif-brand text-white">Store Settings</h2>
                <p className="text-xs text-slate-400">Configure phone numbers, delivery fee, and announcements</p>
              </div>

              {settingsSavedMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold">
                  {settingsSavedMsg}
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Helpline Phone</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Standard Delivery Fee (Rs.)</label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Free Delivery Order Threshold (Rs.)</label>
                    <input
                      type="number"
                      value={settingsForm.freeDeliveryThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Top Announcement Bar Text</label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
                >
                  Save Store Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: SECURITY / CHANGE PASSWORD */}
          {activeTab === 'security' && (
            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-lg space-y-5">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif-brand">Change Admin Password</h3>
                  <p className="text-xs text-slate-400">Update your store login credentials securely</p>
                </div>
              </div>

              {pwdMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium border flex items-start space-x-2 ${
                    pwdStatus === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : pwdStatus === 'error'
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-blue-900/40 border-blue-700 text-blue-200'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {pwdStatus === 'success' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <span>{pwdMsg}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Current Password (موجودہ پاس ورڈ)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter existing password..."
                    value={currPassword}
                    onChange={(e) => setCurrPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    New Password (نیا پاس ورڈ - کم از کم 6 ہندسے)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Enter new password (min 6 chars)..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Confirm New Password (نئے پاس ورڈ کی تصدیق)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Re-enter new password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 outline-none transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Update Password Now</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
