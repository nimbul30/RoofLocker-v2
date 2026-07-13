// Firebase web config, supplied entirely via VITE_FIREBASE_* environment
// variables (see .env.example) so no project keys live in the repository.
//
// Note: a Firebase *web* API key is a client-side identifier — it ships in
// the built JS bundle regardless of where it's stored. Keeping it out of the
// repo prevents casual scraping, but the real protections are:
//   - API key restrictions (HTTP referrers + Identity Toolkit API only)
//     in the Google Cloud console
//   - Firebase Auth authorized domains
//   - Firestore/Storage security rules
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// True when enough config is present for Firebase Auth to work. The app
// treats Google sign-in / Calendar as an optional feature when unconfigured.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);
