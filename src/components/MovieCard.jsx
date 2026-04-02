import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/tmdbApi';

function formatYear(dateString) {
  if (!dateString) {
    return 'TBA';
  }

  return new Date(dateString).getFullYear();
}

export default function MovieCard({ movie }) {
  const posterUrl = movie.poster_path ? getImageUrl(movie.poster_path) : '';
  const content = (
    <article>
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-400">
            Poster unavailable
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 text-base font-semibold text-white">{movie.title}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              {formatYear(movie.release_date)}
            </p>
          </div>
          <div className="rounded-full border border-film-400/30 bg-film-400/10 px-2.5 py-1 text-xs font-medium text-film-200">
            {Number(movie.vote_average || 0).toFixed(1)}
          </div>
        </div>

        {movie.overview ? (
          <p className="line-clamp-3 text-sm leading-6 text-slate-300">{movie.overview}</p>
        ) : null}
      </div>
    </article>
  );

  if (movie.noLink) {
    return (
      <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-film-400/40 hover:bg-white/8">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/movie/${movie.id}`}
      state={{ movie }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-film-400/40 hover:bg-white/8"
    >
      {content}
    </Link>
  );
}