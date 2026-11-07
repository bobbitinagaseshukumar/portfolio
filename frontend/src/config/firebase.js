import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC_uQcC4wr6L9YtB4BRiKMl3fhtXBaXHcg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'portfolio-f5d6c.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'portfolio-f5d6c',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'portfolio-f5d6c.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '68313246241',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:68313246241:web:17af29d900c356e9791160',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-WTVCZG83G6'
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics if supported in environment (browser only)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

/**
 * Initiates Google OAuth popup with Firebase Web SDK
 */
export const signInWithGoogleFirebase = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return {
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      idToken
    };
  } catch (error) {
    console.error('Firebase Google Sign-In error:', error);
    throw error;
  }
};

export { app, auth, googleProvider, analytics };
