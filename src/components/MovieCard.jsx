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
        <div className="absolute inset-0 bg-gradient-to-t from-film-950/30 to-transparent group-hover:from-film-950/20 transition duration-500" />
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 text-base font-bold text-white">{movie.title}</h3>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-film-500">
              {formatYear(movie.release_date)}
            </p>
          </div>
          <div className="rounded-lg border border-green-600/40 bg-film-800/60 px-3 py-1.5 text-xs font-bold text-green-400">
            {Number(movie.vote_average || 0).toFixed(1)}
          </div>
        </div>

        {movie.overview ? (
          <p className="line-clamp-2 text-sm leading-6 text-film-400 group-hover:text-film-300 transition">{movie.overview}</p>
        ) : null}
      </div>
    </article>
  );

  if (movie.noLink) {
    return (
      <div className="group overflow-hidden rounded-lg border border-film-700 bg-film-800 transition hover:-translate-y-1">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/movie/${movie.id}`}
      state={{ movie }}
      className="group overflow-hidden rounded-lg border border-film-700 bg-film-800 transition hover:-translate-y-1"
    >
      {content}
    </Link>
  );
}