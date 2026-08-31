import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db';
import { comparePassword, generateToken, hashPassword, requireAdminAuth } from '../auth';

const router = express.Router();

// Configure Multer for secure file uploads
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    const mime = file.mimetype.toLowerCase();
    if (allowed.test(ext) && (mime.includes('image') || mime.includes('octet-stream'))) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, SVG) are allowed'));
    }
  },
});

// ==========================================
// PUBLIC STOREFRONT ENDPOINTS
// ==========================================

// GET /api/products
router.get('/products', (req: Request, res: Response) => {
  try {
    const { category, search, featured, sort } = req.query;
    let products = db.getProducts().filter((p) => p.active !== false);

    if (category && typeof category === 'string' && category !== 'all') {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase() || p.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.tagline && p.tagline.toLowerCase().includes(q))
      );
    }

    if (featured === 'true') {
      products = products.filter((p) => p.isFeatured || p.isBestSeller);
    }

    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load products', details: err.message });
  }
});

// GET /api/products/:slug
router.get('/products/:slug', (req: Request, res: Response) => {
  try {
    const product = db.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve product details', details: err.message });
  }
});

// GET /api/categories
router.get('/categories', (req: Request, res: Response) => {
  try {
    const categories = db.getCategories().filter((c) => c.active !== false);
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load categories', details: err.message });
  }
});

// GET /api/reviews
router.get('/reviews', (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
    const reviews = db.getReviews(typeof productId === 'string' ? productId : undefined);
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load reviews', details: err.message });
  }
});

// POST /api/reviews (Public customer feedback submission)
router.post('/reviews', (req: Request, res: Response) => {
  try {
    const { productId, productName, reviewerName, rating, comment, beforeAfterImage } = req.body;
    if (!reviewerName || !comment || !rating) {
      return res.status(400).json({ error: 'Reviewer name, rating, and feedback comment are required.' });
    }

    const initials = reviewerName
      .split(' ')
      .map((part: string) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'M';

    const newReview = db.createReview({
      productId: productId || 'msf-001',
      productName: productName || 'Musfira Special Cream',
      reviewerName,
      initials,
      rating: Number(rating) || 5,
      comment,
      beforeAfterImage: beforeAfterImage || undefined,
      verified: true,
    });

    res.status(201).json(newReview);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to submit review', details: err.message });
  }
});

// GET /api/settings
router.get('/settings', (req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load settings', details: err.message });
  }
});

// POST /api/orders (Public checkout submission)
router.post('/orders', (req: Request, res: Response) => {
  try {
    const { customerName, phone, email, address, nearbyPlace, city, postalCode, notes, items, subtotal, shippingFee, total, paymentMethod } = req.body;

    if (!customerName || !phone || !address || !city || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Please provide complete customer name, phone number, delivery address, city, and items.' });
    }

    const createdOrder = db.createOrder({
      customerName,
      phone,
      email: email || undefined,
      address,
      nearbyPlace: nearbyPlace || undefined,
      city,
      postalCode: postalCode || undefined,
      notes: notes || undefined,
      items,
      subtotal: Number(subtotal) || 0,
      shippingFee: Number(shippingFee) || 0,
      total: Number(total) || 0,
      paymentMethod: paymentMethod || 'COD',
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: createdOrder,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

// GET /api/orders/:id (Public order tracking)
router.get('/orders/:id', (req: Request, res: Response) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load order', details: err.message });
  }
});

// ==========================================
// ADMIN AUTH & MANAGEMENT ENDPOINTS
// ==========================================

// POST /api/admin/login
router.post('/admin/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = db.getAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const isValid = comparePassword(password, admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = generateToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Login authentication failed', details: err.message });
  }
});

// GET /api/admin/me
router.get('/admin/me', requireAdminAuth, (req: Request, res: Response) => {
  const tokenUser = (req as any).adminUser;
  const admin = db.getAdminByEmail(tokenUser.email);
  if (!admin) {
    return res.status(404).json({ error: 'Admin account not found' });
  }
  res.json({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });
});

// GET /api/admin/stats
router.get('/admin/stats', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve stats', details: err.message });
  }
});

// GET /api/admin/products
router.get('/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  try {
    res.json(db.getProducts());
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load products', details: err.message });
  }
});

// POST /api/admin/products
router.post('/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { name, slug, price, salePrice, sku, description, shortDescription, category, stock, stockStatus, isFeatured, isBestSeller, images, badges, urduBenefits, urduUsage, bundles, active } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProd = db.createProduct({
      name,
      slug: generatedSlug,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      sku: sku || `MSF-${Date.now().toString().slice(-4)}`,
      description: description || '',
      shortDescription: shortDescription || '',
      category: category || 'Beauty Creams',
      stock: Number(stock) || 0,
      stockStatus: stockStatus || (Number(stock) > 0 ? 'in_stock' : 'sold_out'),
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      images: Array.isArray(images) && images.length > 0 ? images : ['/src/assets/images/musfira_cream_hero_1788205132383.jpg'],
      badges: Array.isArray(badges) ? badges : [],
      urduBenefits: Array.isArray(urduBenefits) ? urduBenefits : [],
      urduUsage: Array.isArray(urduUsage) ? urduUsage : [],
      bundles: Array.isArray(bundles) ? bundles : [],
      active: active !== false,
      rating: 5.0,
      reviewCount: 0,
    });

    res.status(201).json(newProd);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create product', details: err.message });
  }
});

// PUT /api/admin/products/:id
router.put('/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
});

// DELETE /api/admin/products/:id
router.delete('/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
});

// Categories admin endpoints
router.get('/admin/categories', requireAdminAuth, (req: Request, res: Response) => {
  res.json(db.getCategories());
});

router.post('/admin/categories', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { name, slug, description, image, active } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });
    const cat = db.createCategory({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      image,
      active: active !== false,
    });
    res.status(201).json(cat);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create category', details: err.message });
  }
});

router.put('/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const cat = db.updateCategory(req.params.id, req.body);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json(cat);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update category', details: err.message });
  }
});

router.delete('/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const success = db.deleteCategory(req.params.id);
    if (!success) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete category', details: err.message });
  }
});

// Orders admin endpoints
router.get('/admin/orders', requireAdminAuth, (req: Request, res: Response) => {
  try {
    res.json(db.getOrders());
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load orders', details: err.message });
  }
});

router.put('/admin/orders/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = db.updateOrderStatus(req.params.id, orderStatus, paymentStatus);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update order status', details: err.message });
  }
});

// Reviews admin endpoints
router.delete('/admin/reviews/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const success = db.deleteReview(req.params.id);
    if (!success) return res.status(404).json({ error: 'Review not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete review', details: err.message });
  }
});

// Settings admin endpoints
router.put('/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update settings', details: err.message });
  }
});

// Admin password update
router.put('/admin/password', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const tokenUser = (req as any).adminUser;
    const admin = db.getAdminByEmail(tokenUser.email);
    if (!admin) return res.status(404).json({ error: 'Admin account not found' });

    if (!comparePassword(currentPassword, admin.passwordHash)) {
      return res.status(400).json({ error: 'Current password does not match' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    db.updateAdminPassword(admin.email, hashPassword(newPassword));
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to change password', details: err.message });
  }
});

// Media upload endpoint
router.post('/admin/upload', requireAdminAuth, upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Image upload failed', details: err.message });
  }
});

export default router;
