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

export default function ProfileCard({ user, reviewCount }) {
  const displayName = user.displayName || user.email || 'Filmatic user';

  return (
    <article className="rounded-lg border border-film-700 bg-film-800 p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-film-700 border border-green-600/40 text-2xl font-semibold text-green-400">
          {getInitials(displayName)}
        </div>

        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-film-300">Profile</p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">{displayName}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            {user.email ? <span>{user.email}</span> : null}
            {user.email ? <span>•</span> : null}
            <span>{reviewCount} reviews</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-film-700 bg-film-700/50 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-film-500">User ID</p>
          <p className="mt-2 break-all text-sm text-white">{user.uid}</p>
        </div>
        <div className="rounded-lg border border-film-700 bg-film-700/50 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-film-500">Account status</p>
          <p className="mt-2 text-sm text-white">Signed in</p>
        </div>
      </div>
    </article>
  );
}