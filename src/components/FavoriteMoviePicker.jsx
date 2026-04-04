import { useEffect, useMemo, useState } from 'react';
import { getImageUrl, searchMovies } from '../services/tmdbApi';

function formatYear(dateString) {
  if (!dateString) {
    return 'TBA';
  }

  return new Date(dateString).getFullYear();
}

function normalizeMovie(movie) {
  return {
    id: movie.id,
    title: movie.title || 'Untitled movie',
    poster_path: movie.poster_path || '',
    release_date: movie.release_date || '',
    vote_average: movie.vote_average || 0,
  };
}

export default function FavoriteMoviePicker({ value = [], onChange, maxSelections = 8 }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [draggedMovieId, setDraggedMovieId] = useState('');

  const selectedIds = useMemo(() => new Set(value.map((movie) => String(movie.id))), [value]);

  useEffect(() => {
    let active = true;

    async function runSearch() {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        setResults([]);
        setLoading(false);
        setError('');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const data = await searchMovies(trimmedQuery, 1);

        if (!active) {
          return;
        }

        setResults(Array.isArray(data.results) ? data.results.slice(0, 6) : []);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setResults([]);
        setError(requestError.message || 'Unable to search movies right now.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    const timeoutId = window.setTimeout(runSearch, 300);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  function addMovie(movie) {
    if (!onChange || value.length >= maxSelections) {
      return;
    }

    const normalizedMovie = normalizeMovie(movie);

    if (selectedIds.has(String(normalizedMovie.id))) {
      return;
    }

    onChange([...value, normalizedMovie]);
  }

  function removeMovie(movieId) {
    if (!onChange) {
      return;
    }

    onChange(value.filter((movie) => String(movie.id) !== String(movieId)));
  }

  function moveMovie(movieId, direction) {
    if (!onChange) {
      return;
    }

    const currentIndex = value.findIndex((movie) => String(movie.id) === String(movieId));

    if (currentIndex === -1) {
      return;
    }

    const targetIndex = currentIndex + direction;

    if (targetIndex < 0 || targetIndex >= value.length) {
      return;
    }

    const nextMovies = [...value];
    const [movedMovie] = nextMovies.splice(currentIndex, 1);
    nextMovies.splice(targetIndex, 0, movedMovie);
    onChange(nextMovies);
  }

  function handleDrop(movieId) {
    if (!draggedMovieId || draggedMovieId === movieId || !onChange) {
      setDraggedMovieId('');
      return;
    }

    const sourceIndex = value.findIndex((movie) => String(movie.id) === String(draggedMovieId));
    const targetIndex = value.findIndex((movie) => String(movie.id) === String(movieId));

    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedMovieId('');
      return;
    }

    const nextMovies = [...value];
    const [movedMovie] = nextMovies.splice(sourceIndex, 1);
    nextMovies.splice(targetIndex, 0, movedMovie);
    onChange(nextMovies);
    setDraggedMovieId('');
  }

  return (
    <div className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-br from-film-950/90 via-film-900/90 to-film-800/80 p-5 shadow-2xl shadow-black/25 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-green-300">
            Favorite films
          </div>
          <h3 className="text-2xl font-semibold text-white sm:text-3xl">Pick up to {maxSelections} films</h3>
          <p className="max-w-xl text-sm leading-6 text-film-300">
            Choose the films that best represent your taste. Drag the saved posters to reorder them, or use the arrows for precise placement.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
          <div className="text-2xl font-semibold text-white">{value.length}</div>
          <div className="mt-1 text-[0.7rem] uppercase tracking-[0.35em] text-film-400">Selected</div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-film-400">Selected films</p>
              <h4 className="mt-2 text-lg font-semibold text-white">Your lineup</h4>
            </div>
            <span className="rounded-full border border-white/10 bg-film-900 px-3 py-1 text-xs text-film-300">
              {value.length}/{maxSelections}
            </span>
          </div>

          {value.length > 0 ? (
            <div className="grid gap-3">
              {value.map((movie, index) => {
                const posterUrl = movie.poster_path ? getImageUrl(movie.poster_path, 'w342') : '';
                const canMoveUp = index > 0;
                const canMoveDown = index < value.length - 1;

                return (
                  <div
                    key={movie.id}
                    draggable
                    onDragStart={() => setDraggedMovieId(movie.id)}
                    onDragEnd={() => setDraggedMovieId('')}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(movie.id)}
                    className={[
                      'group flex items-center gap-3 rounded-2xl border p-3 transition',
                      draggedMovieId === movie.id
                        ? 'border-green-500/40 bg-green-500/10 shadow-lg shadow-green-500/10'
                        : 'border-white/10 bg-film-950/70 hover:border-green-500/20 hover:bg-white/5',
                    ].join(' ')}
                  >
                    <div className="flex w-8 shrink-0 items-center justify-center text-xs font-semibold text-film-400">
                      {index + 1}
                    </div>
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-xl bg-film-800">
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={movie.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{movie.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-film-400">
                        {formatYear(movie.release_date)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveMovie(movie.id, -1)}
                        disabled={!canMoveUp}
                        className="rounded-full border border-white/10 px-2.5 py-2 text-xs font-semibold text-film-200 transition hover:border-green-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Move ${movie.title} up`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMovie(movie.id, 1)}
                        disabled={!canMoveDown}
                        className="rounded-full border border-white/10 px-2.5 py-2 text-xs font-semibold text-film-200 transition hover:border-green-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Move ${movie.title} down`}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMovie(movie.id)}
                        className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-film-200 transition hover:border-red-500/30 hover:text-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-film-900/50 p-5 text-sm text-film-300">
              Add a few films to build your visual profile rail.
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-film-400">Search catalog</p>
            <h4 className="text-lg font-semibold text-white">Find movies to add</h4>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-film-200">Search movies</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type a movie title"
              className="rounded-2xl border border-white/10 bg-film-950 px-4 py-3 text-white outline-none transition focus:border-green-500/40"
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {!loading && !query.trim() ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-film-900/40 p-5 text-sm text-film-300">
              Start typing to search TMDb and add a film.
            </div>
          ) : null}

          {results.length > 0 ? (
            <div className="grid gap-3">
              {results.map((movie) => {
                const normalizedMovie = normalizeMovie(movie);
                const isSelected = selectedIds.has(String(normalizedMovie.id));
                const posterUrl = movie.poster_path ? getImageUrl(movie.poster_path, 'w342') : '';

                return (
                  <div
                    key={movie.id}
                    className={[
                      'overflow-hidden rounded-2xl border transition',
                      isSelected ? 'border-green-500/30 bg-green-500/10' : 'border-white/10 bg-film-950/70',
                    ].join(' ')}
                  >
                    <div className="flex gap-3 p-3">
                      <div className="h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-film-800">
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-sm font-semibold text-white">{movie.title}</h4>
                        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-film-400">
                          {formatYear(movie.release_date)}
                        </p>
                        <p className="mt-2 text-xs text-film-300">
                          Rating {Number(movie.vote_average || 0).toFixed(1)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-between gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-film-300">
                          {isSelected ? 'Added' : 'New'}
                        </span>
                        <button
                          type="button"
                          onClick={() => (isSelected ? removeMovie(movie.id) : addMovie(movie))}
                          disabled={!isSelected && value.length >= maxSelections}
                          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-film-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSelected ? 'Remove' : value.length >= maxSelections ? 'Limit reached' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : loading ? (
            <div className="grid gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
              ))}
            </div>
          ) : query.trim() ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-film-900/40 p-5 text-sm text-film-300">
              No movies found for this search.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}