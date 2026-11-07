import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if Firebase credentials are provided
const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let googleProvider = null;

if (isConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
}

export const signInWithGoogleFirebase = async () => {
  if (!isConfigured) {
    console.warn('⚠️ Firebase credentials not found in frontend/.env. Using default authenticated Google identity.');
    // Simulated verified identity for local development
    return {
      email: 'nagaseshukumarbobbiti@gmail.com',
      idToken: 'mock-firebase-google-id-token'
    };
  }

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

export { auth, googleProvider };
