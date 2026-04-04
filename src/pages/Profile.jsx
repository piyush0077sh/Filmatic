import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditProfileModal from '../components/EditProfileModal';
import FavoriteFilmsRail from '../components/FavoriteFilmsRail';
import ProfileActions from '../components/ProfileActions';
import ProfileCard from '../components/ProfileCard';
import ReviewCard from '../components/ReviewCard';
import ProfileTabs from '../components/ProfileTabs';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase/firebase';
import { followUser, unfollowUser, subscribeToFollowers, subscribeToFollowing, subscribeToFollowingIds } from '../services/follows';
import { subscribeToUserReviews } from '../services/reviews';
import ConnectionList from '../components/ConnectionList';
import { subscribeToUserProfile, updateUserProfile } from '../services/users';

export default function Profile() {
  const { user, loading } = useAuth();
  const firebaseReady = isFirebaseConfigured();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersLoading, setFollowersLoading] = useState(true);
  const [followingLoading, setFollowingLoading] = useState(true);
  const [followersError, setFollowersError] = useState('');
  const [followingError, setFollowingError] = useState('');
  const [currentFollowingIds, setCurrentFollowingIds] = useState([]);
  const [connectionsPendingUserId, setConnectionsPendingUserId] = useState('');
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState(null);
  const [profileDataLoading, setProfileDataLoading] = useState(true);
  const [profileDataError, setProfileDataError] = useState('');

  const currentFollowingSet = useMemo(() => new Set(currentFollowingIds.map(String)), [currentFollowingIds]);
  const profileMovies = profileData?.favoriteMovies || [];
  const favoriteMoviesCount = profileMovies.length;

  const thisYearReviews = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return reviews.filter((review) => {
      const reviewYear = review.createdAt?.seconds ? new Date(review.createdAt.seconds * 1000).getFullYear() : null;
      return reviewYear === currentYear;
    }).length;
  }, [reviews]);

  const tabConfig = [
    { id: 'overview', label: 'Profile' },
    { id: 'activity', label: 'Activity' },
    { id: 'films', label: 'Films' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'network', label: 'Network' },
  ];

  useEffect(() => {
    let active = true;

    if (!user || !firebaseReady) {
      setProfileData(null);
      setProfileDataLoading(false);
      setCurrentFollowingIds([]);
      return undefined;
    }

    setProfileDataLoading(true);
    setProfileDataError('');

    const unsubscribeProfile = subscribeToUserProfile(
      user.uid,
      (nextProfileData) => {
        if (!active) {
          return;
        }

        setProfileData(nextProfileData);
        setProfileDataLoading(false);
      },
      () => {
        if (!active) {
          return;
        }

        setProfileDataError('Unable to load your profile details right now.');
        setProfileDataLoading(false);
      },
    );

    const unsubscribe = subscribeToFollowingIds(
      user.uid,
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
      unsubscribeProfile();
      unsubscribe();
    };
  }, [user, firebaseReady]);

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

  useEffect(() => {
    let active = true;

    if (!user || !firebaseReady) {
      setFollowers([]);
      setFollowersLoading(false);
      return undefined;
    }

    setFollowersLoading(true);
    setFollowersError('');

    const unsubscribe = subscribeToFollowers(
      user.uid,
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

        setFollowersError('Unable to load your followers right now.');
        setFollowersLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [user, firebaseReady]);

  useEffect(() => {
    let active = true;

    if (!user || !firebaseReady) {
      setFollowing([]);
      setFollowingLoading(false);
      return undefined;
    }

    setFollowingLoading(true);
    setFollowingError('');

    const unsubscribe = subscribeToFollowing(
      user.uid,
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

        setFollowingError('Unable to load who you are following right now.');
        setFollowingLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [user, firebaseReady]);

  async function handleToggleConnectionFollow(person) {
    if (!user || !person?.userId) {
      return;
    }

    try {
      setConnectionsPendingUserId(person.userId);

      if (currentFollowingSet.has(String(person.userId))) {
        await unfollowUser({ followerId: user.uid, followingId: person.userId });
      } else {
        await followUser({
          follower: user,
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

  async function handleSaveProfile(updates) {
    if (!user) {
      return;
    }

    try {
      setProfileSaving(true);
      setProfileSaveError('');
      await updateUserProfile(user, updates);
      setEditProfileOpen(false);
    } catch (requestError) {
      setProfileSaveError(requestError.message || 'Unable to save profile right now.');
    } finally {
      setProfileSaving(false);
    }
  }

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
        {profileDataError ? (
          <div className="mb-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 text-sm text-amber-100">
            {profileDataError}
          </div>
        ) : null}

        <ProfileCard
          user={profileData || user}
          reviewCount={reviews.length}
          filmCount={profileMovies.length}
          thisYearCount={thisYearReviews}
          listCount={0}
          followerCount={followers.length}
          followingCount={following.length}
          isOwnProfile={true}
          onPrimaryAction={() => setEditProfileOpen(true)}
        />

        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
          <ProfileActions
            isOwnProfile={true}
            onEditProfile={() => setEditProfileOpen(true)}
            onJumpFollowers={() => document.getElementById('followers')?.scrollIntoView({ behavior: 'smooth' })}
            onJumpFollowing={() => document.getElementById('following')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[360px]">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="text-2xl font-semibold text-white">{reviews.length}</div>
              <div className="mt-1 text-[0.7rem] uppercase tracking-[0.3em] text-film-400">Films</div>
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
        </div>

        {profileSaveError ? (
          <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
            {profileSaveError}
          </div>
        ) : null}

        <div className="mt-8">
          <ProfileTabs tabs={tabConfig} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="mt-8 space-y-8">
          {activeTab === 'overview' ? (
            <>
              <FavoriteFilmsRail
                title="Favorite films"
                subtitle="Your stored favorites"
                movies={profileMovies}
                emptyMessage="Open Edit profile and pick 5 to 8 favorite films to build this rail."
              />

              <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
                <section id="activity" className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-film-400">Activity</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">Recent reviews</h2>
                    </div>
                  </div>

                  {reviewsLoading ? (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-48 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
                      ))}
                    </div>
                  ) : reviewsError ? (
                    <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                      {reviewsError}
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {reviews.slice(0, 4).map((review) => (
                        <ReviewCard key={review.id} review={review} showMovieTitle />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-film-300">
                      You have not posted any reviews yet.
                    </div>
                  )}
                </section>

                <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-film-400">Network</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Your people</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => document.getElementById('followers')?.scrollIntoView({ behavior: 'smooth' })}
                      className="rounded-2xl border border-white/10 bg-film-900/60 px-4 py-4 text-left transition hover:border-green-500/30 hover:bg-white/5"
                    >
                      <div className="text-2xl font-semibold text-white">{followers.length}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.3em] text-film-400">Followers</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById('following')?.scrollIntoView({ behavior: 'smooth' })}
                      className="rounded-2xl border border-white/10 bg-film-900/60 px-4 py-4 text-left transition hover:border-green-500/30 hover:bg-white/5"
                    >
                      <div className="text-2xl font-semibold text-white">{following.length}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.3em] text-film-400">Following</div>
                    </button>
                  </div>
                  <p className="text-sm leading-6 text-film-300">
                    Curate your profile, jump into your network, and open Discover or Feed with one tap.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditProfileOpen(true)}
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-film-100"
                    >
                      Edit profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('network')}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-film-200 transition hover:border-green-500/30 hover:text-white"
                    >
                      Network
                    </button>
                  </div>
                </section>
              </div>
            </>
          ) : null}

          {activeTab === 'films' ? (
            <FavoriteFilmsRail
              title="Your films"
              subtitle="The movies you picked for your profile"
              movies={profileMovies}
              emptyMessage="Pick favorite films in Edit profile to show them here."
            />
          ) : null}

          {activeTab === 'reviews' ? (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-film-400">Reviews</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Everything you posted</h2>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-48 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
                  ))}
                </div>
              ) : reviewsError ? (
                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {reviewsError}
                </div>
              ) : reviews.length > 0 ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} showMovieTitle />
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-film-300">
                  You have not posted any reviews yet.
                </div>
              )}
            </section>
          ) : null}

          {activeTab === 'network' ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div id="followers">
                <ConnectionList
                  title="Followers"
                  subtitle="People who follow your profile"
                  people={followers.map((edge) => ({
                    userId: edge.followerId,
                    displayName: edge.followerName,
                    email: edge.followerEmail,
                    relationshipLabel: currentFollowingSet.has(String(edge.followerId)) ? 'Mutual' : 'Follows you',
                  }))}
                  currentUserId={user?.uid}
                  followingIds={currentFollowingIds}
                  pendingUserId={connectionsPendingUserId}
                  onToggleFollow={handleToggleConnectionFollow}
                  emptyMessage="You do not have any followers yet."
                />
              </div>

              <div id="following">
                <ConnectionList
                  title="Following"
                  subtitle="People you are currently following"
                  people={following.map((edge) => ({
                    userId: edge.followingId,
                    displayName: edge.followingName,
                    email: edge.followingEmail,
                    relationshipLabel: currentFollowingSet.has(String(edge.followingId)) ? 'Following' : '',
                  }))}
                  currentUserId={user?.uid}
                  followingIds={currentFollowingIds}
                  pendingUserId={connectionsPendingUserId}
                  onToggleFollow={handleToggleConnectionFollow}
                  emptyMessage="You are not following anyone yet."
                />
              </div>
            </div>
          ) : null}
        </div>

        {followersError ? (
          <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
            {followersError}
          </div>
        ) : null}

        {followingError ? (
          <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
            {followingError}
          </div>
        ) : null}
      </section>
    </main>
    <EditProfileModal
      isOpen={editProfileOpen}
      user={profileData || user}
      saving={profileSaving}
      onClose={() => setEditProfileOpen(false)}
      onSave={handleSaveProfile}
    />
    <Footer />
    </>
  );
}