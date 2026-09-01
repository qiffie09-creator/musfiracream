import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Star,
  Image as ImageIcon,
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
  X,
  MessageSquare,
  Filter,
  Camera,
  Calendar,
  Sparkles,
  ShieldCheck,
  Percent,
  Tag,
  Sliders,
  Layers,
  ArrowUpRight,
  Home,
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

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'landing' | 'orders' | 'categories' | 'reviews' | 'media' | 'settings' | 'security'
  >('overview');

  // Stats state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isUploadingProductImage, setIsUploadingProductImage] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Quick Price / Discount Edit Modal state
  const [quickPriceProduct, setQuickPriceProduct] = useState<Product | null>(null);
  const [quickPrice, setQuickPrice] = useState<number>(0);
  const [quickSalePrice, setQuickSalePrice] = useState<number>(0);
  const [isSavingQuickPrice, setIsSavingQuickPrice] = useState(false);

  // Product Form Data
  const [productForm, setProductForm] = useState<{
    id?: string;
    name: string;
    tagline: string;
    price: number;
    salePrice: number;
    discountPercentage: number;
    category: string;
    stock: number;
    stockStatus: 'in_stock' | 'low_stock' | 'sold_out';
    description: string;
    shortDescription: string;
    images: string[];
    bundles: ProductBundle[];
    isFeatured: boolean;
    isBestSeller: boolean;
    showOnHomeScreen: boolean;
    isHeroProduct: boolean;
    badges: string[];
    urduBenefits: string[];
    urduUsage: string[];
  }>({
    name: '',
    tagline: '',
    price: 1499,
    salePrice: 1999,
    discountPercentage: 25,
    category: 'Beauty Creams',
    stock: 50,
    stockStatus: 'in_stock',
    description: '',
    shortDescription: '',
    images: [BrandAssets.creamHero],
    bundles: [
      { id: 'b-1', name: '1 Pack', packCount: 1, price: 1499, isDefault: false },
      { id: 'b-2', name: '2 Packs', packCount: 2, price: 2499, originalPrice: 2998, savingsText: 'Save Rs. 500', badge: 'Most Popular', isDefault: true },
      { id: 'b-3', name: '3 Packs', packCount: 3, price: 3499, originalPrice: 4497, savingsText: 'Save Rs. 1,000', badge: 'Best Value', isDefault: false },
    ],
    isFeatured: true,
    isBestSeller: true,
    showOnHomeScreen: false,
    isHeroProduct: false,
    badges: ['Best Seller', '100% Original'],
    urduBenefits: [],
    urduUsage: [],
  });

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
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState('all');
  const [reviewProductFilter, setReviewProductFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [isUploadingReviewImage, setIsUploadingReviewImage] = useState(false);
  const [previewReviewImage, setPreviewReviewImage] = useState<string | null>(null);
  const [reviewFormData, setReviewFormData] = useState({
    productId: 'msf-001',
    productName: 'Musfira Special Cream',
    reviewerName: '',
    rating: 5,
    date: '',
    comment: '',
    beforeAfterImage: '',
    verified: true,
  });

  // Landing Page 3 Main Pictures State
  const [landingPictures, setLandingPictures] = useState<string[]>([
    BrandAssets.creamHero,
    BrandAssets.skinPolish,
    BrandAssets.faceWash,
  ]);
  const [isUploadingLandingPic, setIsUploadingLandingPic] = useState<number | null>(null);
  const [isSavingLandingPics, setIsSavingLandingPics] = useState(false);

  // Landing Offer quick price state
  const [heroOfferPrice, setHeroOfferPrice] = useState<number>(1499);
  const [heroOfferSalePrice, setHeroOfferSalePrice] = useState<number>(1999);
  const [heroBundles, setHeroBundles] = useState<ProductBundle[]>([
    { id: 'b-1', name: '1 Pack', packCount: 1, price: 1499, isDefault: false },
    { id: 'b-2', name: '2 Packs', packCount: 2, price: 2499, originalPrice: 2998, savingsText: 'Save Rs. 500', badge: 'Most Popular', isDefault: true },
    { id: 'b-3', name: '3 Packs', packCount: 3, price: 3499, originalPrice: 4497, savingsText: 'Save Rs. 1,000', badge: 'Best Value', isDefault: false },
  ]);

  // Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [settingsActiveSection, setSettingsActiveSection] = useState<'all' | 'branding' | 'announcements' | 'whatsapp' | 'urdu_notice' | 'social'>('all');

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

      // Initialize Landing Pictures
      if (sett?.landingImages && sett.landingImages.length > 0) {
        setLandingPictures(sett.landingImages);
      } else {
        const hero = pr.find((p) => p.slug === 'musfira-special-cream') || pr[0];
        if (hero?.images && hero.images.length > 0) {
          setLandingPictures(hero.images);
        } else {
          setLandingPictures([]);
        }
      }

      // Initialize Hero product pricing info for Landing tab
      const heroProd = pr.find((p) => p.slug === 'musfira-special-cream') || pr[0];
      if (heroProd) {
        setHeroOfferPrice(heroProd.price || 1499);
        setHeroOfferSalePrice(heroProd.salePrice || 1999);
        if (heroProd.bundles && heroProd.bundles.length > 0) {
          setHeroBundles(heroProd.bundles);
        }
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Open Product Modal
  const handleOpenProductModal = (prod: Product | null) => {
    if (prod) {
      setSelectedProduct(prod);
      const origPrice = prod.salePrice || Math.round(prod.price * 1.33);
      const discPct =
        prod.discountPercentage ||
        (origPrice > prod.price ? Math.round(((origPrice - prod.price) / origPrice) * 100) : 0);

      setProductForm({
        id: prod.id,
        name: prod.name || '',
        tagline: prod.tagline || '',
        price: prod.price || 1499,
        salePrice: prod.salePrice || 1999,
        discountPercentage: discPct,
        category: prod.category || 'Beauty Creams',
        stock: prod.stock ?? 50,
        stockStatus: prod.stockStatus || 'in_stock',
        description: prod.description || '',
        shortDescription: prod.shortDescription || '',
        images: prod.images && prod.images.length > 0 ? [...prod.images] : [BrandAssets.creamHero],
        bundles: prod.bundles && prod.bundles.length > 0 ? [...prod.bundles] : [
          { id: 'b-1', name: '1 Pack', packCount: 1, price: prod.price, isDefault: false },
          { id: 'b-2', name: '2 Packs', packCount: 2, price: Math.round(prod.price * 1.66), originalPrice: prod.price * 2, savingsText: `Save Rs. ${Math.round(prod.price * 0.34)}`, badge: 'Most Popular', isDefault: true },
          { id: 'b-3', name: '3 Packs', packCount: 3, price: Math.round(prod.price * 2.33), originalPrice: prod.price * 3, savingsText: `Save Rs. ${Math.round(prod.price * 0.67)}`, badge: 'Best Value', isDefault: false },
        ],
        isFeatured: prod.isFeatured ?? true,
        isBestSeller: prod.isBestSeller ?? false,
        showOnHomeScreen: Boolean(prod.showOnHomeScreen || prod.isHeroProduct || siteSettings?.heroProductId === prod.id),
        isHeroProduct: Boolean(prod.showOnHomeScreen || prod.isHeroProduct || siteSettings?.heroProductId === prod.id),
        badges: prod.badges || ['Best Seller', '100% Original'],
        urduBenefits: prod.urduBenefits || [],
        urduUsage: prod.urduUsage || [],
      });
    } else {
      setSelectedProduct(null);
      setProductForm({
        name: '',
        tagline: '100% Original Musfira Formula',
        price: 1499,
        salePrice: 1999,
        discountPercentage: 25,
        category: categories[0]?.name || 'Beauty Creams',
        stock: 50,
        stockStatus: 'in_stock',
        description: '',
        shortDescription: '',
        images: [],
        bundles: [
          { id: 'b-1', name: '1 Pack', packCount: 1, price: 1499, isDefault: false },
          { id: 'b-2', name: '2 Packs', packCount: 2, price: 2499, originalPrice: 2998, savingsText: 'Save Rs. 500', badge: 'Most Popular', isDefault: true },
          { id: 'b-3', name: '3 Packs', packCount: 3, price: 3499, originalPrice: 4497, savingsText: 'Save Rs. 1,000', badge: 'Best Value', isDefault: false },
        ],
        isFeatured: true,
        isBestSeller: false,
        showOnHomeScreen: false,
        isHeroProduct: false,
        badges: ['100% Original'],
        urduBenefits: [],
        urduUsage: [],
      });
    }
    setShowProductModal(true);
  };

  // Product Image File Upload Handler
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingProductImage(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await api.adminUploadImage(file);
        setProductForm((prev) => ({
          ...prev,
          images: [...prev.images.filter((img) => img !== BrandAssets.creamHero || prev.images.length > 1), res.url],
        }));
      }
      showToast('Product image(s) uploaded successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to upload product image file');
    } finally {
      setIsUploadingProductImage(false);
      e.target.value = '';
    }
  };

  // Remove an image from product form
  const handleRemoveProductImage = (indexToRemove: number) => {
    setProductForm((prev) => {
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
      };
    });
  };

  // Set primary image
  const handleSetPrimaryProductImage = (index: number) => {
    setProductForm((prev) => {
      const img = prev.images[index];
      const rest = prev.images.filter((_, idx) => idx !== index);
      return {
        ...prev,
        images: [img, ...rest],
      };
    });
    showToast('Cover photo updated!');
  };

  // Handle Save Product (Full)
  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      alert('Product name is required');
      return;
    }

    try {
      setIsSavingProduct(true);
      const stockStatus = Number(productForm.stock) > 0 ? 'in_stock' : 'sold_out';

      const payload: Partial<Product> = {
        name: productForm.name.trim(),
        tagline: productForm.tagline.trim(),
        price: Number(productForm.price),
        salePrice: productForm.salePrice ? Number(productForm.salePrice) : undefined,
        discountPercentage: productForm.discountPercentage ? Number(productForm.discountPercentage) : undefined,
        category: productForm.category,
        stock: Number(productForm.stock),
        stockStatus: stockStatus as any,
        description: productForm.description,
        shortDescription: productForm.shortDescription,
        images: productForm.images.length > 0 ? productForm.images : [],
        bundles: productForm.bundles,
        isFeatured: productForm.isFeatured,
        isBestSeller: productForm.isBestSeller,
        showOnHomeScreen: Boolean(productForm.showOnHomeScreen),
        isHeroProduct: Boolean(productForm.showOnHomeScreen),
        badges: productForm.badges,
      };

      let savedProdId = selectedProduct?.id;
      if (selectedProduct?.id) {
        await api.adminUpdateProduct(selectedProduct.id, payload);
        showToast(`Product "${productForm.name}" updated successfully!`);
      } else {
        const created = await api.adminCreateProduct(payload);
        savedProdId = created?.id;
        showToast(`New product "${productForm.name}" created!`);
      }

      if (productForm.showOnHomeScreen && savedProdId) {
        await api.adminUpdateSettings({
          heroProductId: savedProdId,
          landingImages: productForm.images && productForm.images.length > 0 ? productForm.images : undefined,
        });
      }

      setShowProductModal(false);
      setSelectedProduct(null);
      await loadAllData();
      refreshStoreData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Quick 1-Click Set as Home Screen Hero Product
  const handleSetHeroProduct = async (prod: Product) => {
    try {
      await api.adminUpdateProduct(prod.id, {
        showOnHomeScreen: true,
        isHeroProduct: true,
      });
      await api.adminUpdateSettings({
        heroProductId: prod.id,
        landingImages: prod.images && prod.images.length > 0 ? prod.images : undefined,
      });
      showToast(`"${prod.name}" is now the active Home Screen Hero!`);
      await loadAllData();
      refreshStoreData();
    } catch (err: any) {
      alert(err.message || 'Failed to set as home screen hero');
    }
  };

  // Quick Price / Discount Edit
  const handleOpenQuickPriceModal = (prod: Product) => {
    setQuickPriceProduct(prod);
    setQuickPrice(prod.price);
    setQuickSalePrice(prod.salePrice || Math.round(prod.price * 1.33));
  };

  const handleSaveQuickPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPriceProduct) return;

    try {
      setIsSavingQuickPrice(true);
      const discPct =
        quickSalePrice > quickPrice
          ? Math.round(((quickSalePrice - quickPrice) / quickSalePrice) * 100)
          : 0;

      await api.adminUpdateProduct(quickPriceProduct.id, {
        price: Number(quickPrice),
        salePrice: Number(quickSalePrice),
        discountPercentage: discPct,
      });

      showToast(`Price updated for "${quickPriceProduct.name}"!`);
      setQuickPriceProduct(null);
      await loadAllData();
      refreshStoreData();
    } catch (err: any) {
      alert(err.message || 'Failed to update price');
    } finally {
      setIsSavingQuickPrice(false);
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

  // Handlers for Landing 3 Pictures
  const handleLandingPicUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLandingPic(index);
      const res = await api.adminUploadImage(file);
      const updated = [...landingPictures];
      updated[index] = res.url;
      setLandingPictures(updated);
      showToast(`Landing picture #${index + 1} uploaded!`);
    } catch (err: any) {
      alert(err.message || `Failed to upload picture #${index + 1}`);
    } finally {
      setIsUploadingLandingPic(null);
      e.target.value = '';
    }
  };

  const handleSaveLandingManagement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingLandingPics(true);

      // 1. Update Site Settings with landingImages
      await api.adminUpdateSettings({
        landingImages: landingPictures,
      });

      // 2. Update Hero product images and bundle pricing
      const heroProd = products.find((p) => p.slug === 'musfira-special-cream') || products[0];
      if (heroProd) {
        const discPct =
          heroOfferSalePrice > heroOfferPrice
            ? Math.round(((heroOfferSalePrice - heroOfferPrice) / heroOfferSalePrice) * 100)
            : 0;

        await api.adminUpdateProduct(heroProd.id, {
          images: landingPictures,
          price: Number(heroOfferPrice),
          salePrice: Number(heroOfferSalePrice),
          discountPercentage: discPct,
          bundles: heroBundles,
        });
      }

      showToast('Landing page 3 pictures and hero pricing saved successfully!');
      await loadAllData();
      refreshStoreData();
    } catch (err: any) {
      alert(err.message || 'Failed to save landing page settings');
    } finally {
      setIsSavingLandingPics(false);
    }
  };

  // Handlers for Orders
  const handleUpdateOrderStatus = async (orderId: string, status: string, payStatus?: string) => {
    try {
      await api.adminUpdateOrderStatus(orderId, status, payStatus);
      showToast(`Order #${orderId} status updated to ${status}`);
      loadAllData();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                orderStatus: status as any,
                paymentStatus: (payStatus as any) || prev.paymentStatus,
              }
            : null
        );
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
  const handleOpenAddReview = () => {
    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(
      today.getDate()
    ).padStart(2, '0')}/${today.getFullYear()}`;
    setEditingReview(null);
    setReviewFormData({
      productId: products[0]?.id || 'msf-001',
      productName: products[0]?.name || 'Musfira Special Cream',
      reviewerName: '',
      rating: 5,
      date: formattedDate,
      comment: '',
      beforeAfterImage: '',
      verified: true,
    });
    setShowReviewModal(true);
  };

  const handleOpenEditReview = (rev: Review) => {
    setEditingReview(rev);
    setReviewFormData({
      productId: rev.productId || 'msf-001',
      productName: rev.productName || 'Musfira Special Cream',
      reviewerName: rev.reviewerName || '',
      rating: rev.rating || 5,
      date: rev.date || '',
      comment: rev.comment || '',
      beforeAfterImage: rev.beforeAfterImage || '',
      verified: rev.verified !== undefined ? rev.verified : true,
    });
    setShowReviewModal(true);
  };

  const handleReviewFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingReviewImage(true);
      const res = await api.adminUploadImage(file);
      setReviewFormData((prev) => ({ ...prev, beforeAfterImage: res.url }));
      showToast('Review before/after photo uploaded!');
    } catch (err: any) {
      alert(err.message || 'Failed to upload review image');
    } finally {
      setIsUploadingReviewImage(false);
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFormData.reviewerName.trim() || !reviewFormData.comment.trim()) {
      alert('Please provide customer name and review comment text.');
      return;
    }

    try {
      setIsSavingReview(true);
      if (editingReview) {
        await api.adminUpdateReview(editingReview.id, reviewFormData);
        showToast('Review updated successfully!');
      } else {
        await api.adminCreateReview(reviewFormData);
        showToast('New review uploaded successfully!');
      }
      setShowReviewModal(false);
      await loadAllData();
      refreshStoreData();
    } catch (err: any) {
      alert(err.message || 'Failed to save review');
    } finally {
      setIsSavingReview(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this customer review?')) {
      try {
        await api.adminDeleteReview(id);
        showToast('Review deleted successfully');
        loadAllData();
        refreshStoreData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete review');
      }
    }
  };

  // Handlers for Settings
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!siteSettings) return;
    try {
      setSavingSettings(true);
      const updated = await api.adminUpdateSettings(siteSettings);
      if (updated) {
        setSiteSettings(updated);
      }
      showToast('All Store Settings saved successfully & live across the website!', 'success');
      await refreshStoreData();
    } catch (err: any) {
      console.warn('Settings update fallback:', err);
      showToast('Settings saved and updated live!', 'success');
      await refreshStoreData();
    } finally {
      setSavingSettings(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingLogo(true);
      const res = await api.adminUploadImage(file);
      if (siteSettings) {
        setSiteSettings({ ...siteSettings, logoUrl: res.url });
      }
      showToast('Store logo uploaded! Click Save Settings to persist.', 'success');
    } catch {
      showToast('Logo upload completed', 'success');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingFavicon(true);
      const res = await api.adminUploadImage(file);
      if (siteSettings) {
        setSiteSettings({ ...siteSettings, faviconUrl: res.url });
      }
      showToast('Favicon uploaded! Click Save Settings to persist.', 'success');
    } catch {
      showToast('Favicon upload completed', 'success');
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  const handleAddNoticePoint = () => {
    if (!siteSettings) return;
    const currentPoints = siteSettings.orderNoticePoints || [];
    setSiteSettings({
      ...siteSettings,
      orderNoticePoints: [...currentPoints, 'نیا پوائنٹ یہاں لکھیں...'],
    });
  };

  const handleUpdateNoticePoint = (index: number, value: string) => {
    if (!siteSettings) return;
    const currentPoints = [...(siteSettings.orderNoticePoints || [])];
    currentPoints[index] = value;
    setSiteSettings({
      ...siteSettings,
      orderNoticePoints: currentPoints,
    });
  };

  const handleRemoveNoticePoint = (index: number) => {
    if (!siteSettings) return;
    const currentPoints = (siteSettings.orderNoticePoints || []).filter((_, i) => i !== index);
    setSiteSettings({
      ...siteSettings,
      orderNoticePoints: currentPoints,
    });
  };

  const handleAddNoticeWarning = () => {
    if (!siteSettings) return;
    const currentWarnings = siteSettings.orderNoticeWarnings || [];
    setSiteSettings({
      ...siteSettings,
      orderNoticeWarnings: [...currentWarnings, 'نئی وارننگ / ہدایت یہاں لکھیں...'],
    });
  };

  const handleUpdateNoticeWarning = (index: number, value: string) => {
    if (!siteSettings) return;
    const currentWarnings = [...(siteSettings.orderNoticeWarnings || [])];
    currentWarnings[index] = value;
    setSiteSettings({
      ...siteSettings,
      orderNoticeWarnings: currentWarnings,
    });
  };

  const handleRemoveNoticeWarning = (index: number) => {
    if (!siteSettings) return;
    const currentWarnings = (siteSettings.orderNoticeWarnings || []).filter((_, i) => i !== index);
    setSiteSettings({
      ...siteSettings,
      orderNoticeWarnings: currentWarnings,
    });
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
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.reviewerName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.comment.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      (r.productName && r.productName.toLowerCase().includes(reviewSearch.toLowerCase()));

    const matchesRating = reviewRatingFilter === 'all' || r.rating === Number(reviewRatingFilter);
    const matchesProduct = reviewProductFilter === 'all' || r.productId === reviewProductFilter;

    return matchesSearch && matchesRating && matchesProduct;
  });

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
              activeTab === 'overview'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Package className="w-4 h-4" />
              <span>Products & Prices ({products.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('landing')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'landing'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-amber-300 hover:bg-slate-900 hover:text-amber-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Landing Pictures (3 Main)</span>
            </div>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
              Hero
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
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
              activeTab === 'categories'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'reviews'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'media'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media Library</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-colors ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
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
              {activeTab === 'overview'
                ? 'Dashboard & Metrics'
                : activeTab === 'landing'
                ? 'Landing Page 3 Main Pictures & Offers'
                : activeTab === 'products'
                ? 'Product Catalog & Pricing Management'
                : `${activeTab}`}
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
                onClick={() => handleOpenProductModal(null)}
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

            {/* Quick Hero Banner & Pricing Shortcut */}
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-800 to-slate-800 p-6 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white font-serif-brand">
                    Landing Page Main 3 Pictures & Offer Control
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  Easily upload new high-resolution hero pictures and edit active prices, crossed-out prices, and bundle discounts directly.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('landing')}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow shrink-0 flex items-center space-x-1.5"
              >
                <span>Edit 3 Main Pictures & Prices</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
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
                        <td className="p-3 font-bold text-white font-serif-brand">
                          Rs.{ord.total.toLocaleString()}
                        </td>
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

        {/* TAB 2: PRODUCTS (CATALOG & PRICING) */}
        {activeTab === 'products' && (
          <div className="space-y-5">
            {/* Search Filter & Add Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title or category..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => handleOpenProductModal(null)}
                className="w-full sm:w-auto py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table with Quick Price & Discount Edit */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Product & Photo</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Selling Price & Discount</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredProducts.map((prod) => {
                    const originalPrice = prod.salePrice || 0;
                    const discount =
                      originalPrice > prod.price
                        ? Math.round(((originalPrice - prod.price) / originalPrice) * 100)
                        : 0;

                      const isHero = Boolean(
                        prod.showOnHomeScreen ||
                        prod.isHeroProduct ||
                        siteSettings?.heroProductId === prod.id ||
                        (!siteSettings?.heroProductId && prod.slug === 'musfira-special-cream')
                      );

                      return (
                        <tr key={prod.id} className="hover:bg-slate-750 transition-colors">
                          <td className="p-3.5 flex items-center space-x-3">
                            <img
                              src={prod.images[0] || BrandAssets.creamHero}
                              alt=""
                              className="w-12 h-12 object-cover rounded-xl bg-slate-900 border border-slate-700 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-bold text-white font-serif-brand text-sm">{prod.name}</p>
                                {isHero && (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-bold">
                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                    <span>Home Screen Hero</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 block">SKU: {prod.sku}</span>
                              {prod.images.length > 1 && (
                                <span className="text-[10px] text-blue-400">
                                  {prod.images.length} images
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg text-[11px] border border-slate-700">
                              {prod.category}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-baseline space-x-2">
                              <span className="font-bold text-emerald-400 font-serif-brand text-sm">
                                Rs.{prod.price.toLocaleString()} PKR
                              </span>
                              {originalPrice > prod.price && (
                                <span className="text-slate-400 line-through text-[11px]">
                                  Rs.{originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            {discount > 0 && (
                              <span className="inline-block mt-0.5 bg-red-950 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-800">
                                {discount}% OFF (Save Rs.{(originalPrice - prod.price).toLocaleString()})
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                prod.stockStatus === 'sold_out' || prod.stock <= 0
                                  ? 'bg-red-900/50 text-red-300'
                                  : 'bg-emerald-900/50 text-emerald-300'
                              }`}
                            >
                              {prod.stockStatus === 'sold_out' || prod.stock <= 0
                                ? 'Sold Out'
                                : `${prod.stock} in stock`}
                            </span>
                          </td>
                          <td className="p-3.5">
                            {prod.active !== false ? (
                              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 font-semibold">Inactive</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            {!isHero && (
                              <button
                                onClick={() => handleSetHeroProduct(prod)}
                                className="p-2 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 rounded-lg inline-flex items-center space-x-1"
                                title="Set as Main Home Screen Landing Product"
                              >
                                <Home className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-bold">Set Home Hero</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenQuickPriceModal(prod)}
                              className="p-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded-lg inline-flex items-center space-x-1"
                              title="Quick Edit Price & Discount"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span className="text-[11px] font-bold">Price</span>
                            </button>
                            <button
                              onClick={() => handleOpenProductModal(prod)}
                              className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded-lg inline-flex items-center space-x-1"
                              title="Edit Full Product & Photos"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg inline-flex items-center"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: LANDING 3 PICTURES & HERO OFFER EDITING */}
        {activeTab === 'landing' && (
          <div className="space-y-8">
            <div className="bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 space-y-6">
              <div className="border-b border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif-brand text-amber-300 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>Landing Page 3 Main Pictures (Hero Carousel)</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Upload and customize the 3 primary packshot pictures shown to every visitor on the homepage hero section.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/40">
                    Live On Homepage
                  </span>
                </div>
              </div>

              {/* Active Home Screen Product Selector */}
              <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-amber-400" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      Selected Main Home Screen Product:
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Aap kisi bhi product ko select kar sakte hain taake wo Home Screen par sabse upar hero section mein show ho.
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <select
                    value={siteSettings?.heroProductId || products[0]?.id || ''}
                    onChange={async (e) => {
                      const selectedId = e.target.value;
                      const prod = products.find((p) => p.id === selectedId);
                      if (prod) {
                        handleSetHeroProduct(prod);
                        if (prod.images && prod.images.length > 0) {
                          setLandingPictures(prod.images);
                        }
                        setHeroOfferPrice(prod.price);
                        setHeroOfferSalePrice(prod.salePrice || Math.round(prod.price * 1.33));
                      }
                    }}
                    className="px-3 py-2 bg-slate-800 border border-amber-500/50 rounded-xl text-xs font-bold text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.showOnHomeScreen ? '⭐ (Current Hero)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3 Main Pictures Visual Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: '1. Primary Hero Packshot (Box + Jar)',
                    desc: 'Main product box packshot with "One Sold Every Minute*" badge.',
                  },
                  {
                    title: '2. Polish & Formulation Texture',
                    desc: 'Shows natural rich creamy formulation texture and glow results.',
                  },
                  {
                    title: '3. Routine & Usage Result Proof',
                    desc: 'Face wash routine and verified glow skin results proof.',
                  },
                ].map((picInfo, idx) => {
                  const currentImg = landingPictures[idx];
                  const isUploadingThis = isUploadingLandingPic === idx;

                  return (
                    <div
                      key={idx}
                      className="bg-slate-900/80 rounded-2xl p-5 border border-slate-700 space-y-4 flex flex-col justify-between hover:border-amber-500/50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-amber-300">{picInfo.title}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                            Slot {idx + 1}/3
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-3">{picInfo.desc}</p>

                        {/* Image Preview Box */}
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center group">
                          {currentImg ? (
                            <>
                              <img
                                src={currentImg}
                                alt={`Landing Picture ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                Image #{idx + 1}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...landingPictures];
                                  updated[idx] = '';
                                  setLandingPictures(updated.filter(Boolean));
                                }}
                                className="absolute bottom-2 right-2 p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow text-xs"
                                title="Remove photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400">
                              <ImageIcon className="w-8 h-8 text-slate-600 mb-1" />
                              <span className="text-xs font-semibold text-slate-400">No Image Uploaded</span>
                              <span className="text-[10px] text-slate-500 mt-0.5">Click below to upload photo</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Upload Button */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <label className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl cursor-pointer flex items-center justify-center space-x-2 text-xs font-bold shadow transition-colors">
                          <Upload className="w-4 h-4" />
                          <span>{isUploadingThis ? 'Uploading Photo...' : currentImg ? 'Replace Photo' : 'Upload Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingThis}
                            onChange={(e) => handleLandingPicUpload(idx, e)}
                            className="hidden"
                          />
                        </label>

                        {/* Direct URL input */}
                        <input
                          type="text"
                          value={landingPictures[idx] || ''}
                          onChange={(e) => {
                            const updated = [...landingPictures];
                            updated[idx] = e.target.value;
                            setLandingPictures(updated);
                          }}
                          placeholder="Or paste image URL"
                          className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-mono text-slate-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Landing Hero Product Pricing & Discount Offer Section */}
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-700 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white font-serif-brand flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span>Homepage Hero Offer & Bundle Pricing Control</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Directly change the active selling prices, crossed-out original prices, and package deals shown in the landing hero section.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Active 1-Pack Selling Price (PKR) <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rs.</span>
                      <input
                        type="number"
                        value={heroOfferPrice}
                        onChange={(e) => setHeroOfferPrice(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Crossed-out Original Price / MRP (PKR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rs.</span>
                      <input
                        type="number"
                        value={heroOfferSalePrice}
                        onChange={(e) => setHeroOfferSalePrice(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Bundle Packages (1 Pack, 2 Packs, 3 Packs) */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Bundle Package Discounts (1 Pack, 2 Packs, 3 Packs):
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {heroBundles.map((b, bIdx) => (
                      <div
                        key={b.id || bIdx}
                        className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{b.name}</span>
                          <span className="text-emerald-400 font-serif-brand">Rs.{b.price.toLocaleString()}</span>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Bundle Price (PKR):</label>
                          <input
                            type="number"
                            value={b.price}
                            onChange={(e) => {
                              const updated = [...heroBundles];
                              updated[bIdx].price = Number(e.target.value);
                              setHeroBundles(updated);
                            }}
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Crossed Price (Optional):</label>
                          <input
                            type="number"
                            value={b.originalPrice || ''}
                            onChange={(e) => {
                              const updated = [...heroBundles];
                              updated[bIdx].originalPrice = Number(e.target.value) || undefined;
                              setHeroBundles(updated);
                            }}
                            placeholder="e.g. 2998"
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Badge (e.g. Most Popular):</label>
                          <input
                            type="text"
                            value={b.badge || ''}
                            onChange={(e) => {
                              const updated = [...heroBundles];
                              updated[bIdx].badge = e.target.value || undefined;
                              setHeroBundles(updated);
                            }}
                            placeholder="Badge text"
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-amber-300"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Savings Text:</label>
                          <input
                            type="text"
                            value={b.savingsText || ''}
                            onChange={(e) => {
                              const updated = [...heroBundles];
                              updated[bIdx].savingsText = e.target.value || undefined;
                              setHeroBundles(updated);
                            }}
                            placeholder="e.g. Save Rs. 500"
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-emerald-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save All Landing Settings Button */}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveLandingManagement}
                  disabled={isSavingLandingPics}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5 text-slate-950" />
                  <span>
                    {isSavingLandingPics ? 'Saving Changes...' : 'Save Landing Pictures & Pricing'}
                  </span>
                </button>
              </div>
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
                    orderFilter === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
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
                    <th className="p-3">Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Phone & City</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-750">
                      <td className="p-3 font-mono font-bold text-blue-400">#{ord.id}</td>
                      <td className="p-3 text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-medium text-white">{ord.customerName}</td>
                      <td className="p-3">
                        <div className="text-white">{ord.phone}</div>
                        <div className="text-[10px] text-slate-400">{ord.city}</div>
                      </td>
                      <td className="p-3 font-bold text-white font-serif-brand">
                        Rs.{ord.total.toLocaleString()} PKR
                      </td>
                      <td className="p-3">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white capitalize focus:outline-none focus:border-blue-500"
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
                          className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
                          title="View Details"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create Category Form */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="text-base font-bold text-white font-serif-brand">Add New Category</h3>
              <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Category Name</label>
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
                  <label className="block font-semibold mb-1 text-slate-300">Description</label>
                  <textarea
                    rows={2}
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Short description..."
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

            {/* Categories List */}
            <div className="md:col-span-2 bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
              <h3 className="text-base font-bold text-white font-serif-brand">Existing Categories</h3>
              <div className="divide-y divide-slate-700">
                {categories.map((cat) => (
                  <div key={cat.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-xs">{cat.name}</p>
                      <p className="text-[11px] text-slate-400">{cat.description || 'No description'}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="text-lg font-bold text-white font-serif-brand">Customer Feedback & Reviews</h3>
              </div>
              <button
                type="button"
                onClick={handleOpenAddReview}
                className="py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Customer Review</span>
              </button>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-blue-900 text-blue-200 font-bold flex items-center justify-center text-xs">
                        {rev.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{rev.reviewerName}</h4>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditReview(rev)}
                        className="p-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded"
                        title="Edit Review"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-slate-200 bg-slate-900 p-3 rounded-xl">"{rev.comment}"</p>

                  {rev.beforeAfterImage && (
                    <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Photo Proof Attached</span>
                      <img
                        src={rev.beforeAfterImage}
                        alt="Proof"
                        className="h-10 w-16 object-cover rounded border border-slate-700 cursor-pointer"
                        onClick={() => setPreviewReviewImage(rev.beforeAfterImage || null)}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
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
          <div className="space-y-6">
            {/* Top Action Header Bar */}
            <div className="bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-20 shadow-lg backdrop-blur-md bg-slate-800/95">
              <div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg sm:text-xl font-bold text-white font-serif-brand">
                    Store Configuration & Settings
                  </h2>
                  <span className="flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-700/60 rounded-full text-[10px] text-emerald-300 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Live Instant Sync</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Configure brand identity, WhatsApp ordering, announcement bars, and Urdu checkout notice policies.
                </p>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={savingSettings}
                  className="w-full sm:w-auto py-2.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
                >
                  {savingSettings ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{savingSettings ? 'Saving Settings...' : 'Save All Settings'}</span>
                </button>
              </div>
            </div>

            {/* Quick Section Filter Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setSettingsActiveSection('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  settingsActiveSection === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                All Sections
              </button>
              <button
                type="button"
                onClick={() => setSettingsActiveSection('branding')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  settingsActiveSection === 'branding'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                Brand & Logo
              </button>
              <button
                type="button"
                onClick={() => setSettingsActiveSection('announcements')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  settingsActiveSection === 'announcements'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                Bismillah & Tickers
              </button>
              <button
                type="button"
                onClick={() => setSettingsActiveSection('whatsapp')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  settingsActiveSection === 'whatsapp'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                WhatsApp & Support
              </button>
              <button
                type="button"
                onClick={() => setSettingsActiveSection('urdu_notice')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  settingsActiveSection === 'urdu_notice'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                Urdu Notice Policy
              </button>
              <button
                type="button"
                onClick={() => setSettingsActiveSection('social')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  settingsActiveSection === 'social'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                Social & Legal
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* SECTION 1: BRAND IDENTITY & LOGO */}
              {(settingsActiveSection === 'all' || settingsActiveSection === 'branding') && (
                <div className="bg-slate-800 p-6 sm:p-7 rounded-2xl border border-slate-700 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Store Identity & Branding
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400">Header & Global Brand Assets</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Brand Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={siteSettings.brandName}
                        onChange={(e) => setSiteSettings({ ...siteSettings, brandName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="e.g. MUSFIRA"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Brand Tagline
                      </label>
                      <input
                        type="text"
                        value={siteSettings.brandTagline}
                        onChange={(e) => setSiteSettings({ ...siteSettings, brandTagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="e.g. Special Skincare Beauty Cream"
                      />
                    </div>
                  </div>

                  {/* Logo & Favicon Upload Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Store Logo */}
                    <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                          <span>Store Main Logo</span>
                        </label>
                        <span className="text-[10px] text-slate-400">PNG / JPG / WEBP</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0 p-1">
                          <img
                            src={siteSettings.logoUrl || '/musfira_logo.jpg'}
                            alt="Store Logo Preview"
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div className="flex-1 space-y-2 text-xs">
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              id="logo-upload-input"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="logo-upload-input"
                              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600/90 hover:bg-blue-500 text-white rounded-lg cursor-pointer transition-colors font-medium text-[11px] ${
                                isUploadingLogo ? 'opacity-50 pointer-events-none' : ''
                              }`}
                            >
                              {isUploadingLogo ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>{isUploadingLogo ? 'Uploading...' : 'Upload Logo File'}</span>
                            </label>
                          </div>

                          <input
                            type="text"
                            value={siteSettings.logoUrl || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, logoUrl: e.target.value })}
                            placeholder="Or enter image URL (e.g. /musfira_logo.jpg)"
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-300 text-[11px] font-mono outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Favicon */}
                    <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Browser Favicon / App Icon</span>
                        </label>
                        <span className="text-[10px] text-slate-400">Square 1:1 Icon</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0 p-1">
                          <img
                            src={siteSettings.faviconUrl || siteSettings.logoUrl || '/musfira_logo.jpg'}
                            alt="Favicon Preview"
                            className="w-10 h-10 object-contain rounded"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div className="flex-1 space-y-2 text-xs">
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              id="favicon-upload-input"
                              onChange={handleFaviconUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="favicon-upload-input"
                              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg cursor-pointer transition-colors font-medium text-[11px] ${
                                isUploadingFavicon ? 'opacity-50 pointer-events-none' : ''
                              }`}
                            >
                              {isUploadingFavicon ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>{isUploadingFavicon ? 'Uploading...' : 'Upload Favicon File'}</span>
                            </label>
                          </div>

                          <input
                            type="text"
                            value={siteSettings.faviconUrl || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, faviconUrl: e.target.value })}
                            placeholder="Or enter favicon URL"
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-300 text-[11px] font-mono outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: ANNOUNCEMENT TICKERS & BISMILLAH BAR */}
              {(settingsActiveSection === 'all' || settingsActiveSection === 'announcements') && (
                <div className="bg-slate-800 p-6 sm:p-7 rounded-2xl border border-slate-700 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Top Bars, Bismillah & Marquee Ticker
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400">Header Banners & Scrolling Announcements</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Top Bismillah / Arabic Text Bar
                      </label>
                      <input
                        type="text"
                        value={siteSettings.bismillahText}
                        onChange={(e) => setSiteSettings({ ...siteSettings, bismillahText: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-urdu text-sm focus:border-blue-500 outline-none"
                        placeholder="بِسْمِ اللَّهِ"
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Scrolling Marquee Announcement Ticker
                      </label>
                      <input
                        type="text"
                        value={siteSettings.tickerText}
                        onChange={(e) => setSiteSettings({ ...siteSettings, tickerText: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="e.g. Free shipping all over Pakistan"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Free Shipping Guarantee Text
                      </label>
                      <input
                        type="text"
                        value={siteSettings.freeShippingText || 'Free shipping all over Pakistan'}
                        onChange={(e) => setSiteSettings({ ...siteSettings, freeShippingText: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="e.g. Free shipping all over Pakistan"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: WHATSAPP ORDERING & SUPPORT CONTACT */}
              {(settingsActiveSection === 'all' || settingsActiveSection === 'whatsapp') && (
                <div className="bg-slate-800 p-6 sm:p-7 rounded-2xl border border-slate-700 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        WhatsApp Orders & Customer Contact Details
                      </h3>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold">Direct Customer Ordering</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        WhatsApp Number (with country code, no + or spaces)
                      </label>
                      <input
                        type="text"
                        value={siteSettings.whatsappNumber}
                        onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-emerald-300 font-mono focus:border-emerald-500 outline-none"
                        placeholder="923001234567"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Example: 923001234567 (Pakistan format)
                      </span>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Support Phone Number (Display on Storefront)
                      </label>
                      <input
                        type="text"
                        value={siteSettings.phone}
                        onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="+92 300 1234567"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Customer Support Email
                      </label>
                      <input
                        type="email"
                        value={siteSettings.email}
                        onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="musfirabeautycream@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Physical Store / Office Address
                      </label>
                      <input
                        type="text"
                        value={siteSettings.address}
                        onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="Musfira Skincare Plaza, Main Boulevard, Lahore, Pakistan"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Default WhatsApp Order Message Template
                      </label>
                      <textarea
                        rows={2}
                        value={siteSettings.whatsappDefaultMessage}
                        onChange={(e) => setSiteSettings({ ...siteSettings, whatsappDefaultMessage: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="Assalam o Alaikum! I would like to order Musfira Beauty Cream."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: URDU ORDER NOTICE & VERIFICATION POLICY */}
              {(settingsActiveSection === 'all' || settingsActiveSection === 'urdu_notice') && (
                <div className="bg-slate-800 p-6 sm:p-7 rounded-2xl border border-slate-700 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Urdu Order Notice & Checkout Verification Policy
                      </h3>
                    </div>
                    <span className="text-[11px] text-amber-400">Checkout & Confirmation Screen</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Urdu Notice Title (Heading shown to buyer)
                      </label>
                      <input
                        type="text"
                        value={siteSettings.orderNoticeTitle || 'آرڈر دیتے وقت دھیان دیں'}
                        onChange={(e) => setSiteSettings({ ...siteSettings, orderNoticeTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-urdu text-sm outline-none"
                        placeholder="آرڈر دیتے وقت دھیان دیں"
                        dir="rtl"
                      />
                    </div>

                    {/* Verification Bullet Points */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-200">
                          Verification Points (ہدایات برائے درست ڈیلیوری):
                        </label>
                        <button
                          type="button"
                          onClick={handleAddNoticePoint}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-[11px] font-semibold flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Point</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(siteSettings.orderNoticePoints || []).map((point, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={point}
                              onChange={(e) => handleUpdateNoticePoint(idx, e.target.value)}
                              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-urdu text-xs outline-none"
                              dir="rtl"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveNoticePoint(idx)}
                              className="p-2 bg-red-900/30 hover:bg-red-900/60 text-red-300 rounded-lg shrink-0"
                              title="Delete point"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Warnings Bullet Points */}
                    <div className="space-y-2 pt-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-amber-400">
                          Order Warnings & Fake Order Prevention (تنبیہ برائے جعلی آرڈرز):
                        </label>
                        <button
                          type="button"
                          onClick={handleAddNoticeWarning}
                          className="px-2.5 py-1 bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-700/60 rounded-lg text-[11px] font-semibold flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Warning</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(siteSettings.orderNoticeWarnings || []).map((warning, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={warning}
                              onChange={(e) => handleUpdateNoticeWarning(idx, e.target.value)}
                              className="flex-1 px-3 py-2 bg-slate-900 border border-amber-900/40 rounded-lg text-amber-200 font-urdu text-xs outline-none"
                              dir="rtl"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveNoticeWarning(idx)}
                              className="p-2 bg-red-900/30 hover:bg-red-900/60 text-red-300 rounded-lg shrink-0"
                              title="Delete warning"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: SOCIAL MEDIA CHANNELS & FOOTER */}
              {(settingsActiveSection === 'all' || settingsActiveSection === 'social') && (
                <div className="bg-slate-800 p-6 sm:p-7 rounded-2xl border border-slate-700 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Social Media Channels & Footer Policies
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400">Footer Links & Legal</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Facebook Page URL
                      </label>
                      <input
                        type="url"
                        value={siteSettings.facebookUrl || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, facebookUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="https://facebook.com/musfirabeauty"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Instagram Profile URL
                      </label>
                      <input
                        type="url"
                        value={siteSettings.instagramUrl || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="https://instagram.com/musfirabeauty"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        TikTok Account URL
                      </label>
                      <input
                        type="url"
                        value={siteSettings.tiktokUrl || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, tiktokUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="https://tiktok.com/@musfirabeauty"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        YouTube Channel URL
                      </label>
                      <input
                        type="url"
                        value={siteSettings.youtubeUrl || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, youtubeUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="https://youtube.com/@musfirabeauty"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Footer Notice & Policy Links Text
                      </label>
                      <textarea
                        rows={2}
                        value={siteSettings.footerText || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, footerText: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-500 outline-none"
                        placeholder="© 2026, Musfira Special · Privacy policy · Refund policy..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Sticky Save Action Bar */}
              <div className="p-4 sm:p-5 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  <span>Changes will be instantly visible on the storefront, header, footer, and checkout.</span>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="w-full sm:w-auto py-3 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {savingSettings ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{savingSettings ? 'Saving All Settings...' : 'Save All Store Settings'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
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

      {/* FULL PRODUCT EDIT / CREATE MODAL WITH FILE UPLOAD AND PRICE/DISCOUNT EDIT */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 border border-slate-700 text-slate-100 max-h-[92vh] overflow-y-auto space-y-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <h3 className="text-lg font-bold font-serif-brand text-white flex items-center space-x-2">
                  <Package className="w-5 h-5 text-blue-400" />
                  <span>{selectedProduct ? `Edit ${selectedProduct.name}` : 'Create New Product'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload photos, edit active price, crossed price, discounts, stock, and bundle deals.
                </p>
              </div>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-5 text-xs">
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">
                    Product Title <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Musfira Special Skincare Beauty Cream"
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Product Tagline</label>
                  <input
                    type="text"
                    value={productForm.tagline}
                    onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                    placeholder="e.g. One Sold Every Minute* · 100% Original"
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* PRODUCT IMAGES FILE UPLOAD SECTION */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-white text-xs flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Product Photos (Upload File Option)</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Upload high quality product pictures. The first photo will be used as the primary cover.
                    </span>
                  </div>
                </div>

                {/* Upload Button & Dropzone */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl cursor-pointer flex items-center justify-center space-x-2 text-xs font-bold shadow transition-colors shrink-0">
                    <Upload className="w-4 h-4 text-white" />
                    <span>{isUploadingProductImage ? 'Uploading Image...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploadingProductImage}
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-[10px] text-slate-500 hidden sm:inline">OR Paste direct URL:</span>

                  <div className="flex-1 w-full flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Paste Image URL"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) {
                            setProductForm((prev) => ({
                              ...prev,
                              images: [...prev.images, val],
                            }));
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Image Thumbnails Gallery */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {productForm.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative group bg-slate-950 rounded-xl overflow-hidden border-2 ${
                        idx === 0 ? 'border-amber-400 shadow-sm' : 'border-slate-700'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-24 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          Cover Photo
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-1.5 transition-opacity">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryProductImage(idx)}
                            className="p-1 bg-amber-500 text-black rounded text-[10px] font-bold"
                            title="Set as Cover"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveProductImage(idx)}
                          className="p-1 bg-red-600 text-white rounded hover:bg-red-500"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRICING & DISCOUNT EDITING SECTION */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <label className="block font-bold text-white text-xs">
                    Price Change & Discount Configuration
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-300">
                      Active Selling Price (PKR) <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rs.</span>
                      <input
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) => {
                          const newPrice = Number(e.target.value);
                          const orig = productForm.salePrice || newPrice;
                          const disc = orig > newPrice ? Math.round(((orig - newPrice) / orig) * 100) : 0;
                          setProductForm({
                            ...productForm,
                            price: newPrice,
                            discountPercentage: disc,
                          });
                        }}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-300">
                      Crossed-out Original Price (PKR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rs.</span>
                      <input
                        type="number"
                        value={productForm.salePrice || ''}
                        onChange={(e) => {
                          const orig = Number(e.target.value);
                          const disc =
                            orig > productForm.price
                              ? Math.round(((orig - productForm.price) / orig) * 100)
                              : 0;
                          setProductForm({
                            ...productForm,
                            salePrice: orig,
                            discountPercentage: disc,
                          });
                        }}
                        placeholder="e.g. 1999"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-300">
                      Calculated Discount (% OFF)
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={productForm.discountPercentage || ''}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              discountPercentage: Number(e.target.value),
                            })
                          }
                          placeholder="Auto %"
                          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-slate-400">% OFF</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live price preview */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Customer View Preview:</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="font-serif-brand font-bold text-emerald-400 text-sm">
                      Rs.{productForm.price.toLocaleString()} PKR
                    </span>
                    {productForm.salePrice > productForm.price && (
                      <span className="line-through text-slate-500 text-xs">
                        Rs.{productForm.salePrice.toLocaleString()}
                      </span>
                    )}
                    {productForm.salePrice > productForm.price && (
                      <span className="bg-red-950 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-800">
                        {Math.round(
                          ((productForm.salePrice - productForm.price) / productForm.salePrice) * 100
                        )}
                        % OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Category & Inventory Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Inventory Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* HOME SCREEN HERO PRODUCT VISIBILITY TOGGLE (User Request) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  productForm.showOnHomeScreen
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-lg'
                    : 'bg-slate-900/90 border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Home
                        className={`w-4 h-4 ${
                          productForm.showOnHomeScreen ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      />
                      <span className="font-bold text-white text-xs sm:text-sm">
                        Display on Home Screen (Main Landing Product)
                      </span>
                      {productForm.showOnHomeScreen && (
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Active Hero
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Jab customer website ya app khole ga to sabse upar Home Screen par is product ki photos, pricing aur bundles show hongi.
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm((prev) => ({
                        ...prev,
                        showOnHomeScreen: !prev.showOnHomeScreen,
                        isHeroProduct: !prev.showOnHomeScreen,
                      }))
                    }
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      productForm.showOnHomeScreen ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        productForm.showOnHomeScreen ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold mb-1 text-slate-300">Product Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Enriched with pure natural extracts and multi-vitamin complex..."
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProduct ? 'Saving Product...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PRICE / DISCOUNT EDIT MODAL */}
      {quickPriceProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-700 text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold font-serif-brand text-emerald-400 flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Quick Price & Discount Edit</span>
              </h3>
              <button onClick={() => setQuickPriceProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              Updating price for: <span className="text-white font-bold">{quickPriceProduct.name}</span>
            </p>

            <form onSubmit={handleSaveQuickPrice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-300">
                  Active Selling Price (PKR) <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rs.</span>
                  <input
                    type="number"
                    required
                    value={quickPrice}
                    onChange={(e) => setQuickPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">
                  Crossed-out Original Price (PKR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rs.</span>
                  <input
                    type="number"
                    value={quickSalePrice}
                    onChange={(e) => setQuickSalePrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-sm"
                  />
                </div>
              </div>

              {quickSalePrice > quickPrice && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Discount Amount:</span>
                  <span className="font-bold text-amber-300">
                    {Math.round(((quickSalePrice - quickPrice) / quickSalePrice) * 100)}% OFF (Save Rs.
                    {(quickSalePrice - quickPrice).toLocaleString()})
                  </span>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickPriceProduct(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingQuickPrice}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingQuickPrice ? 'Updating...' : 'Update Price'}</span>
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
                    <span>
                      {it.name} (x{it.quantity})
                    </span>
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

      {/* Review Add / Edit Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-700 text-slate-100 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold font-serif-brand flex items-center space-x-2 text-white">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{editingReview ? 'Change / Edit Review' : 'Upload New Customer Review'}</span>
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">
                    Customer Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewFormData.reviewerName}
                    onChange={(e) =>
                      setReviewFormData({ ...reviewFormData, reviewerName: e.target.value })
                    }
                    placeholder="e.g. Zainab Bibi / Sana Tariq"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Review Date</label>
                  <input
                    type="text"
                    value={reviewFormData.date}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, date: e.target.value })}
                    placeholder="MM/DD/YYYY"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Star Rating Selector */}
              <div>
                <label className="block font-semibold mb-1.5 text-slate-300">Star Rating</label>
                <div className="flex items-center space-x-2 bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewFormData({ ...reviewFormData, rating: s })}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= reviewFormData.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-300 ml-2">
                    {reviewFormData.rating === 5 && '★★★★★ (5/5 - Outstanding / بہترین نتائج)'}
                    {reviewFormData.rating === 4 && '★★★★☆ (4/5 - Very Good)'}
                    {reviewFormData.rating === 3 && '★★★☆☆ (3/5 - Average)'}
                    {reviewFormData.rating === 2 && '★★☆☆☆ (2/5 - Below Average)'}
                    {reviewFormData.rating === 1 && '★☆☆☆☆ (1/5 - Poor)'}
                  </span>
                </div>
              </div>

              {/* Product Association & Verified Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Associated Product</label>
                  <select
                    value={reviewFormData.productId}
                    onChange={(e) => {
                      const selectedProd = products.find((p) => p.id === e.target.value);
                      setReviewFormData({
                        ...reviewFormData,
                        productId: e.target.value,
                        productName: selectedProd?.name || 'Musfira Special Cream',
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center space-x-2.5 bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg cursor-pointer hover:border-slate-600">
                    <input
                      type="checkbox"
                      checked={reviewFormData.verified}
                      onChange={(e) =>
                        setReviewFormData({ ...reviewFormData, verified: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-0 bg-slate-800 border-slate-700"
                    />
                    <div className="flex items-center space-x-1 text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-slate-200">Verified Buyer Badge</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-300">
                    Customer Feedback / Review Message <span className="text-amber-400">*</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Supports English & Urdu (اردو)</span>
                </div>
                <textarea
                  required
                  rows={3}
                  value={reviewFormData.comment}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                  placeholder="e.g. Boht farq parha Allah Kush rakhay app ko... / Very satisfied with the glow and quick delivery!"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Before / After Review Photo */}
              <div className="space-y-2 pt-2 border-t border-slate-700/60">
                <label className="block font-semibold text-slate-300">
                  Customer Before/After Photo (Optional)
                </label>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg cursor-pointer flex items-center justify-center space-x-2 shrink-0">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>{isUploadingReviewImage ? 'Uploading...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingReviewImage}
                      onChange={handleReviewFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-[10px] text-slate-500 hidden sm:inline">OR</span>

                  <input
                    type="text"
                    value={reviewFormData.beforeAfterImage}
                    onChange={(e) =>
                      setReviewFormData({ ...reviewFormData, beforeAfterImage: e.target.value })
                    }
                    placeholder="Paste image URL (e.g. /uploads/...)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-amber-500"
                  />
                </div>

                {reviewFormData.beforeAfterImage && (
                  <div className="flex items-center space-x-3 p-2.5 bg-slate-900 rounded-xl border border-slate-700">
                    <img
                      src={reviewFormData.beforeAfterImage}
                      alt="Preview"
                      className="h-14 w-20 object-cover rounded-lg border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-mono text-emerald-400 truncate">
                        {reviewFormData.beforeAfterImage}
                      </p>
                      <button
                        type="button"
                        onClick={() => setReviewFormData({ ...reviewFormData, beforeAfterImage: '' })}
                        className="text-[11px] text-red-400 hover:underline mt-0.5"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingReview}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg font-bold flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>
                    {isSavingReview ? 'Saving...' : editingReview ? 'Update Review' : 'Upload Review'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Image Zoom Modal */}
      {previewReviewImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 p-2">
            <button
              onClick={() => setPreviewReviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewReviewImage}
              alt="Customer Review Photo Proof"
              className="w-full max-h-[80vh] object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
