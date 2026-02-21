import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔐 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDnL-ZG4gatf6qZeVswhPRSKBcCKvKWHkk",
  authDomain: "examshelf-71b78.firebaseapp.com",
  projectId: "examshelf-71b78",
  storageBucket: "examshelf-71b78.firebasestorage.app",
  messagingSenderId: "463432074374",
  appId: "1:463432074374:web:8ccbae476047273401fd07",
};


// ✅ Prevent multiple app instances (important for Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔐 Authentication
export const auth = getAuth(app);

// 🗄️ Firestore Database
export const db = getFirestore(app);

// ☁️ Firebase Storage
export const storage = getStorage(app);


