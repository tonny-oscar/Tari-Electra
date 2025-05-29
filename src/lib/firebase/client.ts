
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore'; // Ensure getFirestore is imported
// import { getStorage, type FirebaseStorage } from 'firebase/storage'; // Uncomment if you use Storage

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore; // Declare db
// let storage: FirebaseStorage; // Uncomment if you use Storage

// Check if all required Firebase config keys are present
const requiredKeys: (keyof typeof firebaseConfig)[] = ['apiKey', 'authDomain', 'projectId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error(`🔴 Firebase config is missing required keys: ${missingKeys.join(', ')}`);
  console.error('👉 Please ensure you have a .env.local file in your project root with all necessary NEXT_PUBLIC_FIREBASE_ variables correctly set.');
  // @ts-ignore - app, auth, db might not be assigned but we need to export something
  app = undefined; 
  // @ts-ignore
  auth = undefined;
  // @ts-ignore
  db = undefined;
}

if (getApps().length === 0) {
  if (missingKeys.length === 0) { // Only initialize if no keys are missing
    try {
      console.log('🟢 Initializing Firebase app with config:', {
        apiKey: firebaseConfig.apiKey ? '*** (loaded)' : 'MISSING!',
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
      });
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app); // Initialize db
      // storage = getStorage(app); // Uncomment if you use Storage
    } catch (error) {
      console.error("🔴 Error initializing Firebase app:", error);
      // @ts-ignore
      app = undefined; 
      // @ts-ignore
      auth = undefined;
      // @ts-ignore
      db = undefined;
    }
  } else {
     console.warn("🟡 Firebase app was NOT initialized due to missing configuration keys.");
     // @ts-ignore
    app = undefined;
    // @ts-ignore
    auth = undefined;
    // @ts-ignore
    db = undefined;
  }
} else {
  app = getApps()[0]!;
  if (!auth) { // Initialize auth if app was already initialized but auth wasn't
    auth = getAuth(app);
  }
  if (!db) { // Initialize db if app was already initialized but db wasn't
    db = getFirestore(app);
  }
  // storage = getStorage(app); // Uncomment if you use Storage
}


export { app, auth, db /*, storage */ }; // Ensure db is exported
