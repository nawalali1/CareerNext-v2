// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Optional: only include this if you're using Analytics
// import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAQ4aeTcrT144jAoalXhOZxuUa_J3VkT4M",
  authDomain: "careernext-f1dd7.firebaseapp.com",
  projectId: "careernext-f1dd7",
  storageBucket: "careernext-f1dd7.appspot.com",
  messagingSenderId: "1024075600721",
  appId: "1:1024075600721:web:64c95236fa347f2a3bb970",
  measurementId: "G-NTHNKP7FSK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
// If you're using Analytics and want to conditionally enable:
// if (typeof window !== 'undefined') {
//   isSupported().then((supported) => {
//     if (supported) getAnalytics(app);
//   });
// }

export default app;
