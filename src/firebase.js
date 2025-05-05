// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ4aeTcrT144jAoalXhOZxuUa_J3VkT4M",
  authDomain: "careernext-f1dd7.firebaseapp.com",
  projectId: "careernext-f1dd7",
  storageBucket: "careernext-f1dd7.appspot.com",
  messagingSenderId: "1024075600721",
  appId: "1:1024075600721:web:64c95236fa347f2a3bb970",
  measurementId: "G-NTHNKP7FSK",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase Auth
export const auth = getAuth(app);

// (Optional) If you need Firestore elsewhere, initialize and export it too
export const db = getFirestore(app);

export default app;
