import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, Auth } from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

// Firebase is initialized lazily and only when configured, so the app runs
// (with Google sign-in disabled) when no VITE_FIREBASE_* env vars are set.
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

const getAuthInstance = (): Auth | null => {
  if (!isFirebaseConfigured) return null;
  if (!authInstance) {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
  }
  return authInstance;
};

const buildProvider = () => {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar');
  provider.addScope('https://www.googleapis.com/auth/calendar.events');
  return provider;
};

let isSigningIn = false;

// Google OAuth access tokens expire after ~1 hour and Firebase does not
// refresh them for us; callers must treat a 401 from Google APIs as an
// expired token, call clearAccessToken(), and prompt the user to reconnect.
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  const auth = getAuthInstance();
  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  const auth = getAuthInstance();
  if (!auth) {
    throw new Error('Google sign-in is not configured for this deployment (missing VITE_FIREBASE_* environment variables).');
  }
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, buildProvider());
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const clearAccessToken = () => {
  cachedAccessToken = null;
};

export const logout = async () => {
  const auth = getAuthInstance();
  if (auth) {
    await auth.signOut();
  }
  cachedAccessToken = null;
};
