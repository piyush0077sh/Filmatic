import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function getReviewsCollection() {
  if (!db) {
    throw new Error('Firestore is not configured yet.');
  }

  return collection(db, 'reviews');
}

function sortReviewsDescending(reviews) {
  return reviews.sort((firstReview, secondReview) => {
    const firstTime = firstReview.createdAt?.seconds || 0;
    const secondTime = secondReview.createdAt?.seconds || 0;

    return secondTime - firstTime;
  });
}

export function subscribeToMovieReviews(movieId, onChange, onError) {
  const reviewsQuery = query(getReviewsCollection(), where('movieId', '==', String(movieId)));

  return onSnapshot(
    reviewsQuery,
    (snapshot) => {
      const reviews = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      onChange(sortReviewsDescending(reviews));
    },
    (snapshotError) => {
      if (onError) {
        onError(snapshotError);
      }
    },
  );
}

export function subscribeToUserReviews(userId, onChange, onError) {
  const reviewsQuery = query(getReviewsCollection(), where('userId', '==', String(userId)));

  return onSnapshot(
    reviewsQuery,
    (snapshot) => {
      const reviews = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      onChange(sortReviewsDescending(reviews));
    },
    (snapshotError) => {
      if (onError) {
        onError(snapshotError);
      }
    },
  );
}

function chunkIds(userIds, chunkSize = 10) {
  const chunks = [];

  for (let index = 0; index < userIds.length; index += chunkSize) {
    chunks.push(userIds.slice(index, index + chunkSize));
  }

  return chunks;
}

function sortReviewList(reviews) {
  return reviews.sort((firstReview, secondReview) => {
    const firstTime = firstReview.createdAt?.seconds || 0;
    const secondTime = secondReview.createdAt?.seconds || 0;

    return secondTime - firstTime;
  });
}

export function subscribeToReviewsFromUsers(userIds, onChange, onError) {
  const uniqueIds = Array.from(new Set(userIds.map(String).filter(Boolean)));

  if (!uniqueIds.length) {
    onChange([]);
    return () => {};
  }

  const chunks = chunkIds(uniqueIds);
  const chunkResults = new Map();
  const unsubscribers = [];

  chunks.forEach((chunkIdsList, index) => {
    const reviewsQuery = query(getReviewsCollection(), where('userId', 'in', chunkIdsList));

    const unsubscribe = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        const reviews = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        chunkResults.set(index, reviews);

        const combinedReviews = Array.from(chunkResults.values()).flat();
        onChange(sortReviewList(combinedReviews));
      },
      (snapshotError) => {
        if (onError) {
          onError(snapshotError);
        }
      },
    );

    unsubscribers.push(unsubscribe);
  });

  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
  };
}

export async function createMovieReview({ movieId, movieTitle, moviePosterPath, user, content, rating }) {
  const reviewsCollection = getReviewsCollection();

  return addDoc(reviewsCollection, {
    movieId: String(movieId),
    movieTitle,
    moviePosterPath: moviePosterPath || '',
    userId: user.uid,
    userEmail: user.email || '',
    userName: user.displayName || user.email || 'Anonymous',
    content,
    rating,
    createdAt: serverTimestamp(),
  });
}