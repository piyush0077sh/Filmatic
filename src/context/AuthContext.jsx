import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { ensureUserProfile } from '../services/users';
import { auth, isFirebaseConfigured } from '../firebase/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        ensureUserProfile(currentUser).catch(() => {});
      }
    });

    return () => unsubscribe();
  }, []);

  async function signUp(email, password, displayName = '') {
    if (!auth) {
      throw new Error('Firebase is not configured yet.');
    }

    setAuthError('');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName.trim()) {
      await updateProfile(userCredential.user, { displayName: displayName.trim() });
    }

    await ensureUserProfile(userCredential.user);

    return userCredential;
  }

  async function signIn(email, password) {
    if (!auth) {
      throw new Error('Firebase is not configured yet.');
    }

    setAuthError('');
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logOut() {
    if (!auth) {
      return;
    }

    setAuthError('');
    await signOut(auth);
  }

  const value = {
    user,
    loading,
    authError,
    setAuthError,
    signUp,
    signIn,
    logOut,
    isConfigured: isFirebaseConfigured(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}