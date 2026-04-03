import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase/firebase';
import { subscribeToFollowingIds } from '../services/follows';
import { subscribeToReviewsFromUsers } from '../services/reviews';

export default function Feed() {
  const { user, loading } = useAuth();
  const [followingIds, setFollowingIds] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [followingLoading, setFollowingLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [followingError, setFollowingError] = useState('');
  const [reviewsError, setReviewsError] = useState('');
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    let active = true;

    if (!user || !firebaseReady) {
      setFollowingLoading(false);
      return undefined;
    }

    setFollowingLoading(true);
    setFollowingError('');

    const unsubscribe = subscribeToFollowingIds(
      user.uid,
      (nextIds) => {
        if (!active) {
          return;
        }

        setFollowingIds(nextIds);
        setFollowingLoading(false);
      },
      () => {
        if (!active) {
          return;
        }

        setFollowingError('Unable to load your followed users right now.');
        setFollowingLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    let active = true;

    if (!followingIds.length || !firebaseReady) {
      setReviewsLoading(false);
      setReviews([]);
      return undefined;
    }

    setReviewsLoading(true);
    setReviewsError('');

    const unsubscribe = subscribeToReviewsFromUsers(
      followingIds,
      (nextReviews) => {
        if (!active) {
          return;
        }

        setReviews(nextReviews);
        setReviewsLoading(false);
      },
      () => {
        if (!active) {
          return;
        }

        setReviewsError('Unable to load your feed right now.');
        setReviewsLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [followingIds]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-film-900 via-film-950 to-film-950 text-film-100">
        <Navbar />
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-3xl border border-gold-500/20 bg-gradient-to-br from-film-800/40 to-film-900/40 p-6 text-sm text-film-200">
            Checking your feed...
          </div>
        </section>
      </main>
    );
  }

  if (!user || !firebaseReady) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-film-900 via-film-950 to-film-950 text-film-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-film-300">Feed</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Reviews from people you follow
            </h1>
          </div>
          <Link
            to="/profile"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-film-400/50 hover:text-white"
          >
            My profile
          </Link>
        </div>

        {followingError ? (
          <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
            {followingError}
          </div>
        ) : null}

        {followingLoading || reviewsLoading ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        ) : reviewsError ? (
          <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
            {reviewsError}
          </div>
        ) : followingIds.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            You are not following anyone yet. Open a user profile and follow them to build your feed.
          </div>
        ) : reviews.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} showMovieTitle />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            None of the people you follow have posted a review yet.
          </div>
        )}
      </section>
    </main>
  );
}