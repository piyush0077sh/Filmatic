import { updateProfile } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
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

  const userRef = getUserDocRef(user.uid);
  const existingProfile = await getDoc(userRef);
  const profileData = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email || 'Filmatic user',
    photoURL: user.photoURL || '',
    updatedAt: serverTimestamp(),
  };

  if (!existingProfile.exists()) {
    profileData.createdAt = serverTimestamp();
    profileData.favoriteMovies = [];
  }

  await setDoc(
    userRef,
    profileData,
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

export async function updateUserProfile(user, updates) {
  if (!db || !user) {
    throw new Error('Firestore is not configured yet.');
  }

  const nextProfileData = {
    updatedAt: serverTimestamp(),
  };

  if (typeof updates.displayName === 'string') {
    const displayName = updates.displayName.trim();
    if (displayName) {
      nextProfileData.displayName = displayName;
      await updateProfile(user, { displayName });
    }
  }

  if (typeof updates.photoURL === 'string') {
    const photoURL = updates.photoURL.trim();

    if (photoURL) {
      nextProfileData.photoURL = photoURL;
      await updateProfile(user, { photoURL });
    }
  }

  if (typeof updates.bio === 'string') {
    nextProfileData.bio = updates.bio.trim();
  }

  if (typeof updates.location === 'string') {
    nextProfileData.location = updates.location.trim();
  }

  if (Array.isArray(updates.favoriteMovies)) {
    const uniqueMovies = new Map();

    updates.favoriteMovies.forEach((movie) => {
      if (!movie || movie.id === undefined || movie.id === null) {
        return;
      }

      uniqueMovies.set(String(movie.id), {
        id: movie.id,
        title: movie.title || 'Untitled movie',
        poster_path: movie.poster_path || '',
        release_date: movie.release_date || '',
        vote_average: movie.vote_average || 0,
      });
    });

    nextProfileData.favoriteMovies = Array.from(uniqueMovies.values()).slice(0, 8);
  }

  await updateDoc(getUserDocRef(user.uid), nextProfileData);
}