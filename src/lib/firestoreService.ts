import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Order, Product, StoreSettings, Review, MediaAsset, OrderStatus } from '../types';

// Helper to recursively clean undefined values so Firestore doesn't throw unsupported field value errors
export function cleanFirestoreData<T>(data: T): T {
  if (data === undefined) {
    return null as any;
  }
  if (data === null) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data.map((item) => cleanFirestoreData(item)) as any;
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned as any;
  }
  return data;
}

// Collection references
const ORDERS_COL = 'orders';
const PRODUCTS_COL = 'products';
const SETTINGS_COL = 'settings';
const REVIEWS_COL = 'reviews';
const MEDIA_COL = 'media';

// Helper to normalize orders from Firestore (handles both new and legacy formats safely)
export const normalizeOrder = (id: string, rawData: any): Order => {
  const data = rawData || {};
  const orderNumber = data.orderNumber || (id.startsWith('MSF-') ? id : `MSF-${id.slice(-4)}`);
  const customerName = data.customerName || data.name || 'Valued Customer';
  const phone = data.phone || '';
  const alternatePhone = data.alternatePhone || '';
  const province = data.province || 'Punjab';
  const city = data.city || 'Pakistan';
  const areaSector = data.areaSector || '';
  const address = data.address || '';
  const nearbyFamousPlace = data.nearbyFamousPlace || '';
  const notes = data.notes || '';
  const trackingNumber = data.trackingNumber || '';
  const courierName = data.courierName || '';
  const subtotal = Number(data.subtotal || data.total || 1499);
  const deliveryCharges = Number(data.deliveryCharges || 0);
  const total = Number(data.total || subtotal + deliveryCharges || 1499);
  const paymentMethod = data.paymentMethod || 'cod';
  const status = (data.status as OrderStatus) || 'pending';
  const createdAt = data.createdAt || data.date || new Date().toISOString();
  const updatedAt = data.updatedAt || createdAt || new Date().toISOString();
  const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : [
    {
      productId: 'p1',
      productName: 'Musfira Beauty Cream',
      bundleName: '1 Pack Deal',
      quantity: 1,
      price: total,
    }
  ];

  return {
    id,
    orderNumber,
    customerName,
    phone,
    alternatePhone,
    province,
    city,
    areaSector,
    address,
    nearbyFamousPlace,
    notes,
    items,
    subtotal,
    deliveryCharges,
    total,
    paymentMethod,
    status,
    trackingNumber,
    courierName,
    createdAt,
    updatedAt,
  };
};

// --- ORDERS ---
export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  try {
    const colRef = collection(db, ORDERS_COL);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((docSnap) => {
          orders.push(normalizeOrder(docSnap.id, docSnap.data()));
        });
        orders.sort((a, b) => {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tB - tA;
        });
        callback(orders);
      },
      (error) => {
        console.error('Firestore subscribeToOrders error:', error);
      }
    );
  } catch (err) {
    console.error('Error setting up orders listener:', err);
    return () => {};
  }
};

export const fetchOrdersDirectly = async (): Promise<Order[]> => {
  try {
    const snap = await getDocs(collection(db, ORDERS_COL));
    const orders: Order[] = [];
    snap.forEach((docSnap) => {
      orders.push(normalizeOrder(docSnap.id, docSnap.data()));
    });
    orders.sort((a, b) => {
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tB - tA;
    });
    return orders;
  } catch (err) {
    console.error('Direct fetch orders error:', err);
    return [];
  }
};

