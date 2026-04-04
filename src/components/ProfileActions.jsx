import { Link } from 'react-router-dom';

export default function ProfileActions({ isOwnProfile, onEditProfile, onJumpFollowers, onJumpFollowing }) {
  return (
    <div className="flex flex-wrap gap-3">
      {isOwnProfile ? (
        <button
          type="button"
          onClick={onEditProfile}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-film-100"
        >
          Edit profile
        </button>
      ) : null}
      <Link
        to="/feed"
        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-film-100"
      >
        Feed
      </Link>
      <Link
        to="/discover"
        className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-film-200 transition hover:border-green-500/30 hover:text-white"
      >
        Discover
      </Link>
      <button
        type="button"
        onClick={onJumpFollowers}
        className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-film-200 transition hover:border-green-500/30 hover:text-white"
      >
        Followers
      </button>
      <button
        type="button"
        onClick={onJumpFollowing}
        className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-film-200 transition hover:border-green-500/30 hover:text-white"
      >
        Following
      </button>
    </div>
  );
}