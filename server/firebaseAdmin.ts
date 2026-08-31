import { initializeApp, getApps, getApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import firebaseConfig from '../firebase-applet-config.json';

let adminApp: App | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

export function getFirebaseAdminApp(): App | null {
  if (!adminApp) {
    try {
      if (getApps().length > 0) {
        adminApp = getApp();
      } else {
        adminApp = initializeApp({
          projectId: firebaseConfig.projectId,
          storageBucket: firebaseConfig.storageBucket,
        });
      }
    } catch (e) {
      console.warn('Firebase Admin app init:', e);
      adminApp = null;
    }
  }
  return adminApp;
}

export function getAdminFirestore(): Firestore | null {
  if (!firestoreInstance) {
    try {
      const app = getFirebaseAdminApp();
      if (app) {
        if (firebaseConfig.firestoreDatabaseId) {
          firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
        } else {
          firestoreInstance = getFirestore(app);
        }
      }
    } catch (err) {
      console.warn('Firestore admin init warning:', err);
      firestoreInstance = null;
    }
  }
  return firestoreInstance;
}

export function getAdminAuth(): Auth | null {
  if (!authInstance) {
    try {
      const app = getFirebaseAdminApp();
      if (app) {
        authInstance = getAuth(app);
      }
    } catch (err) {
      console.warn('Firebase Admin Auth init warning:', err);
      authInstance = null;
    }
  }
  return authInstance;
}
