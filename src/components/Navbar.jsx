import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase/firebase';

export default function Navbar() {
  const { user, loading, logOut } = useAuth();
  const firebaseReady = isFirebaseConfigured();

  return (
    <header className="sticky top-0 z-20 border-b border-gold-500/20 bg-gradient-to-r from-film-900/95 via-film-800/95 to-film-900/95 backdrop-blur-xl shadow-premium">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 transition hover:opacity-80">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-xs font-bold text-film-900 shadow-lg shadow-gold-500/30">
            FM
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">Filmatic</p>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold-400">
              Cinema
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium text-film-200">
          <Link
            to="/#trending"
            className="rounded-lg px-4 py-2 transition border border-gold-500/30 hover:border-gold-400 hover:text-gold-300 hover:bg-gold-500/10"
          >
            Trending
          </Link>
          <Link
            to="/#discover"
            className="rounded-lg px-4 py-2 transition border border-emerald-500/30 hover:border-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
          >
            Discover
          </Link>
          {firebaseReady ? (
            <>
              <Link
                to="/feed"
                className="rounded-lg px-4 py-2 transition border border-gold-500/30 hover:border-gold-400 hover:text-gold-300 hover:bg-gold-500/10"
              >
                Feed
              </Link>
              {loading ? null : user ? (
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    to="/profile"
                    className="rounded-lg px-4 py-2 transition border border-emerald-500/30 hover:border-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={logOut}
                    className="rounded-lg px-4 py-2 transition bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-film-900 font-semibold shadow-lg shadow-gold-500/30"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="rounded-lg px-4 py-2 transition bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-film-900 font-semibold shadow-lg shadow-gold-500/30"
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