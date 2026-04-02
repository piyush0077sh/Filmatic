import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function getUserDocRef(userId) {
  if (!db) {
    throw new Error('Firestore is not configured yet.');
  }

  return doc(db, 'users', String(userId));
}

export async function ensureUserProfile(user) {
  if (!db || !user) {
    return;
  }

  await setDoc(
    getUserDocRef(user.uid),
    {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email || 'Filmatic user',
      photoURL: user.photoURL || '',
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function subscribeToUserProfile(userId, onChange, onError) {
  return onSnapshot(
    getUserDocRef(userId),
    (snapshot) => {
      onChange(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
    },
    (snapshotError) => {
      if (onError) {
        onError(snapshotError);
      }
    },
  );
}