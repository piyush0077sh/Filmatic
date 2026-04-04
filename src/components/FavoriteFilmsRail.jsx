import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/tmdbApi';

function normalizeFavoriteMovie(movie) {
  return {
    id: movie.id ?? movie.movieId,
    title: movie.title || movie.movieTitle || 'Untitled movie',
    posterPath: movie.poster_path || movie.posterPath || movie.moviePosterPath || '',
    releaseDate: movie.release_date || movie.releaseDate || '',
    voteAverage: movie.vote_average ?? movie.voteAverage ?? movie.rating ?? 0,
  };
}

export default function FavoriteFilmsRail({ title = 'Favorite films', subtitle, movies = [], emptyMessage }) {
  const favoriteMovies = Array.isArray(movies) ? movies.map(normalizeFavoriteMovie).slice(0, 8) : [];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-film-400">{title}</p>
          {subtitle ? <p className="mt-2 text-sm text-film-300">{subtitle}</p> : null}
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-film-300">
          {favoriteMovies.length}
        </span>
      </div>

      {favoriteMovies.length > 0 ? (
        <div className="mt-5 grid grid-flow-col auto-cols-[150px] gap-4 overflow-x-auto pb-2 sm:auto-cols-[170px]">
          {favoriteMovies.map((movie) => {
            const posterUrl = movie.posterPath ? getImageUrl(movie.posterPath) : '';
            const movieLinkId = movie.id;

            return (
              <Link
                key={movieLinkId}
                to={`/movie/${movieLinkId}`}
                state={{ movie }}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-film-900 transition hover:-translate-y-1 hover:border-green-500/30"
              >
                <div className="aspect-[2/3] bg-film-800">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={movie.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-film-400">
                      Poster unavailable
                    </div>
                  )}
                </div>

                <div className="space-y-2 p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white">{movie.title}</h3>
                  <div className="flex items-center justify-between gap-2 text-xs text-film-300">
                    <span>Rated</span>
                    <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-1 font-semibold text-green-300">
                      {Number(movie.voteAverage || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-film-300">
          {emptyMessage || 'Pick up to 8 favorite films in Edit profile and they will show up here.'}
        </div>
      )}
    </section>
  );
}