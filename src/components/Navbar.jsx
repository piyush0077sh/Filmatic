import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase/firebase';

export default function Navbar() {
  const { user, loading, logOut } = useAuth();
  const firebaseReady = isFirebaseConfigured();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-film-400 to-film-700 text-sm font-semibold text-white shadow-lg shadow-film-500/20">
            FV
          </span>
          <div>
            <p className="text-base font-semibold tracking-wide text-white">Filmatic</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Movies only
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-3 text-sm text-slate-300">
          <a
            href="#trending"
            className="rounded-full border border-white/10 px-4 py-2 transition hover:border-film-400/50 hover:text-white"
          >
            Trending
          </a>
          <a
            href="#discover"
            className="rounded-full border border-white/10 px-4 py-2 transition hover:border-film-400/50 hover:text-white"
          >
            Discover
          </a>
          {firebaseReady ? (
            <>
              <Link
                to="/feed"
                className="rounded-full border border-white/10 px-4 py-2 transition hover:border-film-400/50 hover:text-white"
              >
                Feed
              </Link>
              {loading ? null : user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="rounded-full border border-white/10 px-4 py-2 transition hover:border-film-400/50 hover:text-white"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={logOut}
                    className="rounded-full border border-white/10 px-4 py-2 transition hover:border-film-400/50 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="rounded-full border border-white/10 px-4 py-2 transition hover:border-film-400/50 hover:text-white"
                >
                  Login
                </Link>
              )}
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}