import { Link } from 'react-router-dom';

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

function getActionLabel(person, isFollowing) {
  if (!person.userId) {
    return 'Follow';
  }

  if (isFollowing) {
    return 'Unfollow';
  }

  if (person.relationshipLabel === 'Follows you') {
    return 'Follow back';
  }

  return 'Follow';
}

export default function ConnectionList({
  title,
  subtitle,
  people = [],
  currentUserId,
  followingIds = [],
  pendingUserId,
  onToggleFollow,
  emptyMessage = 'No connections found yet.',
}) {
  const followingSet = new Set(followingIds.map(String));

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-film-400">{title}</p>
          {subtitle ? <p className="mt-2 text-sm text-film-300">{subtitle}</p> : null}
        </div>
        <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-film-300">
          {people.length}
        </p>
      </div>

      {people.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {people.map((person) => {
            const isCurrentUser = currentUserId && person.userId === currentUserId;
            const isFollowing = followingSet.has(String(person.userId));
            const actionLabel = getActionLabel(person, isFollowing);
            const actionDisabled = !onToggleFollow || pendingUserId === person.userId;

            return (
              <li key={person.userId} className="rounded-2xl border border-white/10 bg-film-900/60 p-4">
                <div className="flex items-center gap-4">
                  <Link
                    to={person.userId ? `/users/${person.userId}` : '/profile'}
                    className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-film-800 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-green-500/40"
                  >
                    {person.photoURL ? (
                      <img
                        src={person.photoURL}
                        alt={person.displayName || 'Filmatic user'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(person.displayName)
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={person.userId ? `/users/${person.userId}` : '/profile'}
                      className="block truncate text-base font-semibold text-white transition hover:text-green-400"
                    >
                      {person.displayName || 'Filmatic user'}
                    </Link>
                    <p className="mt-1 truncate text-sm text-film-300">
                      {person.email || person.relationshipLabel || 'Filmatic member'}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {person.relationshipLabel ? (
                      <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-film-300 sm:inline-flex">
                        {person.relationshipLabel}
                      </span>
                    ) : null}

                    {isCurrentUser ? (
                      <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
                        You
                      </span>
                    ) : onToggleFollow ? (
                      <button
                        type="button"
                        onClick={() => onToggleFollow(person)}
                        disabled={actionDisabled}
                        className="rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-film-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {pendingUserId === person.userId ? 'Updating...' : actionLabel}
                      </button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-film-300">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}