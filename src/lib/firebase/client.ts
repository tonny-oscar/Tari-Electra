


import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBA2Q5ywF0bzL9fDl7OepjZdIeC4-B-yRQ",
  authDomain: "tari-africa-61fd1.firebaseapp.com",
  projectId: "tari-africa-61fd1",
  storageBucket: "tari-africa-61fd1.firebasestorage.app",
  messagingSenderId: "689703170797",
  appId: "1:689703170797:web:c20defec6d8e9f2c5e52e4",
  measurementId: "G-JV7ZP4B4MX",
};

// Initialize Firebase app
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Init Auth, Firestore, and Storage
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
