import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileCard from '../components/ProfileCard';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../context/AuthContext';
import { subscribeToUserReviews } from '../services/reviews';
import { isFirebaseConfigured } from '../firebase/firebase';

export default function Profile() {
  const { user, loading } = useAuth();
  const firebaseReady = isFirebaseConfigured();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');

  useEffect(() => {
    let active = true;

    if (!user || !firebaseReady) {
      setReviewsLoading(false);
      return undefined;
    }

    setReviewsLoading(true);
    setReviewsError('');

    const unsubscribe = subscribeToUserReviews(
      user.uid,
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

        setReviewsError('Unable to load your reviews right now.');
        setReviews([]);
        setReviewsLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [user]);

  if (loading) {
    return (
      <>
        <main className="min-h-screen bg-gradient-to-b from-film-900 via-film-950 to-film-950 text-film-100">
        <Navbar />
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-lg border border-film-700 bg-film-800 p-6 text-sm text-film-300">
            Checking your profile...
          </div>
        </section>
      </main>
      <Footer />
      </>
    );
  }

  if (!user || !firebaseReady) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-film-900 via-film-950 to-film-950 text-film-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <ProfileCard user={user} reviewCount={reviews.length} />

        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-film-300">Your reviews</p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Filmatic posts from your account
            </h2>
          </div>
          <Link
            to="/"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-film-400/50 hover:text-white"
          >
            Discover movies
          </Link>
        </div>

        {reviewsLoading ? (
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
        ) : reviews.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} showMovieTitle />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            You have not posted any reviews yet.
          </div>
        )}
      </section>
    </main>
    <Footer />
    </>
  );
}