export const createFirestoreOrder = async (
  orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<Order> => {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `MSF-${randomSuffix}`;
  const nowIso = new Date().toISOString();

  const newOrder: Order = {
    ...orderData,
    id: `ord_${timestamp}`,
    orderNumber,
    status: 'pending',
    createdAt: nowIso,
    updatedAt: nowIso,
    customerName: orderData.customerName || '',
    phone: orderData.phone || '',
    alternatePhone: orderData.alternatePhone || '',
    province: orderData.province || 'Punjab',
    city: orderData.city || '',
    areaSector: orderData.areaSector || '',
    address: orderData.address || '',
    nearbyFamousPlace: orderData.nearbyFamousPlace || '',
    notes: orderData.notes || '',
    trackingNumber: '',
    courierName: '',
  };

  const payload = cleanFirestoreData(newOrder);

  try {
    const docRef = doc(db, ORDERS_COL, newOrder.id);
    await setDoc(docRef, payload);
    console.log('Order successfully saved to Firestore:', newOrder.id, newOrder.orderNumber);
  } catch (err) {
    console.error('CRITICAL Firestore save error:', err);
  }

  return newOrder;
};

export const updateFirestoreOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  courierName?: string
) => {
  try {
    const docRef = doc(db, ORDERS_COL, orderId);
    const updatePayload: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (trackingNumber !== undefined) updatePayload.trackingNumber = trackingNumber || '';
    if (courierName !== undefined) updatePayload.courierName = courierName || '';

    await updateDoc(docRef, cleanFirestoreData(updatePayload));
  } catch (err) {
    console.warn('Firestore update order error:', err);
  }
};

export const deleteFirestoreOrder = async (orderId: string) => {
  try {
    await deleteDoc(doc(db, ORDERS_COL, orderId));
  } catch (err) {
    console.warn('Firestore delete order error:', err);
  }
};

// --- PRODUCTS ---
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  try {
    const q = query(collection(db, PRODUCTS_COL));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const prods: Product[] = [];
          snapshot.forEach((docSnap) => {
            prods.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          callback(prods);
        }
      },
      (error) => {
        console.warn('Firestore subscribeToProducts error:', error);
      }
    );
  } catch (err) {
    console.warn('Products subscription setup failed:', err);
    return () => {};
  }
};

export const saveFirestoreProduct = async (product: Product) => {
  try {
    await setDoc(doc(db, PRODUCTS_COL, product.id), product, { merge: true });
  } catch (err) {
    console.warn('Firestore save product error:', err);
  }
};

export const deleteFirestoreProduct = async (productId: string) => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COL, productId));
  } catch (err) {
    console.warn('Firestore delete product error:', err);
  }
};

// Seed initial products to Firestore if empty
export const seedInitialProductsIfEmpty = async (initialProducts: Product[]) => {
  try {
    const snapshot = await getDocs(collection(db, PRODUCTS_COL));
    if (snapshot.empty) {
      for (const p of initialProducts) {
        await setDoc(doc(db, PRODUCTS_COL, p.id), p);
      }
    }
  } catch (err) {
    console.warn('Error seeding products:', err);
  }
};

// --- SETTINGS ---
export const subscribeToSettings = (callback: (settings: StoreSettings) => void) => {
  try {
    const docRef = doc(db, SETTINGS_COL, 'general');
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as StoreSettings);
        }
      },
      (error) => {
        console.warn('Settings subscription error:', error);
      }
    );
  } catch (err) {
    return () => {};
  }
};

export const saveFirestoreSettings = async (settings: StoreSettings) => {
  try {
    await setDoc(doc(db, SETTINGS_COL, 'general'), settings, { merge: true });
  } catch (err) {
    console.warn('Firestore save settings error:', err);
  }
};

// --- REVIEWS ---
export const subscribeToReviews = (callback: (reviews: Review[]) => void) => {
  try {
    return onSnapshot(collection(db, REVIEWS_COL), (snapshot) => {
      if (!snapshot.empty) {
        const revs: Review[] = [];
        snapshot.forEach((snap) => revs.push({ id: snap.id, ...(snap.data() as any) }));
        callback(revs);
      }
    });
  } catch (err) {
    return () => {};
  }
};

export const saveFirestoreReview = async (review: Review) => {
  try {
    await setDoc(doc(db, REVIEWS_COL, review.id), review);
  } catch (err) {
    console.warn('Firestore review save error:', err);
  }
};

export const deleteFirestoreReview = async (reviewId: string) => {
  try {
    await deleteDoc(doc(db, REVIEWS_COL, reviewId));
  } catch (err) {
    console.warn('Firestore review delete error:', err);
  }
};
