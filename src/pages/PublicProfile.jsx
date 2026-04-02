import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase/firebase';
import { followUser, subscribeToFollowState, unfollowUser } from '../services/follows';
import { subscribeToUserReviews } from '../services/reviews';
import { subscribeToUserProfile } from '../services/users';

export default function PublicProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const firebaseReady = isFirebaseConfigured();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [reviewsError, setReviewsError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(true);
  const [followError, setFollowError] = useState('');

  const isOwnProfile = currentUser?.uid === userId;

  useEffect(() => {
    let active = true;

    if (!firebaseReady) {
      setProfileLoading(false);
      return undefined;
    }

    setProfileLoading(true);
    setProfileError('');

    const unsubscribe = subscribeToUserProfile(
      userId,
      (nextProfile) => {
        if (!active) {
          return;
        }

        setProfile(nextProfile);
        setProfileLoading(false);
      },
      () => {
        if (!active) {
          return;
        }

        setProfileError('Unable to load this profile right now.');
        setProfileLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    let active = true;

    if (!firebaseReady) {
      setReviewsLoading(false);
      return undefined;
    }

    setReviewsLoading(true);
    setReviewsError('');

    const unsubscribe = subscribeToUserReviews(
      userId,
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

        setReviewsError('Unable to load reviews right now.');
        setReviewsLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    let active = true;

    if (!currentUser || !userId || isOwnProfile || !firebaseReady) {
      setFollowLoading(false);
      setIsFollowing(false);
      return undefined;
    }

    setFollowLoading(true);
    setFollowError('');

    const unsubscribe = subscribeToFollowState(
      currentUser.uid,
      userId,
      (nextIsFollowing) => {
        if (!active) {
          return;
        }

        setIsFollowing(nextIsFollowing);
        setFollowLoading(false);
      },
      () => {
        if (!active) {
          return;
        }

        setFollowError('Unable to load follow status right now.');
        setFollowLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [currentUser, userId, isOwnProfile]);

  async function handleFollowToggle() {
    if (!currentUser || !profile || !userId) {
      return;
    }

    try {
      setFollowLoading(true);
      setFollowError('');

      if (isFollowing) {
        await unfollowUser({ followerId: currentUser.uid, followingId: userId });
      } else {
        await followUser({ follower: currentUser, following: profile });
      }
    } catch (requestError) {
      setFollowError(requestError.message || 'Unable to update follow status.');
    } finally {
      setFollowLoading(false);
    }
  }

  if (!firebaseReady) {
    return <Navigate to="/" replace />;
  }

  const displayProfile =
    profile ||
    (currentUser && currentUser.uid === userId
      ? currentUser
      : { uid: userId, displayName: 'Filmatic user', email: '' });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {profileError ? (
          <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
            {profileError}
          </div>
        ) : null}

        <ProfileCard user={displayProfile} reviewCount={reviews.length} />

        {!isOwnProfile && currentUser ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleFollowToggle}
              disabled={followLoading}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-film-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            <Link
              to="/feed"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-300 transition hover:border-film-400/50 hover:text-white"
            >
              View feed
            </Link>
            {followError ? <p className="text-sm text-red-200">{followError}</p> : null}
          </div>
        ) : null}

        {!currentUser && !isOwnProfile ? (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Sign in to follow this user.
          </div>
        ) : null}

        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-film-300">User reviews</p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Reviews by this Filmatic user
            </h2>
          </div>
        </div>

        {profileLoading || reviewsLoading ? (
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
            This user has not posted any reviews yet.
          </div>
        )}
      </section>
    </main>
  );
}