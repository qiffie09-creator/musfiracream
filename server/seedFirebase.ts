import { getAdminFirestore } from './firebaseAdmin';
import { db as localDb } from './db';

let isSeeded = false;

export async function syncFirebaseWithInitialData() {
  if (isSeeded) return;
  try {
    const firestore = getAdminFirestore();
    if (!firestore) {
      isSeeded = true;
      return;
    }

    // Attempt a light check with timeout/catch to gracefully detect if admin credentials exist
    try {
      const settingsDoc = await firestore.collection('settings').doc('site_settings').get();
      if (!settingsDoc.exists) {
        console.log('Seeding initial data into Firebase Firestore...');
        const initialData = localDb.getData();

        // Seed Settings
        await firestore.collection('settings').doc('site_settings').set(initialData.settings);

        // Seed Products
        const productsBatch = firestore.batch();
        for (const prod of initialData.products) {
          const docRef = firestore.collection('products').doc(prod.id);
          productsBatch.set(docRef, prod);
        }
        await productsBatch.commit();

        // Seed Categories
        const categoriesBatch = firestore.batch();
        for (const cat of initialData.categories) {
          const docRef = firestore.collection('categories').doc(cat.id);
          categoriesBatch.set(docRef, cat);
        }
        await categoriesBatch.commit();

        // Seed Reviews
        const reviewsBatch = firestore.batch();
        for (const rev of initialData.reviews) {
          const docRef = firestore.collection('reviews').doc(rev.id);
          reviewsBatch.set(docRef, rev);
        }
        await reviewsBatch.commit();

        // Seed Orders
        const ordersBatch = firestore.batch();
        for (const ord of initialData.orders) {
          const docRef = firestore.collection('orders').doc(ord.id);
          ordersBatch.set(docRef, ord);
        }
        await ordersBatch.commit();

        console.log('Firebase Firestore successfully synced with Musfira Beauty Cream catalog!');
      }
      isSeeded = true;
    } catch (adminErr: any) {
      // In web applet environment without service account key, server operates in local persistence mode
      isSeeded = true;
    }
  } catch (err) {
    isSeeded = true;
  }
}
