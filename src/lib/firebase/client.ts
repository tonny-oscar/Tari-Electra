
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
// import { getFirestore, type Firestore } from 'firebase/firestore'; // Uncomment if you use Firestore
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

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
// let db: Firestore | undefined; // Uncomment if you use Firestore
// let storage: FirebaseStorage | undefined; // Uncomment if you use Storage

// Check if all required Firebase config keys are present
const requiredKeys: (keyof typeof firebaseConfig)[] = ['apiKey', 'authDomain', 'projectId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error(`🔴 Firebase config is missing required keys: ${missingKeys.join(', ')}`);
  console.error('👉 Please ensure you have a .env.local file in your project root with all necessary NEXT_PUBLIC_FIREBASE_ variables correctly set.');
  console.error('👉 Example .env.local content can be found in .env.local.example');
}

if (getApps().length === 0) {
  if (missingKeys.length === 0) {
    try {
      console.log('🟢 Initializing Firebase app with config:', {
        apiKey: firebaseConfig.apiKey ? '*** (loaded)' : 'MISSING!',
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
        // Add other keys if you want to log their status, keeping sensitive ones masked
      });
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      // db = getFirestore(app); // Uncomment if you use Firestore
      // storage = getStorage(app); // Uncomment if you use Storage
    } catch (error) {
      console.error("🔴 Error initializing Firebase app:", error);
      // Prevent further execution if Firebase can't initialize
      app = undefined; 
      auth = undefined;
    }
  } else {
    console.warn("🟡 Firebase app was NOT initialized due to missing configuration keys.");
    app = undefined;
    auth = undefined;
  }
} else {
  app = getApps()[0]!;
  if (auth === undefined) { // Initialize auth if app was already initialized but auth wasn't
    auth = getAuth(app);
  }
  // db = getFirestore(app); // Uncomment if you use Firestore
  // storage = getStorage(app); // Uncomment if you use Storage
}


export { app, auth /*, db, storage */ };
