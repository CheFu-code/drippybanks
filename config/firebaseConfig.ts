import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  browserLocalPersistence,
  getAuth,
  inMemoryPersistence,
  setPersistence,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBiXzuzAS_CzLM4xNTTOsKyFwS1TREFdak",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "cheforumreal.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cheforumreal",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "cheforumreal.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "441077080510",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:441077080510:web:5d7f06f4ff992e2e7bd9ef",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-6QDESX9L05",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.warn(
      "Failed to use local persistence for Firebase Auth. Falling back to in-memory persistence.",
      error,
    );
    setPersistence(auth, inMemoryPersistence).catch(() => {
      console.warn("Failed to set in-memory persistence for Firebase Auth.");
    });
  });
}

let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };
