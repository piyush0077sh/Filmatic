import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import { getGenres, discoverMovies, searchMovies } from '../services/tmdbApi';

const SORT_OPTIONS = [
  { label: 'Popularity: High to Low', value: 'popularity.desc' },
  { label: 'Popularity: Low to High', value: 'popularity.asc' },
  { label: 'Release Date: Newest', value: 'primary_release_date.desc' },
  { label: 'Release Date: Oldest', value: 'primary_release_date.asc' },
  { label: 'Rating: High to Low', value: 'vote_average.desc' },
];

function isTmdbConnectivityError(message) {
  return /timed out|failed to fetch|500/i.test(message || '');
}

function normalizeMovies(results) {
  if (!Array.isArray(results)) {
    return [];
  }

  return results;
}

function filterMoviesByTitle(movies, titleQuery) {
  const trimmedQuery = titleQuery.trim().toLowerCase();

  if (!trimmedQuery) {
    return movies;
  }

  return movies.filter((movie) => String(movie.title || '').toLowerCase().includes(trimmedQuery));
}

export default function Discover() {
  const [genres, setGenres] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [filtersError, setFiltersError] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [genreIds, setGenreIds] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [year, setYear] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [minVoteAverage, setMinVoteAverage] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);

  const selectedGenreLabels = useMemo(() => {
    const genreMap = new Map(genres.map((genre) => [String(genre.id), genre.name]));

    return genreIds.map((genreId) => genreMap.get(String(genreId))).filter(Boolean);
  }, [genres, genreIds]);

  useEffect(() => {
    let active = true;

    async function loadGenres() {
      try {
        setFiltersLoading(true);
        setFiltersError('');

        const data = await getGenres();

        if (!active) {
          return;
        }

        setGenres(normalizeMovies(data.genres));
      } catch (requestError) {
        if (!active) {
          return;
        }

        setFiltersError(
          isTmdbConnectivityError(requestError.message)
            ? 'TMDb is unreachable right now. Discover filters are limited until connectivity returns.'
            : requestError.message || 'Unable to load movie genres right now.',
        );
      } finally {
        if (active) {
          setFiltersLoading(false);
        }
      }
    }

    loadGenres();

    return () => {
      active = false;
    };
  }, []);

  function buildRequestParams(nextPage) {
    const trimmedQuery = query.trim();

    return {
      page: nextPage,
      query: trimmedQuery,
      includeAdult,
      sortBy,
      genreIds,
      year: year.trim(),
      yearFrom: yearFrom.trim(),
      yearTo: yearTo.trim(),
      minVoteAverage: minVoteAverage.trim(),
    };
  }

  function isPureTitleSearch() {
    return Boolean(
      query.trim() &&
        !genreIds.length &&
        !year.trim() &&
        !yearFrom.trim() &&
        !yearTo.trim() &&
        !minVoteAverage.trim() &&
        !includeAdult &&
        sortBy === 'popularity.desc',
    );
  }

  async function fetchMovies(nextPage, replaceResults) {
    const requestParams = buildRequestParams(nextPage);
    const trimmedQuery = requestParams.query;
    const searchOnly = isPureTitleSearch();
    const requestFn = searchOnly ? searchMovies : discoverMovies;

    const apiArgs = searchOnly
      ? [trimmedQuery, nextPage]
      : [
          {
            includeAdult,
            sortBy,
            genreIds,
            year: year.trim(),
            yearFrom: yearFrom.trim(),
            yearTo: yearTo.trim(),
            minVoteAverage: minVoteAverage.trim(),
          },
          nextPage,
        ];

    try {
      if (replaceResults) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError('');

      const data = await requestFn(...apiArgs);
      const nextMovies = searchOnly
        ? normalizeMovies(data.results)
        : filterMoviesByTitle(normalizeMovies(data.results), trimmedQuery);

      setMovies((currentMovies) => {
        return replaceResults ? nextMovies : [...currentMovies, ...nextMovies];
      });
      setPage(Number(data.page || nextPage));
      setTotalPages(Number(data.total_pages || 1));
      setHasLoaded(true);
    } catch (requestError) {
      setError(
        isTmdbConnectivityError(requestError.message)
          ? 'TMDb is unreachable from this network right now. Discover is using the local app only.'
          : requestError.message || 'Unable to load movies right now. Please try again.',
      );
      setMovies([]);
      setPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchMovies(1, true);
    }, 250);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, genreIds, sortBy, year, yearFrom, yearTo, minVoteAverage, includeAdult]);

  const canLoadMore = page < totalPages;

  return (
    <>
      <main className="min-h-screen bg-film-900 text-film-100">
        <Navbar />

        <section className="border-b border-film-800">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="max-w-4xl space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-green-500">
                Discover
              </p>
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
                Search deeper, filter harder, and find your next watch
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-film-400 font-medium">
                Advanced movie search with genre filters, year controls, sorting, and manual paging.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-film-400">Filters</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Tune the catalog</h2>
              </div>

              <div className="mt-6 space-y-4">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-film-200">Title search</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by title"
                    className="rounded-2xl border border-white/10 bg-film-900 px-4 py-3 text-white outline-none transition focus:border-green-500/40"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-film-200">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="rounded-2xl border border-white/10 bg-film-900 px-4 py-3 text-white outline-none transition focus:border-green-500/40"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-film-200">Year</span>
                    <input
                      value={year}
                      onChange={(event) => setYear(event.target.value)}
                      placeholder="2024"
                      inputMode="numeric"
                      className="rounded-2xl border border-white/10 bg-film-900 px-4 py-3 text-white outline-none transition focus:border-green-500/40"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-film-200">Min rating</span>
                    <input
                      value={minVoteAverage}
                      onChange={(event) => setMinVoteAverage(event.target.value)}
                      placeholder="7.5"
                      inputMode="decimal"
                      className="rounded-2xl border border-white/10 bg-film-900 px-4 py-3 text-white outline-none transition focus:border-green-500/40"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-film-200">From year</span>
                    <input
                      value={yearFrom}
                      onChange={(event) => setYearFrom(event.target.value)}
                      placeholder="2000"
                      inputMode="numeric"
                      className="rounded-2xl border border-white/10 bg-film-900 px-4 py-3 text-white outline-none transition focus:border-green-500/40"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-film-200">To year</span>
                    <input
                      value={yearTo}
                      onChange={(event) => setYearTo(event.target.value)}
                      placeholder="2026"
                      inputMode="numeric"
                      className="rounded-2xl border border-white/10 bg-film-900 px-4 py-3 text-white outline-none transition focus:border-green-500/40"
                    />
                  </label>
                </div>

                <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-film-900 px-4 py-3">
                  <div>
                    <span className="block text-sm font-medium text-film-200">Include adult content</span>
                    <span className="mt-1 block text-xs text-film-400">Allow mature titles in results</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeAdult}
                    onChange={(event) => setIncludeAdult(event.target.checked)}
                    className="h-5 w-5 rounded border-white/20 bg-film-800 text-green-500 focus:ring-green-500/40"
                  />
                </label>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-film-200">Genres</span>
                    <button
                      type="button"
                      onClick={() => setGenreIds([])}
                      className="text-xs font-semibold uppercase tracking-[0.25em] text-film-400 transition hover:text-white"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="mt-3 max-h-64 space-y-2 overflow-auto rounded-2xl border border-white/10 bg-film-900 p-3">
                    {filtersLoading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div key={index} className="h-8 animate-pulse rounded-xl bg-white/5" />
                        ))}
                      </div>
                    ) : genres.length > 0 ? (
                      genres.map((genre) => {
                        const checked = genreIds.includes(genre.id);

                        return (
                          <label
                            key={genre.id}
                            className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 transition hover:bg-white/5"
                          >
                            <span className="text-sm text-film-200">{genre.name}</span>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) => {
                                setGenreIds((currentGenreIds) =>
                                  event.target.checked
                                    ? [...currentGenreIds, genre.id]
                                    : currentGenreIds.filter((genreId) => genreId !== genre.id),
                                );
                              }}
                              className="h-4 w-4 rounded border-white/20 bg-film-800 text-green-500 focus:ring-green-500/40"
                            />
                          </label>
                        );
                      })
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-film-300">
                        No genres available right now.
                      </div>
                    )}
                  </div>
                </div>

                {selectedGenreLabels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedGenreLabels.map((label) => (
                      <span
                        key={label}
                        className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                ) : null}

                {filtersError ? (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                    {filtersError}
                  </div>
                ) : null}
              </div>
            </aside>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-film-400">Results</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {query.trim() ? `Search: ${query.trim()}` : 'Discover results'}
                  </h2>
                </div>
                <div className="text-sm text-film-300">
                  {movies.length} titles loaded
                </div>
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-[360px] animate-pulse rounded-3xl border border-white/10 bg-white/5"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
                  {error}
                </div>
              ) : movies.length > 0 ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>

                  <div className="flex items-center justify-center pt-2">
                    {canLoadMore ? (
                      <button
                        type="button"
                        onClick={() => fetchMovies(page + 1, false)}
                        disabled={loadingMore}
                        className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-film-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loadingMore ? 'Loading more...' : 'Load more'}
                      </button>
                    ) : hasLoaded ? (
                      <p className="text-sm text-film-400">You have reached the end of the results.</p>
                    ) : null}
                  </div>
                </>
              ) : hasLoaded ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-film-300">
                  No movies match the current filters.
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-film-300">
                  Adjust a filter or search title to load discoveries.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}