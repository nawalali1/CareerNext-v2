// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAQ4aeTcrT144jAoalXhOZxuUa_J3VkT4M",
  authDomain: "careernext-f1dd7.firebaseapp.com",
  projectId: "careernext-f1dd7",
  storageBucket: "careernext-f1dd7.appspot.com",
  messagingSenderId: "1024075600721",
  appId: "1:1024075600721:web:64c95236fa347f2a3bb970",
  measurementId: "G-NTHNKP7FSK"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase Auth instance
export const auth = getAuth(app);

export default app;
