import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBA2Q5ywF0bzL9fDl7OepjZdIeC4-B-yRQ",
  authDomain: "tari-africa-61fd1.firebaseapp.com",
  projectId: "tari-africa-61fd1",
  storageBucket: "tari-africa-61fd1.firebasestorage.app",
  messagingSenderId: "689703170797",
  appId: "1:689703170797:web:c20defec6d8e9f2c5e52e4",
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
