function getInitials(name) {
  if (!name) {
    return 'U';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function StatAnchor({ href, value, label }) {
  const className =
    'group rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-green-500/30 hover:bg-white/10';

  if (!href) {
    return (
      <div className={className}>
        <div className="text-2xl font-semibold text-white">{value}</div>
        <div className="mt-1 text-[0.7rem] uppercase tracking-[0.3em] text-film-400 group-hover:text-green-300">
          {label}
        </div>
      </div>
    );
  }

  return (
    <a
      href={href}
      className={className}
    >
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-[0.7rem] uppercase tracking-[0.3em] text-film-400 group-hover:text-green-300">
        {label}
      </div>
    </a>
  );
}

export default function ProfileCard({
  user,
  reviewCount = 0,
  filmCount,
  thisYearCount = 0,
  listCount = 0,
  followerCount = 0,
  followingCount = 0,
  isOwnProfile,
  onPrimaryAction,
  primaryActionLabel = 'Edit profile',
}) {
  const displayName = user.displayName || (isOwnProfile ? user.email : 'Filmatic user') || 'Filmatic user';
  const photoUrl = user.photoURL || user.avatarUrl || '';
  const bio = user.bio || '';
  const location = user.location || '';
  const filmsValue = filmCount ?? reviewCount;

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-film-900 via-film-850 to-film-900 p-6 shadow-2xl shadow-black/30 sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.12),_transparent_24%),linear-gradient(to_bottom,_rgba(255,255,255,0.03),_transparent_55%)]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-film-700 text-4xl font-semibold text-green-400 shadow-[0_0_0_8px_rgba(255,255,255,0.03),0_20px_50px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 rounded-full border border-green-500/25" />
            {photoUrl ? (
              <img src={photoUrl} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              getInitials(displayName)
            )}
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-film-300">
              Profile
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-semibold text-white sm:text-5xl">{displayName}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-film-300">
                {location ? (
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">{location}</span>
                ) : null}
                {isOwnProfile && user.email ? (
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">{user.email}</span>
                ) : null}
                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-green-200">
                  {isOwnProfile ? 'Your profile' : 'Public profile'}
                </span>
              </div>
            </div>

            {bio ? <p className="max-w-2xl text-sm leading-7 text-film-200">{bio}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          {onPrimaryAction ? (
            <button
              type="button"
              onClick={onPrimaryAction}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-film-100"
            >
              {primaryActionLabel}
            </button>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
            <StatAnchor href="#reviews" value={filmsValue} label="Films" />
            <StatAnchor href="#following" value={followingCount} label="Following" />
            <StatAnchor href="#followers" value={followerCount} label="Followers" />
            <StatAnchor href="#activity" value={thisYearCount} label="This year" />
            <StatAnchor value={listCount} label="Lists" />
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-film-300">
          {isOwnProfile ? 'Signed in' : 'Member'}
        </span>
        {user.uid ? (
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-film-300">
            ID: {user.uid}
          </span>
        ) : null}
      </div>

      {isOwnProfile ? (
        <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-film-400">Account status</p>
            <p className="mt-2 text-sm text-white">Signed in</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-film-400">Focus</p>
            <p className="mt-2 text-sm text-white">Reviews, follows, and film discovery</p>
          </div>
        </div>
      ) : null}
    </article>
  );
}