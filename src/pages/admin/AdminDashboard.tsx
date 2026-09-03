import React, { useState, useMemo } from 'react';
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
  RefreshCw,
  Truck,
  Eye,
  ExternalLink,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Sparkles,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Filter,
  Layers,
  BarChart3,
  Calendar,
  Share2,
  Copy,
  Radio,
  FileText,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useStore } from '../../context/StoreContext';
import { OrderStatus, Product, ProductBundle, StockStatus } from '../../types';
import { BrandAssets } from '../../assets/images';
import { generateInvoicePDF } from '../../utils/generateInvoicePDF';

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
    isLiveBackend,
    updateOrderStatus,
    deleteOrder,
    updateSettings,
    deleteProduct,
    addProduct,
    updateProduct,
    addReview,
    deleteReview,
    addMedia,
    deleteMedia,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'orders' | 'products' | 'add_product' | 'reviews' | 'media' | 'settings' | 'security'
  >('analytics');

  // Search & Filter state for Shopify-style Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [courierInput, setCourierInput] = useState('');
  const [trackingInput, setTrackingInput] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

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
  const [pCategory, setPCategory] = useState('Beauty Cream');
  const [pPrice, setPPrice] = useState('1499');
  const [pOriginalPrice, setPOriginalPrice] = useState('2200');
  const [pShortDesc, setPShortDesc] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pUrduDesc, setPUrduDesc] = useState('');
  const [pImageUrl, setPImageUrl] = useState('');
  const [productSavedMsg, setProductSavedMsg] = useState('');

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrduName, setEditUrduName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editDiscountPct, setEditDiscountPct] = useState('32');
  const [editStockStatus, setEditStockStatus] = useState<StockStatus>('in_stock');
  const [editCategory, setEditCategory] = useState('');
  const [editShortDesc, setEditShortDesc] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editUrduDesc, setEditUrduDesc] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [bundle1Price, setBundle1Price] = useState('1499');
  const [bundle2Price, setBundle2Price] = useState('2499');
  const [bundle3Price, setBundle3Price] = useState('3499');
  const [editProductSavedMsg, setEditProductSavedMsg] = useState('');

  // Add Review Modal State
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [revAuthor, setRevAuthor] = useState('');
  const [revCity, setRevCity] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revUrduComment, setRevUrduComment] = useState('');
  const [revBeforeAfterImg, setRevBeforeAfterImg] = useState<string>('preset_1');
  const [revCustomImgUrl, setRevCustomImgUrl] = useState('');
  const [reviewSavedMsg, setReviewSavedMsg] = useState('');

  // Password Change
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

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSavedMsg('Store settings updated & synchronized to Firebase!');
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  // Create Product
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
      images: pImageUrl.trim() ? [pImageUrl.trim()] : [BrandAssets.musfiraCreamMain],
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
    setProductSavedMsg('Product published to live store & Firebase catalog!');
    setTimeout(() => {
      setProductSavedMsg('');
      setActiveTab('products');
    }, 1500);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditUrduName(p.urduName || '');
    setEditPrice(String(p.price));
    const orig = p.originalPrice || Math.round(p.price * 1.4);
    setEditOriginalPrice(String(orig));
    const discPct = orig > p.price ? Math.round(((orig - p.price) / orig) * 100) : 30;
    setEditDiscountPct(String(discPct));
    setEditStockStatus(p.stockStatus || 'in_stock');
    setEditCategory(p.category || 'Beauty Cream');
    setEditShortDesc(p.shortDescription || '');
    setEditDesc(p.description || '');
    setEditUrduDesc(p.urduDescription || '');
    setEditImageUrl(p.images?.[0] || '');

    // Initialize bundle pricing if available
    const b1 = p.bundles?.find((b) => b.id.includes('1')) || p.bundles?.[0];
    const b2 = p.bundles?.find((b) => b.id.includes('2')) || p.bundles?.[1];
    const b3 = p.bundles?.find((b) => b.id.includes('3')) || p.bundles?.[2];

    setBundle1Price(b1 ? String(b1.price) : String(p.price));
    setBundle2Price(b2 ? String(b2.price) : String(Math.round(p.price * 1.65)));
    setBundle3Price(b3 ? String(b3.price) : String(Math.round(p.price * 2.3)));
    setEditProductSavedMsg('');
  };

  const handleEditDiscountPctChange = (pctVal: string) => {
    setEditDiscountPct(pctVal);
    const pct = Number(pctVal);
    const orig = Number(editOriginalPrice) || 2200;
    if (!isNaN(pct) && pct >= 0 && pct < 100) {
      const calculatedSelling = Math.round(orig * (1 - pct / 100));
      setEditPrice(String(calculatedSelling));
      setBundle1Price(String(calculatedSelling));
    }
  };

  const handleEditPriceChange = (priceVal: string) => {
    setEditPrice(priceVal);
    setBundle1Price(priceVal);
    const pVal = Number(priceVal);
    const orig = Number(editOriginalPrice) || 2200;
    if (orig > 0 && !isNaN(pVal)) {
      const pct = Math.max(0, Math.round(((orig - pVal) / orig) * 100));
      setEditDiscountPct(String(pct));
    }
  };

  const handleEditOriginalPriceChange = (origVal: string) => {
    setEditOriginalPrice(origVal);
    const orig = Number(origVal);
    const pVal = Number(editPrice) || 1499;
    if (orig > 0 && !isNaN(pVal)) {
      const pct = Math.max(0, Math.round(((orig - pVal) / orig) * 100));
      setEditDiscountPct(String(pct));
    }
  };

  // Save Edited Product to Live Firebase & Store
  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const basePrice = Number(editPrice) || 1499;
    const baseOrigPrice = Number(editOriginalPrice) || Math.round(basePrice * 1.4);

    const b1p = Number(bundle1Price) || basePrice;
    const b2p = Number(bundle2Price) || Math.round(basePrice * 1.65);
    const b3p = Number(bundle3Price) || Math.round(basePrice * 2.3);

    const updatedBundles: ProductBundle[] = [
      {
        id: 'bundle_1',
        name: '1 Pack (One Cream Jar)',
        urduName: '1 جار - مسفرا بیوٹی کریم',
        quantity: 1,
        price: b1p,
        originalPrice: Math.round(b1p * 1.45),
        badge: 'Single Pack',
        isDefault: false,
      },
      {
        id: 'bundle_2',
        name: '2 Packs (Double Jar - Special Savings)',
        urduName: '2 جار - زبردست بچت آفر',
        quantity: 2,
        price: b2p,
        originalPrice: Math.round(b2p * 1.4),
        badge: 'Most Popular',
        isDefault: true,
      },
      {
        id: 'bundle_3',
        name: '3 Packs (Family Glow Treatment Pack)',
        urduName: '3 جار - مکمل فیملی کورس پیک',
        quantity: 3,
        price: b3p,
        originalPrice: Math.round(b3p * 1.4),
        badge: 'Best Value',
        isDefault: false,
      },
    ];

    const updated: Product = {
      ...editingProduct,
      name: editName.trim(),
      urduName: editUrduName.trim() || 'مسفرا بیوٹی کریم',
      category: editCategory.trim(),
      price: basePrice,
      originalPrice: baseOrigPrice,
      stockStatus: editStockStatus,
      shortDescription: editShortDesc.trim(),
      description: editDesc.trim(),
      urduDescription: editUrduDesc.trim(),
      images: editImageUrl.trim() ? [editImageUrl.trim()] : editingProduct.images,
      bundles: updatedBundles,
    };

    updateProduct(updated);
    setEditProductSavedMsg('Product & pricing updated live on Firebase & Storefront!');
    setTimeout(() => {
      setEditProductSavedMsg('');
      setEditingProduct(null);
    }, 1500);
  };

  // Add Customer Review
  const handleSaveNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revAuthor.trim() || !revComment.trim()) return;

    let selectedImg = '';
    if (revBeforeAfterImg === 'preset_1') {
      selectedImg = BrandAssets.result1;
    } else if (revBeforeAfterImg === 'preset_2') {
      selectedImg = BrandAssets.result2;
    } else if (revBeforeAfterImg === 'custom' && revCustomImgUrl.trim()) {
      selectedImg = revCustomImgUrl.trim();
    }

    addReview({
      author: revAuthor.trim(),
      initials: revAuthor
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      city: revCity.trim() || 'Pakistan',
      rating: revRating,
      comment: revComment.trim(),
      urduComment: revUrduComment.trim() || undefined,
      beforeAfterImage: selectedImg || undefined,
    });

    setReviewSavedMsg('Customer review published live to Firebase & storefront!');
    setTimeout(() => {
      setReviewSavedMsg('');
      setIsAddingReview(false);
      setRevAuthor('');
      setRevCity('');
      setRevComment('');
      setRevUrduComment('');
      setRevCustomImgUrl('');
    }, 1500);
  };

  // Shopify-Style Metrics Calculations
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered');
    const pendingOrders = orders.filter((o) => o.status === 'pending');
    const confirmedOrders = orders.filter((o) => o.status === 'confirmed');
    const dispatchedOrders = orders.filter((o) => o.status === 'dispatched');
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled');

    const totalSales = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / (totalOrders - cancelledOrders.length || 1)) : 0;

    // Delivery Fulfillment Rate
    const fulfillmentRate =
      totalOrders - cancelledOrders.length > 0
        ? Math.round((deliveredOrders.length / (totalOrders - cancelledOrders.length)) * 100)
        : 0;

    // Top Cities
    const cityCountMap: Record<string, number> = {};
    orders.forEach((o) => {
      const city = o.city?.trim() || 'Other';
      cityCountMap[city] = (cityCountMap[city] || 0) + 1;
    });
    const topCities = Object.entries(cityCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalOrders,
      totalSales,
      pendingOrders: pendingOrders.length,
      confirmedOrders: confirmedOrders.length,
      dispatchedOrders: dispatchedOrders.length,
      deliveredOrders: deliveredOrders.length,
      cancelledOrders: cancelledOrders.length,
      averageOrderValue,
      fulfillmentRate,
      topCities,
    };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
      const searchLower = orderSearch.toLowerCase();
      const matchesSearch =
        !orderSearch ||
        ord.orderNumber.toLowerCase().includes(searchLower) ||
        ord.customerName.toLowerCase().includes(searchLower) ||
        ord.phone.includes(searchLower) ||
        ord.city.toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Copy tracking / order info
  const handleCopyOrder = (ord: any) => {
    const text = `Order #${ord.orderNumber}\nCustomer: ${ord.customerName}\nPhone: ${ord.phone}\nCity: ${ord.city}\nAddress: ${ord.address}\nTotal: Rs. ${ord.total}\nStatus: ${ord.status.toUpperCase()}`;
    navigator.clipboard.writeText(text);
    setCopiedOrderId(ord.id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Address', 'Status', 'Total', 'Payment'];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName.replace(/"/g, '""')}"`,
      o.phone,
      `"${o.city.replace(/"/g, '""')}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      o.status,
      o.total,
      o.paymentMethod,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `musfira_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans">
      {/* Top Shopify-Style Navigation Bar */}
      <header className="bg-[#161b22] border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-gold-sm bg-white p-0.5 flex items-center justify-center shrink-0">
            <img
              src={BrandAssets.logoIcon || BrandAssets.logo}
              alt="Musfira Logo"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif font-bold text-base text-white tracking-wide">
                Musfira Beauty Cream
              </h1>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Shopify-Style Admin</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <span>Cloud Firestore Database</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">● Real-time Sync Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToStore}
            className="px-3.5 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5 text-slate-200 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Storefront</span>
          </button>

          <button
            onClick={logout}
            className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 text-xs font-semibold rounded-xl border border-red-800/40 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          {/* Quick Snapshot Card */}
          <div className="p-4 bg-gradient-to-br from-[#161b22] to-[#1c2128] rounded-2xl border border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Total Sales (COD)</span>
              <DollarSign className="w-3.5 h-3.5 text-[#d4af37]" />
            </div>
            <span className="text-2xl font-black text-[#f3e5ab] block">
              Rs. {metrics.totalSales.toLocaleString()}
            </span>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span>{metrics.totalOrders} total orders</span>
              <span className="text-emerald-400 font-bold">{metrics.pendingOrders} pending</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-[#996515] to-[#d4af37] text-white shadow-gold-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="flex-1 text-left">Analytics & Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#996515] to-[#d4af37] text-white shadow-gold-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="flex-1 text-left">Orders (آرڈرز)</span>
              <span className="bg-[#21262d] px-2 py-0.5 rounded-full text-[10px] text-amber-300 font-mono">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-[#996515] to-[#d4af37] text-white shadow-gold-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span className="flex-1 text-left">Products Catalog</span>
              <span className="bg-[#21262d] px-2 py-0.5 rounded-full text-[10px]">{products.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('add_product')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'add_product'
                  ? 'bg-gradient-to-r from-[#996515] to-[#d4af37] text-white shadow-gold-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="flex-1 text-left">Add New Product</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-gradient-to-r from-[#996515] to-[#d4af37] text-white shadow-gold-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
              }`}
            >
              <Star className="w-4 h-4" />
              <span className="flex-1 text-left">Customer Reviews</span>
              <span className="bg-[#21262d] px-2 py-0.5 rounded-full text-[10px]">{reviews.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-gradient-to-r from-[#996515] to-[#d4af37] text-white shadow-gold-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
              }`}
            >
              <Image className="w-4 h-4" />
              <span className="flex-1 text-left">Media Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#996515] to-[#d4af37] text-white shadow-gold-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="flex-1 text-left">Store Settings</span>
            </button>

            <button
              id="admin-security-tab-btn"
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-[#996515] to-[#d4af37] text-white shadow-gold-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span className="flex-1 text-left">Admin Password</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Pane */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 0: SHOPIFY-STYLE ANALYTICS & OVERVIEW */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold font-serif text-white tracking-tight">
                    Store Performance Dashboard
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live revenue, order fulfillment pipeline, and sales breakdown
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* 4 Primary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-[#161b22] rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold">Total Revenue</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-2xl font-extrabold text-white block">
                    Rs. {metrics.totalSales.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-emerald-400 flex items-center space-x-1">
                    <span>Cash on Delivery active</span>
                  </p>
                </div>

                <div className="p-5 bg-[#161b22] rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <span className="text-2xl font-extrabold text-white block">
                    {metrics.totalOrders}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {metrics.pendingOrders} pending fulfillment
                  </p>
                </div>

                <div className="p-5 bg-[#161b22] rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold">Average Order Value</span>
                    <DollarSign className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-2xl font-extrabold text-white block">
                    Rs. {metrics.averageOrderValue.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-slate-400">Per paying customer</p>
                </div>

                <div className="p-5 bg-[#161b22] rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold">Fulfillment Rate</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-2xl font-extrabold text-white block">
                    {metrics.fulfillmentRate}%
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {metrics.deliveredOrders} orders delivered
                  </p>
                </div>
              </div>

              {/* Order Status Pipeline Breakdown */}
              <div className="p-6 bg-[#161b22] rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-[#d4af37]" />
                  <span>Order Status Pipeline (آرڈر فل فلمنٹ)</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div
                    onClick={() => {
                      setOrderStatusFilter('pending');
                      setActiveTab('orders');
                    }}
                    className="p-3.5 bg-[#21262d] hover:bg-[#282e36] rounded-xl border border-amber-500/20 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-amber-300">Pending</span>
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-xl font-black text-amber-400 block mt-1">
                      {metrics.pendingOrders}
                    </span>
                    <span className="text-[10px] text-slate-400">Requires verification</span>
                  </div>

                  <div
                    onClick={() => {
                      setOrderStatusFilter('confirmed');
                      setActiveTab('orders');
                    }}
                    className="p-3.5 bg-[#21262d] hover:bg-[#282e36] rounded-xl border border-blue-500/20 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-blue-300">Confirmed</span>
                      <Check className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-xl font-black text-blue-400 block mt-1">
                      {metrics.confirmedOrders}
                    </span>
                    <span className="text-[10px] text-slate-400">Ready for packing</span>
                  </div>

                  <div
                    onClick={() => {
                      setOrderStatusFilter('dispatched');
                      setActiveTab('orders');
                    }}
                    className="p-3.5 bg-[#21262d] hover:bg-[#282e36] rounded-xl border border-purple-500/20 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-purple-300">Dispatched</span>
                      <Truck className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <span className="text-xl font-black text-purple-400 block mt-1">
                      {metrics.dispatchedOrders}
                    </span>
                    <span className="text-[10px] text-slate-400">In courier transit</span>
                  </div>

                  <div
                    onClick={() => {
                      setOrderStatusFilter('delivered');
                      setActiveTab('orders');
                    }}
                    className="p-3.5 bg-[#21262d] hover:bg-[#282e36] rounded-xl border border-emerald-500/20 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-300">Delivered</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-xl font-black text-emerald-400 block mt-1">
                      {metrics.deliveredOrders}
                    </span>
                    <span className="text-[10px] text-slate-400">Cash collected</span>
                  </div>

                  <div
                    onClick={() => {
                      setOrderStatusFilter('cancelled');
                      setActiveTab('orders');
                    }}
                    className="p-3.5 bg-[#21262d] hover:bg-[#282e36] rounded-xl border border-red-500/20 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-red-300">Cancelled</span>
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <span className="text-xl font-black text-red-400 block mt-1">
                      {metrics.cancelledOrders}
                    </span>
                    <span className="text-[10px] text-slate-400">Returned/Voided</span>
                  </div>
                </div>
              </div>

              {/* Geographic Performance & Recent Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Customer Cities */}
                <div className="p-6 bg-[#161b22] rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                    <span>Top Demand Cities in Pakistan</span>
                  </h3>
                  {metrics.topCities.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">No city data available yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {metrics.topCities.map(([city, count]) => {
                        const pct = Math.round((count / (metrics.totalOrders || 1)) * 100);
                        return (
                          <div key={city} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-200">{city}</span>
                              <span className="text-slate-400">
                                {count} orders ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-2 bg-[#21262d] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#996515] to-[#d4af37] rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent High Priority Orders */}
                <div className="p-6 bg-[#161b22] rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#d4af37]" />
                      <span>Recent Orders Awaiting Action</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-amber-400 hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>

                  {orders.slice(0, 4).length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">No orders registered yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {orders.slice(0, 4).map((ord) => (
                        <div
                          key={ord.id}
                          onClick={() => {
                            setSelectedOrder(ord);
                            setActiveTab('orders');
                          }}
                          className="p-3 bg-[#21262d] hover:bg-[#282e36] rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div>
                            <span className="font-mono text-xs font-bold text-amber-300">
                              {ord.orderNumber}
                            </span>
                            <p className="text-xs text-slate-200 font-medium">{ord.customerName}</p>
                            <span className="text-[10px] text-slate-400">{ord.city}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-white block">
                              Rs. {ord.total.toLocaleString()}
                            </span>
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                                ord.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : ord.status === 'delivered'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: SHOPIFY-STYLE ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 space-y-6 animate-fade-in">
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold font-serif text-white">
                    Order Management ({filteredOrders.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live customer orders synced in real-time with Firebase Firestore
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-7 relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by order #, customer name, phone, city..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="sm:col-span-5 flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full bg-[#0d1117] border border-slate-700 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="all">All Order Statuses</option>
                    <option value="pending">Pending Verification</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="dispatched">Dispatched to Courier</option>
                    <option value="delivered">Delivered (Completed)</option>
                    <option value="cancelled">Cancelled / Returned</option>
                  </select>
                </div>
              </div>

              {/* Orders List / Table */}
              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-3">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm font-medium">No orders matching current filter criteria.</p>
                  <button
                    onClick={() => {
                      setOrderSearch('');
                      setOrderStatusFilter('all');
                    }}
                    className="text-xs text-amber-400 hover:underline font-bold"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className={`p-4 sm:p-5 rounded-2xl bg-[#0d1117] border transition-all space-y-4 ${
                        selectedOrder?.id === ord.id
                          ? 'border-[#d4af37] ring-1 ring-[#d4af37]/30'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top row: Order Number, Date, Status Selector, Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-3">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-sm font-bold text-[#f3e5ab] bg-[#21262d] px-2.5 py-1 rounded-lg border border-slate-700">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(ord.createdAt).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleCopyOrder(ord)}
                            className="p-1 text-slate-400 hover:text-white cursor-pointer"
                            title="Copy order info"
                          >
                            {copiedOrderId === ord.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* PDF Invoice Download Button */}
                          <button
                            onClick={() => generateInvoicePDF(ord)}
                            className="px-2.5 py-1 bg-gradient-to-r from-[#996515] to-[#d4af37] text-white hover:opacity-95 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-gold-xs ml-1"
                            title="Download Official Tax Invoice in PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF Invoice</span>
                          </button>
                        </div>

                        {/* Status Change Selector */}
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-slate-400">Change Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className={`text-xs rounded-xl px-3 py-1.5 font-bold border focus:outline-none cursor-pointer ${
                              ord.status === 'pending'
                                ? 'bg-amber-950/30 text-amber-300 border-amber-600/50'
                                : ord.status === 'confirmed'
                                ? 'bg-blue-950/30 text-blue-300 border-blue-600/50'
                                : ord.status === 'dispatched'
                                ? 'bg-purple-950/30 text-purple-300 border-purple-600/50'
                                : ord.status === 'delivered'
                                ? 'bg-emerald-950/30 text-emerald-300 border-emerald-600/50'
                                : 'bg-red-950/30 text-red-300 border-red-600/50'
                            }`}
                          >
                            <option value="pending">Pending Verification</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => deleteOrder(ord.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Customer & Delivery Information Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        {/* Customer Info */}
                        <div className="p-3 bg-[#161b22] rounded-xl border border-slate-800 space-y-1">
                          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                            Customer Details
                          </span>
                          <div className="font-bold text-white text-sm">{ord.customerName}</div>
                          <div className="text-amber-400 font-mono">
                            <a href={`tel:${ord.phone}`} className="hover:underline">
                              📞 {ord.phone}
                            </a>
                          </div>
                          {ord.alternatePhone && (
                            <div className="text-slate-400 text-[11px]">Alt: {ord.alternatePhone}</div>
                          )}
                        </div>

                        {/* Shipping Address */}
                        <div className="p-3 bg-[#161b22] rounded-xl border border-slate-800 space-y-1">
                          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                            Shipping Destination
                          </span>
                          <div className="font-bold text-white">
                            📍 {ord.city}{ord.province ? `, ${ord.province}` : ''}
                          </div>
                          <div className="text-slate-300 text-[11px] leading-relaxed">
                            {ord.address}
                            {ord.areaSector ? `, ${ord.areaSector}` : ''}
                          </div>
                          {ord.nearbyFamousPlace && (
                            <div className="text-amber-300/80 text-[10px]">
                              Landmark: {ord.nearbyFamousPlace}
                            </div>
                          )}
                          {ord.notes && (
                            <div className="text-slate-400 text-[10px] italic pt-0.5">
                              Note: {ord.notes}
                            </div>
                          )}
                        </div>

                        {/* Payment & Courier Info */}
                        <div className="p-3 bg-[#161b22] rounded-xl border border-slate-800 space-y-1 flex flex-col justify-between">
                          <div>
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                              Payment & Total
                            </span>
                            <div className="text-base font-black text-[#f3e5ab]">
                              Rs. {ord.total.toLocaleString()} (COD)
                            </div>
                            <div className="text-emerald-400 text-[10px] font-semibold">
                              Free Shipping Included
                            </div>
                          </div>

                          {/* Quick Tracking & Courier */}
                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">
                              Courier:{' '}
                              <strong className="text-white">
                                {ord.courierName || 'TCS / Leopards'}
                              </strong>
                            </span>
                            {ord.trackingNumber && (
                              <span className="text-amber-400 font-mono font-bold">
                                #{ord.trackingNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Items Purchased */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Items in Order
                        </span>
                        <div className="space-y-1.5">
                          {ord.items?.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs py-1 px-2.5 bg-[#161b22] rounded-lg border border-slate-800"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                                  {item.quantity}x
                                </span>
                                <span className="font-semibold text-slate-200">
                                  {item.productName}
                                </span>
                                {item.bundleName && (
                                  <span className="text-[10px] text-amber-400">
                                    ({item.bundleName})
                                  </span>
                                )}
                              </div>
                              <span className="font-bold text-white font-mono">
                                Rs. {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-serif text-white">
                    Products Catalog ({products.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live products currently published on the storefront and synced to Firebase Firestore
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('add_product')}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#996515] to-[#d4af37] text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-gold-xs hover:opacity-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Highlighted Featured Homepage Product Card */}
              {(() => {
                const homeProduct = products.find(
                  (p) => p.id === 'prod_musfira_cream' || p.id === 'prod_wiki_cream' || p.slug === 'musfira-beauty-cream'
                ) || products[0];

                if (!homeProduct) return null;

                return (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1c1810] via-[#241f14] to-[#1c1810] border-2 border-[#b8860b]/50 shadow-gold-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-2xl bg-white p-1 shrink-0 border border-amber-300 shadow-md">
                        <img
                          src={homeProduct.images?.[0] || BrandAssets.musfiraCreamMain}
                          alt={homeProduct.name}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#b8860b] to-[#d4af37] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs">
                          HERO
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                            ★ Featured Homepage Product
                          </span>
                          <span className="text-[10px] px-2 py-0.2 bg-emerald-500/20 text-emerald-300 rounded-full font-medium">
                            Live on Storefront
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-0.5">{homeProduct.name}</h3>
                        <p className="font-urdu text-xs text-amber-300">{homeProduct.urduName}</p>
                        <div className="flex items-center space-x-3 mt-1.5 text-xs">
                          <span className="font-extrabold text-[#d4af37]">
                            Base: Rs. {homeProduct.price.toLocaleString()}
                          </span>
                          {homeProduct.bundles && homeProduct.bundles.length > 1 && (
                            <span className="text-slate-300 text-[11px]">
                              2 Packs: <strong className="text-amber-300">Rs. {homeProduct.bundles[1].price.toLocaleString()}</strong>
                            </span>
                          )}
                          <span className="text-slate-400 text-[10px]">
                            • Cash on Delivery Enabled
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEditProduct(homeProduct)}
                      className="px-4 py-2.5 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] text-slate-950 font-extrabold text-xs rounded-xl shadow-gold-xs hover:opacity-95 transition-all flex items-center space-x-2 cursor-pointer shrink-0 border border-amber-200"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Homepage Product & Pricing</span>
                    </button>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-[#0d1117] rounded-2xl border border-slate-800 flex items-center space-x-4 hover:border-slate-700 transition-colors"
                  >
                    <img
                      src={p.images?.[0] || BrandAssets.musfiraCreamMain}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-contain bg-white p-1 shrink-0 border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-white line-clamp-1">{p.name}</h3>
                      <p className="font-urdu text-[11px] text-[#d4af37] line-clamp-1">{p.urduName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-black text-white">
                          Rs. {p.price.toLocaleString()}
                        </span>
                        {p.originalPrice > p.price && (
                          <span className="text-[10px] text-slate-500 line-through">
                            Rs. {p.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            p.stockStatus === 'in_stock'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {p.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="px-2.5 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-amber-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1 cursor-pointer"
                        title="Edit Product and Pricing"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Product & Pricing Modal */}
              {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
                  <div className="bg-[#161b22] border border-amber-500/40 rounded-3xl p-6 max-w-xl w-full my-8 space-y-5 text-xs text-slate-200 shadow-2xl relative animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                          <Edit className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base text-white">
                            Edit Product & Pricing
                          </h3>
                          <p className="text-[11px] text-slate-400">
                            Updates sync live to Firebase Firestore & Customer Storefront
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {editProductSavedMsg && (
                      <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>{editProductSavedMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveEditedProduct} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">
                            Product Title (English) *
                          </label>
                          <input
                            type="text"
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">
                            Product Title (Urdu)
                          </label>
                          <input
                            type="text"
                            value={editUrduName}
                            onChange={(e) => setEditUrduName(e.target.value)}
                            className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white text-right font-urdu focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>
                      </div>

                      {/* Pricing Section */}
                      <div className="p-3.5 bg-[#0d1117] rounded-2xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                            Base Pricing & Discount
                          </h4>
                          {Number(editOriginalPrice) > Number(editPrice) && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Save Rs. {Number(editOriginalPrice) - Number(editPrice)} ({editDiscountPct}% OFF)
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[11px] text-slate-300 mb-1">
                              Selling Price (Rs.) *
                            </label>
                            <input
                              type="number"
                              required
                              value={editPrice}
                              onChange={(e) => handleEditPriceChange(e.target.value)}
                              className="w-full p-2 bg-[#161b22] border border-slate-700 rounded-xl text-white font-bold text-amber-300 focus:outline-none focus:border-[#d4af37]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-300 mb-1">
                              Cut / Original Price (Rs.)
                            </label>
                            <input
                              type="number"
                              value={editOriginalPrice}
                              onChange={(e) => handleEditOriginalPriceChange(e.target.value)}
                              className="w-full p-2 bg-[#161b22] border border-slate-700 rounded-xl text-slate-400 focus:outline-none focus:border-[#d4af37]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-300 mb-1">
                              Discount (%)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="90"
                              value={editDiscountPct}
                              onChange={(e) => handleEditDiscountPctChange(e.target.value)}
                              className="w-full p-2 bg-[#161b22] border border-amber-500/50 rounded-xl text-emerald-300 font-bold focus:outline-none focus:border-[#d4af37]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-300 mb-1">
                              Stock Status
                            </label>
                            <select
                              value={editStockStatus}
                              onChange={(e) => setEditStockStatus(e.target.value as any)}
                              className="w-full p-2 bg-[#161b22] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                            >
                              <option value="in_stock">In Stock</option>
                              <option value="out_of_stock">Out of Stock</option>
                            </select>
                          </div>
                        </div>

                        {/* Quick Discount Presets */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 font-medium mr-1">Quick Discount:</span>
                          {['20', '25', '30', '32', '35', '40', '50'].map((pct) => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => handleEditDiscountPctChange(pct)}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                editDiscountPct === pct
                                  ? 'bg-gradient-to-r from-[#996515] to-[#d4af37] text-white shadow-xs'
                                  : 'bg-[#161b22] text-slate-300 hover:text-white border border-slate-700'
                              }`}
                            >
                              {pct}% OFF
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Homepage Bundles Pricing */}
                      <div className="p-3.5 bg-[#0d1117] rounded-2xl border border-amber-500/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                            Homepage Package Deals Pricing
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            Live Radio Choices on Storefront
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-2.5 bg-[#161b22] rounded-xl border border-slate-800 space-y-1">
                            <span className="font-bold text-slate-200 block text-[11px]">
                              1 Pack (Single Jar)
                            </span>
                            <label className="text-[10px] text-slate-400">Price (Rs.)</label>
                            <input
                              type="number"
                              value={bundle1Price}
                              onChange={(e) => setBundle1Price(e.target.value)}
                              className="w-full p-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-white font-bold"
                            />
                          </div>

                          <div className="p-2.5 bg-[#161b22] rounded-xl border border-amber-500/40 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-300 block text-[11px]">
                                2 Packs (Most Popular)
                              </span>
                            </div>
                            <label className="text-[10px] text-slate-400">Price (Rs.)</label>
                            <input
                              type="number"
                              value={bundle2Price}
                              onChange={(e) => setBundle2Price(e.target.value)}
                              className="w-full p-1.5 bg-[#0d1117] border border-amber-500/60 rounded-lg text-amber-300 font-bold"
                            />
                          </div>

                          <div className="p-2.5 bg-[#161b22] rounded-xl border border-slate-800 space-y-1">
                            <span className="font-bold text-slate-200 block text-[11px]">
                              3 Packs (Family Pack)
                            </span>
                            <label className="text-[10px] text-slate-400">Price (Rs.)</label>
                            <input
                              type="number"
                              value={bundle3Price}
                              onChange={(e) => setBundle3Price(e.target.value)}
                              className="w-full p-1.5 bg-[#0d1117] border border-slate-700 rounded-lg text-white font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description and Image */}
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">
                            Short Highlights / Tagline
                          </label>
                          <input
                            type="text"
                            value={editShortDesc}
                            onChange={(e) => setEditShortDesc(e.target.value)}
                            className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">
                            Image URL (or SVG Data URI)
                          </label>
                          <input
                            type="text"
                            value={editImageUrl}
                            onChange={(e) => setEditImageUrl(e.target.value)}
                            className="w-full p-2 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-300 text-[11px] focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end space-x-2.5">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2.5 bg-[#21262d] hover:bg-[#30363d] text-slate-300 font-semibold rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] text-white font-bold rounded-xl shadow-gold-sm hover:opacity-95 cursor-pointer flex items-center space-x-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save Changes Live to Firebase</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADD NEW PRODUCT */}
          {activeTab === 'add_product' && (
            <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 space-y-6 max-w-2xl animate-fade-in">
              <div>
                <h2 className="text-lg font-bold font-serif text-white">Publish New Product</h2>
                <p className="text-xs text-slate-400">
                  Add skincare formulations directly to live Firestore database
                </p>
              </div>

              {productSavedMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>{productSavedMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Product Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Musfira Whitening Serum"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Product Name (Urdu) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. مسفرا وائٹننگ سیرم"
                      value={pUrduName}
                      onChange={(e) => setPUrduName(e.target.value)}
                      className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white text-right font-urdu focus:outline-none focus:border-[#d4af37]"
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
                      className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Price (Rs.) *</label>
                    <input
                      type="number"
                      required
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Original Price (Rs.)</label>
                    <input
                      type="number"
                      value={pOriginalPrice}
                      onChange={(e) => setPOriginalPrice(e.target.value)}
                      className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={pImageUrl}
                    onChange={(e) => setPImageUrl(e.target.value)}
                    className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Short Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Herbal Results in 7 Days"
                    value={pShortDesc}
                    onChange={(e) => setPShortDesc(e.target.value)}
                    className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#996515] to-[#d4af37] text-white font-bold text-xs rounded-xl shadow-gold-sm transition-all cursor-pointer hover:opacity-95"
                >
                  Publish to Live Catalog & Firebase
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-serif text-white">Customer Reviews ({reviews.length})</h2>
                  <p className="text-xs text-slate-400">
                    Live customer testimonials synced to Firebase Firestore & shown on homepage
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingReview(true)}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#996515] to-[#d4af37] text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-gold-xs hover:opacity-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Customer Review</span>
                </button>
              </div>

              {/* Add Customer Review Modal */}
              {isAddingReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
                  <div className="bg-[#161b22] border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full my-8 space-y-4 text-xs text-slate-200 shadow-2xl relative animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                          <Star className="w-4 h-4 fill-amber-300" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base text-white">
                            Add Verified Customer Review
                          </h3>
                          <p className="text-[11px] text-slate-400">
                            Publishes directly to live storefront & Firebase collection
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddingReview(false)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {reviewSavedMsg && (
                      <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>{reviewSavedMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveNewReview} className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">
                            Customer / Reviewer Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ayesha Tariq"
                            value={revAuthor}
                            onChange={(e) => setRevAuthor(e.target.value)}
                            className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">City / Region *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Lahore, Karachi, Islamabad"
                            value={revCity}
                            onChange={(e) => setRevCity(e.target.value)}
                            className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>
                      </div>

                      {/* Star Rating Selection */}
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Star Rating</label>
                        <div className="flex items-center space-x-2">
                          {[5, 4, 3, 2, 1].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setRevRating(num)}
                              className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1 cursor-pointer transition-colors ${
                                revRating === num
                                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                                  : 'bg-[#0d1117] border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <span>{num}</span>
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Review comment */}
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Review Text (English / Roman Urdu) *
                        </label>
                        <textarea
                          required
                          rows={2}
                          placeholder="e.g. Meri skin pe bohot purane freckles the, Musfira cream use karne ke baad 7 dino me clear ho gaye. Highly recommended!"
                          value={revComment}
                          onChange={(e) => setRevComment(e.target.value)}
                          className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Review in Urdu (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. مسفرا کریم کے استعمال سے میری جلد بالکل نکھر گئی ہے"
                          value={revUrduComment}
                          onChange={(e) => setRevUrduComment(e.target.value)}
                          className="w-full p-2 bg-[#0d1117] border border-slate-700 rounded-xl text-white text-right font-urdu focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>

                      {/* Before / After photo attachment */}
                      <div className="p-3 bg-[#0d1117] rounded-xl border border-slate-800 space-y-2">
                        <label className="block font-semibold text-amber-400 text-[11px] uppercase tracking-wider">
                          Before & After Result Photo (Optional)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setRevBeforeAfterImg('preset_1')}
                            className={`p-2 rounded-xl border text-center cursor-pointer transition-colors ${
                              revBeforeAfterImg === 'preset_1'
                                ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold'
                                : 'border-slate-800 bg-[#161b22] text-slate-400'
                            }`}
                          >
                            <img
                              src={BrandAssets.result1}
                              alt="Result 1"
                              className="w-full h-12 object-cover rounded-lg mb-1"
                              referrerPolicy="no-referrer"
                            />
                            <span>Result 1</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRevBeforeAfterImg('preset_2')}
                            className={`p-2 rounded-xl border text-center cursor-pointer transition-colors ${
                              revBeforeAfterImg === 'preset_2'
                                ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold'
                                : 'border-slate-800 bg-[#161b22] text-slate-400'
                            }`}
                          >
                            <img
                              src={BrandAssets.result2}
                              alt="Result 2"
                              className="w-full h-12 object-cover rounded-lg mb-1"
                              referrerPolicy="no-referrer"
                            />
                            <span>Result 2</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRevBeforeAfterImg('none')}
                            className={`p-2 rounded-xl border text-center cursor-pointer flex flex-col items-center justify-center transition-colors ${
                              revBeforeAfterImg === 'none'
                                ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold'
                                : 'border-slate-800 bg-[#161b22] text-slate-400'
                            }`}
                          >
                            <span className="text-base mb-1">✕</span>
                            <span>No Photo</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end space-x-2.5">
                        <button
                          type="button"
                          onClick={() => setIsAddingReview(false)}
                          className="px-4 py-2.5 bg-[#21262d] hover:bg-[#30363d] text-slate-300 font-semibold rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] text-white font-bold rounded-xl shadow-gold-sm hover:opacity-95 cursor-pointer flex items-center space-x-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Publish Review Live</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-[#0d1117] rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px]">
                            {r.initials || r.author.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-white block leading-tight">
                              {r.author}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {r.city || 'Verified Buyer'} • <strong className="text-emerald-400 font-medium">Verified Purchase</strong>
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#d4af37] font-bold">★ {r.rating}/5</span>
                      </div>

                      <p className="text-xs text-slate-300 italic">"{r.comment}"</p>
                      {r.urduComment && (
                        <p className="font-urdu text-right text-xs text-amber-300/80">
                          "{r.urduComment}"
                        </p>
                      )}

                      {r.beforeAfterImage && (
                        <div className="pt-1">
                          <img
                            src={r.beforeAfterImage}
                            alt="Before and after transformation"
                            className="w-full h-24 object-cover rounded-xl border border-slate-700"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => deleteReview(r.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1 cursor-pointer"
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

          {/* TAB 5: MEDIA GALLERY */}
          {activeTab === 'media' && (
            <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold font-serif text-white">Media Assets</h2>
                <p className="text-xs text-slate-400">Store media and product photograph assets</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {media.map((m) => (
                  <div
                    key={m.id}
                    className="relative group rounded-2xl overflow-hidden bg-[#0d1117] border border-slate-800 aspect-square p-2 flex items-center justify-center"
                  >
                    <img
                      src={m.url}
                      alt={m.name}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                      <button
                        onClick={() => deleteMedia(m.id)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer"
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
            <div className="bg-[#161b22] p-6 rounded-3xl border border-slate-800 space-y-6 max-w-2xl animate-fade-in">
              <div>
                <h2 className="text-lg font-bold font-serif text-white">Store Settings</h2>
                <p className="text-xs text-slate-400">
                  Configure helpline phone, WhatsApp support, and delivery pricing in Firebase
                </p>
              </div>

              {settingsSavedMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>{settingsSavedMsg}</span>
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
                      className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                      }
                      className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Standard Delivery Fee (Rs.)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFee}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })
                      }
                      className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Free Delivery Order Threshold (Rs.)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.freeDeliveryThreshold}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          freeDeliveryThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Top Announcement Bar Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                    }
                    className="w-full p-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#996515] to-[#d4af37] text-white font-bold text-xs rounded-xl shadow-gold-sm transition-all cursor-pointer hover:opacity-95"
                >
                  Save Store Settings to Firebase
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: SECURITY / CHANGE PASSWORD */}
          {activeTab === 'security' && (
            <div className="bg-[#161b22] p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-lg space-y-5 animate-fade-in">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[#d4af37]">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">Change Admin Password</h3>
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
                    className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-[#d4af37] outline-none transition-colors"
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
                    className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-[#d4af37] outline-none transition-colors"
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
                    className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-[#d4af37] outline-none transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="w-full py-3 bg-gradient-to-r from-[#996515] to-[#d4af37] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-gold-sm transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer"
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
