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

// Collection references
const ORDERS_COL = 'orders';
const PRODUCTS_COL = 'products';
const SETTINGS_COL = 'settings';
const REVIEWS_COL = 'reviews';
const MEDIA_COL = 'media';

// --- ORDERS ---
export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  try {
    const q = query(collection(db, ORDERS_COL), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((docSnap) => {
          orders.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        callback(orders);
      },
      (error) => {
        console.warn('Firestore subscribeToOrders error (using fallback):', error);
      }
    );
  } catch (err) {
    console.warn('Error setting up orders listener:', err);
    return () => {};
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
  };

  try {
    const docRef = doc(db, ORDERS_COL, newOrder.id);
    await setDoc(docRef, newOrder);
  } catch (err) {
    console.warn('Could not save to Firestore directly, saved locally:', err);
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
    if (trackingNumber !== undefined) updatePayload.trackingNumber = trackingNumber;
    if (courierName !== undefined) updatePayload.courierName = courierName;

    await updateDoc(docRef, updatePayload);
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
