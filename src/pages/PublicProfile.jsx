import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FavoriteFilmsRail from '../components/FavoriteFilmsRail';
import ProfileActions from '../components/ProfileActions';
import ProfileCard from '../components/ProfileCard';
import ReviewCard from '../components/ReviewCard';
import ConnectionList from '../components/ConnectionList';
import ProfileTabs from '../components/ProfileTabs';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase/firebase';
import { followUser, subscribeToFollowState, unfollowUser, subscribeToFollowers, subscribeToFollowing, subscribeToFollowingIds } from '../services/follows';
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
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersLoading, setFollowersLoading] = useState(true);
  const [followingLoading, setFollowingLoading] = useState(true);
  const [followersError, setFollowersError] = useState('');
  const [followingError, setFollowingError] = useState('');
  const [currentFollowingIds, setCurrentFollowingIds] = useState([]);
  const [connectionsPendingUserId, setConnectionsPendingUserId] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const isOwnProfile = currentUser?.uid === userId;
  const currentFollowingSet = useMemo(() => new Set(currentFollowingIds.map(String)), [currentFollowingIds]);
  const favoriteMovies = profile?.favoriteMovies || [];
  const favoriteMoviesCount = favoriteMovies.length;

  const thisYearReviews = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return reviews.filter((review) => {
      const reviewYear = review.createdAt?.seconds ? new Date(review.createdAt.seconds * 1000).getFullYear() : null;
      return reviewYear === currentYear;
    }).length;
  }, [reviews]);

  const tabConfig = [
    { id: 'profile', label: 'Profile' },
    { id: 'activity', label: 'Activity' },
    { id: 'films', label: 'Films' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'network', label: 'Network' },
  ];

  useEffect(() => {
    let active = true;

    if (!currentUser || !firebaseReady) {
      setCurrentFollowingIds([]);
      return undefined;
    }

    const unsubscribe = subscribeToFollowingIds(
      currentUser.uid,
      (nextFollowingIds) => {
        if (!active) {
          return;
        }

        setCurrentFollowingIds(nextFollowingIds);
      },
      () => {
        if (!active) {
          return;
        }

        setCurrentFollowingIds([]);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [currentUser, firebaseReady]);

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

  useEffect(() => {
    let active = true;

    if (!firebaseReady || !userId) {
      setFollowers([]);
      setFollowersLoading(false);
      return undefined;
    }

    setFollowersLoading(true);
    setFollowersError('');

    const unsubscribe = subscribeToFollowers(
      userId,
      (nextFollowers) => {
        if (!active) {
          return;
        }

        setFollowers(nextFollowers);
        setFollowersLoading(false);
      },
      () => {
        if (!active) {
          return;
        }

        setFollowersError('Unable to load followers right now.');
        setFollowersLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [userId, firebaseReady]);

  useEffect(() => {
    let active = true;

    if (!firebaseReady || !userId) {
      setFollowing([]);
      setFollowingLoading(false);
      return undefined;
    }

    setFollowingLoading(true);
    setFollowingError('');

    const unsubscribe = subscribeToFollowing(
      userId,
      (nextFollowing) => {
        if (!active) {
          return;
        }

        setFollowing(nextFollowing);
        setFollowingLoading(false);
      },
      () => {
        if (!active) {
          return;
        }

        setFollowingError('Unable to load following right now.');
        setFollowingLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [userId, firebaseReady]);

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

  async function handleToggleConnectionFollow(person) {
    if (!currentUser || !person?.userId) {
      return;
    }

    try {
      setConnectionsPendingUserId(person.userId);

      if (currentFollowingSet.has(String(person.userId))) {
        await unfollowUser({ followerId: currentUser.uid, followingId: person.userId });
      } else {
        await followUser({
          follower: currentUser,
          following: {
            uid: person.userId,
            email: person.email || '',
            displayName: person.displayName || person.email || 'Filmatic user',
          },
        });
      }
    } finally {
      setConnectionsPendingUserId('');
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
    <>
      <main className="min-h-screen bg-film-900 text-film-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {profileError ? (
          <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
            {profileError}
          </div>
        ) : null}

        <ProfileCard
          user={displayProfile}
          reviewCount={reviews.length}
          filmCount={favoriteMovies.length}
          thisYearCount={thisYearReviews}
          listCount={0}
          followerCount={followers.length}
          followingCount={following.length}
          isOwnProfile={isOwnProfile}
        />

        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
          <ProfileActions
            isOwnProfile={false}
            onEditProfile={null}
            onJumpFollowers={() => document.getElementById('followers')?.scrollIntoView({ behavior: 'smooth' })}
            onJumpFollowing={() => document.getElementById('following')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            {!isOwnProfile && currentUser ? (
              <button
                type="button"
                onClick={handleFollowToggle}
                disabled={followLoading}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-film-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            ) : null}
            <Link
              to="/feed"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-film-200 transition hover:border-green-500/30 hover:text-white"
            >
              Feed
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-2xl font-semibold text-white">{reviews.length}</div>
            <div className="mt-1 text-[0.7rem] uppercase tracking-[0.3em] text-film-400">Reviews</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-2xl font-semibold text-white">{thisYearReviews}</div>
            <div className="mt-1 text-[0.7rem] uppercase tracking-[0.3em] text-film-400">This year</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-2xl font-semibold text-white">{favoriteMoviesCount}</div>
            <div className="mt-1 text-[0.7rem] uppercase tracking-[0.3em] text-film-400">Favorites</div>
          </div>
        </div>

        <div className="mt-8">
          <ProfileTabs tabs={tabConfig} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {!currentUser && !isOwnProfile ? (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Sign in to follow this user.
          </div>
        ) : null}

        <div className="mt-8 space-y-8">
          {activeTab === 'profile' ? (
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
              <FavoriteFilmsRail
                title="Favorite films"
                subtitle="A quick visual snapshot of what stands out most"
                movies={favoriteMovies}
                emptyMessage="This user has not picked any favorite films yet."
              />

              <section className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-film-400">About</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Public profile summary</h2>
                </div>
                <p className="mt-4 text-sm leading-7 text-film-300">
                  {displayProfile.bio || 'This profile is tuned for movie discovery, reviews, and network building.'}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className="rounded-2xl border border-white/10 bg-film-900/60 px-4 py-4 text-left transition hover:border-green-500/30 hover:bg-white/5"
                  >
                    <div className="text-2xl font-semibold text-white">{reviews.length}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.3em] text-film-400">Reviews</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('network')}
                    className="rounded-2xl border border-white/10 bg-film-900/60 px-4 py-4 text-left transition hover:border-green-500/30 hover:bg-white/5"
                  >
                    <div className="text-2xl font-semibold text-white">{followers.length + following.length}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.3em] text-film-400">Network</div>
                  </button>
                </div>
              </section>
            </div>
          ) : null}

          {activeTab === 'activity' ? (
            <section id="activity" className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-film-400">Activity</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Recent activity</h2>
                </div>
              </div>

              {profileLoading || reviewsLoading ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-48 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
                  ))}
                </div>
              ) : reviewsError ? (
                <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {reviewsError}
                </div>
              ) : reviews.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {reviews.slice(0, 4).map((review) => (
                    <ReviewCard key={review.id} review={review} showMovieTitle />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-film-300">
                  This user has not posted any reviews yet.
                </div>
              )}
            </section>
          ) : null}

          {activeTab === 'films' ? (
            <FavoriteFilmsRail
              title="Favorite films"
              subtitle="Movies the user saved on this profile"
              movies={favoriteMovies}
              emptyMessage="This user has not picked any favorite films yet."
            />
          ) : null}

          {activeTab === 'reviews' ? (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-film-400">Reviews</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Reviews by this Filmatic user</h2>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-48 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
                  ))}
                </div>
              ) : reviewsError ? (
                <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {reviewsError}
                </div>
              ) : reviews.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} showMovieTitle />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-film-300">
                  This user has not posted any reviews yet.
                </div>
              )}
            </section>
          ) : null}

          {activeTab === 'network' ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div id="followers">
                <ConnectionList
                  title="Followers"
                  subtitle="People who follow this profile"
                  people={followers.map((edge) => ({
                    userId: edge.followerId,
                    displayName: edge.followerName,
                    email: edge.followerEmail,
                    relationshipLabel: currentFollowingSet.has(String(edge.followerId)) ? 'Mutual' : 'Follows you',
                  }))}
                  currentUserId={currentUser?.uid}
                  followingIds={currentFollowingIds}
                  pendingUserId={connectionsPendingUserId}
                  onToggleFollow={currentUser ? handleToggleConnectionFollow : undefined}
                  emptyMessage="This profile has no followers yet."
                />
              </div>

              <div id="following">
                <ConnectionList
                  title="Following"
                  subtitle="People this profile follows"
                  people={following.map((edge) => ({
                    userId: edge.followingId,
                    displayName: edge.followingName,
                    email: edge.followingEmail,
                    relationshipLabel: currentFollowingSet.has(String(edge.followingId)) ? 'Following' : '',
                  }))}
                  currentUserId={currentUser?.uid}
                  followingIds={currentFollowingIds}
                  pendingUserId={connectionsPendingUserId}
                  onToggleFollow={currentUser ? handleToggleConnectionFollow : undefined}
                  emptyMessage="This profile is not following anyone yet."
                />
              </div>
            </div>
          ) : null}

          {followersError ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
              {followersError}
            </div>
          ) : null}

          {followingError ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
              {followingError}
            </div>
          ) : null}
        </div>

      </section>
    </main>
    <Footer />
    </>
  );
}