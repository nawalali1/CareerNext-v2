// src/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";     

// Read values from .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app (only once)
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Auth & Firestore
export const auth = getAuth(app);
export const db   = getFirestore(app);

// Storage
export const storage = getStorage(app);            

// Analytics (browser-only)
if (typeof window !== "undefined") {
  try {
    getAnalytics(app);
  } catch (e) {
    console.warn("Analytics already initialized or not supported:", e);
  }
}

export default app;
