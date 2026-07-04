// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence, inMemoryPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey:process.env.FIREBASE_API_KEY ,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId:process.env.FIREBASE_MEASUREMENT_ID,
// };
const firebaseConfig = {
  apiKey: "AIzaSyBiXzuzAS_CzLM4xNTTOsKyFwS1TREFdak",
  authDomain: "cheforumreal.firebaseapp.com",
  projectId: "cheforumreal",
  storageBucket: "cheforumreal.appspot.com",
  messagingSenderId: "441077080510",
  appId: "1:441077080510:web:5d7f06f4ff992e2e7bd9ef",
  measurementId: "G-6QDESX9L05",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure auth persistence with a safe fallback when browser storage is blocked
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn("Failed to use local persistence (storage may be blocked). Falling back to in-memory.", err);
    // Fallback to in-memory persistence so the app can still sign in during this session
    setPersistence(auth, inMemoryPersistence).catch(() => {
      console.warn("Failed to set in-memory persistence for Firebase Auth.");
    });
  });
}
const db = getFirestore(app);

// Only load analytics in the browser
let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };
