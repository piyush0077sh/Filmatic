import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function getFollowDocRef(followerId, followingId) {
  if (!db) {
    throw new Error('Firestore is not configured yet.');
  }

  return doc(db, 'follows', `${followerId}_${followingId}`);
}

function getFollowDocId(followerId, followingId) {
  return `${followerId}_${followingId}`;
}

export async function followUser({ follower, following }) {
  if (!db) {
    throw new Error('Firestore is not configured yet.');
  }

  await setDoc(getFollowDocRef(follower.uid, following.uid), {
    id: getFollowDocId(follower.uid, following.uid),
    followerId: follower.uid,
    followerEmail: follower.email || '',
    followerName: follower.displayName || follower.email || 'Filmatic user',
    followingId: following.uid,
    followingEmail: following.email || '',
    followingName: following.displayName || following.email || 'Filmatic user',
    createdAt: serverTimestamp(),
  });
}

export async function unfollowUser({ followerId, followingId }) {
  if (!db) {
    throw new Error('Firestore is not configured yet.');
  }

  await deleteDoc(getFollowDocRef(followerId, followingId));
}

export function subscribeToFollowState(followerId, followingId, onChange, onError) {
  return onSnapshot(
    getFollowDocRef(followerId, followingId),
    (snapshot) => {
      onChange(snapshot.exists());
    },
    (snapshotError) => {
      if (onError) {
        onError(snapshotError);
      }
    },
  );
}

export function subscribeToFollowingIds(followerId, onChange, onError) {
  if (!db) {
    throw new Error('Firestore is not configured yet.');
  }

  const followsQuery = query(collection(db, 'follows'), where('followerId', '==', String(followerId)));

  return onSnapshot(
    followsQuery,
    (snapshot) => {
      onChange(snapshot.docs.map((document) => document.data().followingId));
    },
    (snapshotError) => {
      if (onError) {
        onError(snapshotError);
      }
    },
  );
}

function subscribeToFollowEdges(fieldName, fieldValue, onChange, onError) {
  if (!db) {
    throw new Error('Firestore is not configured yet.');
  }

  const followsQuery = query(collection(db, 'follows'), where(fieldName, '==', String(fieldValue)));

  return onSnapshot(
    followsQuery,
    (snapshot) => {
      onChange(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
    },
    (snapshotError) => {
      if (onError) {
        onError(snapshotError);
      }
    },
  );
}

export function subscribeToFollowers(followingId, onChange, onError) {
  return subscribeToFollowEdges('followingId', followingId, onChange, onError);
}

export function subscribeToFollowing(followerId, onChange, onError) {
  return subscribeToFollowEdges('followerId', followerId, onChange, onError);
}