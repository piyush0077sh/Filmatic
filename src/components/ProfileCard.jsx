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
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/15">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-film-400 to-film-700 text-2xl font-semibold text-white shadow-lg shadow-film-500/20">
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
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">User ID</p>
          <p className="mt-2 break-all text-sm text-white">{user.uid}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Account status</p>
          <p className="mt-2 text-sm text-white">Signed in</p>
        </div>
      </div>
    </article>
  );
}