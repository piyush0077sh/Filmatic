import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MovieRow from '../components/MovieRow';
import { getTrendingMovies, searchMovies } from '../services/tmdbApi';

const FALLBACK_MOVIES = [
  {
    id: 'fallback-1',
    title: 'Interstellar',
    release_date: '2014-11-07',
    vote_average: 8.4,
    overview: 'A journey through space, time, and what people leave behind.',
    noLink: true,
  },
  {
    id: 'fallback-2',
    title: 'The Dark Knight',
    release_date: '2008-07-18',
    vote_average: 9.0,
    overview: 'Batman faces a chaotic adversary in a city pushed to the edge.',
    noLink: true,
  },
  {
    id: 'fallback-3',
    title: 'Inception',
    release_date: '2010-07-16',
    vote_average: 8.8,
    overview: 'A thief enters dreams to plant an idea that could change everything.',
    noLink: true,
  },
  {
    id: 'fallback-4',
    title: 'Arrival',
    release_date: '2016-11-11',
    vote_average: 7.9,
    overview: 'A linguist tries to communicate with visitors from beyond Earth.',
    noLink: true,
  },
];

function isTmdbConnectivityError(message) {
  return /timed out|failed to fetch|500/i.test(message || '');
}

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadTrendingMovies() {
      try {
        setLoading(true);
        setError('');

        const data = await getTrendingMovies('week');

        if (!active) {
          return;
        }

        setMovies(Array.isArray(data.results) ? data.results.slice(0, 8) : []);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setMovies(FALLBACK_MOVIES);
        setError(
          isTmdbConnectivityError(requestError.message)
            ? 'TMDb is unreachable from this network right now, so showing a local preview instead.'
            : requestError.message || 'TMDb is not responding right now, so showing a local preview instead.',
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTrendingMovies();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function runSearch() {
      const query = searchQuery.trim();

      if (!query) {
        setSearchResults([]);
        setSearchError('');
        setSearchLoading(false);
        return;
      }

      try {
        setSearchLoading(true);
        setSearchError('');

        const data = await searchMovies(query);

        if (!active) {
          return;
        }

        setSearchResults(Array.isArray(data.results) ? data.results.slice(0, 8) : []);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setSearchError(
          isTmdbConnectivityError(requestError.message)
            ? 'TMDb is unreachable from this network right now. Search is using the local app only.'
            : requestError.message || 'Unable to search movies right now. Please try again.',
        );
        setSearchResults([]);
      } finally {
        if (active) {
          setSearchLoading(false);
        }
      }
    }

    const timeoutId = window.setTimeout(runSearch, 350);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(72,93,245,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm uppercase tracking-[0.35em] text-film-300">
              Social movie discovery
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover, discuss, and track the movies people actually care about.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Filmatic is a cinematic social layer for movie fans. Start with trending titles,
              then build your watchlist, reviews, and community feed from there.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row" role="search">
              <label className="sr-only" htmlFor="movie-search">
                Search movies
              </label>
              <input
                id="movie-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search movies, genres, or titles"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-film-400/60 focus:bg-white/8"
              />
              <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 sm:min-w-40 sm:justify-center">
                {searchLoading ? 'Searching...' : 'Live search'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="discover" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {searchQuery.trim() ? (
          searchLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[360px] animate-pulse rounded-3xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : searchError ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
              {searchError}
            </div>
          ) : searchResults.length > 0 ? (
            <MovieRow title="Search Results" subtitle="Matching titles" movies={searchResults} />
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              No movies found for "{searchQuery.trim()}".
            </div>
          )
        ) : null}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[360px] animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        ) : error ? (
          <>
            <div className="mb-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 text-sm text-amber-100">
              {error}
            </div>
            <MovieRow title="Trending Movies" subtitle="Fallback preview" movies={movies} />
          </>
        ) : (
          <MovieRow title="Trending Movies" subtitle="This week" movies={movies} />
        )}
      </section>
    </main>
  );
}