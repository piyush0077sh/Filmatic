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
      <div className="relative aspect-[2/3] overflow-hidden bg-film-800">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-film-400">
            Poster unavailable
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-film-950 via-film-950/20 to-transparent group-hover:via-film-950/10 transition duration-500" />
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 text-base font-bold text-white group-hover:text-gold-300 transition">{movie.title}</h3>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
              {formatYear(movie.release_date)}
            </p>
          </div>
          <div className="rounded-lg border border-gold-500/40 bg-gradient-to-br from-gold-500/20 to-gold-600/10 px-3 py-1.5 text-xs font-bold text-gold-300 shadow-lg shadow-gold-500/10 group-hover:border-gold-400 group-hover:from-gold-500/30 group-hover:to-gold-600/20 transition">
            {Number(movie.vote_average || 0).toFixed(1)}
          </div>
        </div>

        {movie.overview ? (
          <p className="line-clamp-2 text-sm leading-6 text-film-200 group-hover:text-film-100 transition">{movie.overview}</p>
        ) : null}
      </div>
    </article>
  );

  if (movie.noLink) {
    return (
      <div className="group overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-br from-film-800/80 to-film-900/80 shadow-premium transition hover:-translate-y-2 hover:border-gold-400/40 hover:shadow-premium-hover hover:from-film-800 hover:to-film-800/90">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/movie/${movie.id}`}
      state={{ movie }}
      className="group overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-br from-film-800/80 to-film-900/80 shadow-premium transition hover:-translate-y-2 hover:border-gold-400/40 hover:shadow-premium-hover hover:from-film-800 hover:to-film-800/90"
    >
      {content}
    </Link>
  );
}