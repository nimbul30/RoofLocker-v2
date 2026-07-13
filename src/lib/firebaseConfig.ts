import appletConfig from '../../firebase-applet-config.json';

// Firebase web config. Values can be overridden per-environment via
// VITE_FIREBASE_* variables (see .env.example); otherwise the committed
// AI Studio applet config is used. Firebase web API keys are identifiers,
// not secrets, but env vars keep deployments (dev/staging/prod) separable.
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId,
};
