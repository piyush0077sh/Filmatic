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
    <main className="min-h-screen bg-gradient-to-b from-film-900 via-film-950 to-film-950 text-film-100">
      <Navbar />

      <section className="relative overflow-hidden border-b border-gold-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,149,74,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.08),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">
          <div className="max-w-4xl space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-gold-400">
                Cinematic Social
              </p>
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
                Discover, discuss, and track the <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">movies</span> people actually care about
              </h1>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-film-300 font-medium">
              Filmatic is a premium social layer for movie enthusiasts. Experience trending cinema, share authentic reviews, and connect with fellow film lovers in real-time.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row" role="search">
              <label className="sr-only" htmlFor="movie-search">
                Search movies
              </label>
              <input
                id="movie-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search movies, genres, or titles..."
                className="w-full rounded-xl border border-gold-500/30 bg-gradient-to-r from-film-800/40 to-film-900/40 px-5 py-4 text-sm text-white placeholder:text-film-400 outline-none transition focus:border-gold-400/60 focus:from-film-800/60 focus:to-film-900/60 focus:ring-1 focus:ring-gold-500/20 font-medium"
              />
              <div className="flex items-center rounded-xl border border-gold-500/30 bg-gradient-to-r from-gold-500/10 to-gold-600/5 px-6 py-4 text-sm font-semibold text-gold-300 sm:min-w-48 sm:justify-center shadow-lg shadow-gold-500/10">
                {searchLoading ? 'Searching...' : '🔍 Live search'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="discover" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {searchQuery.trim() ? (
          searchLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[360px] animate-pulse rounded-2xl border border-gold-500/20 bg-gradient-to-br from-film-800/40 to-film-900/40"
                />
              ))}
            </div>
          ) : searchError ? (
            <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5 p-8 text-center text-red-200 shadow-lg shadow-red-500/10">
              <p className="font-semibold">{searchError}</p>
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