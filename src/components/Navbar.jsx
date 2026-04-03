import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase/firebase';

export default function Navbar() {
  const { user, loading, logOut } = useAuth();
  const firebaseReady = isFirebaseConfigured();

  return (
    <header className="sticky top-0 z-20 border-b border-film-700 bg-film-900/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 transition hover:opacity-80">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-film-800 border border-green-600/50 text-xs font-bold text-green-400">
            FM
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">Filmatic</p>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-film-400">
              Cinema
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium text-film-300">
          <Link
            to="/#trending"
            className="rounded-lg px-4 py-2 transition border border-transparent hover:border-green-600/30 hover:text-green-400"
          >
            Trending
          </Link>
          <Link
            to="/#discover"
            className="rounded-lg px-4 py-2 transition border border-transparent hover:border-green-600/30 hover:text-green-400"
          >
            Discover
          </Link>
          {firebaseReady ? (
            <>
              <Link
                to="/feed"
                className="rounded-lg px-4 py-2 transition border border-transparent hover:border-green-600/30 hover:text-green-400"
              >
                Feed
              </Link>
              {loading ? null : user ? (
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    to="/profile"
                    className="rounded-lg px-4 py-2 transition border border-transparent hover:border-green-600/30 hover:text-green-400"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={logOut}
                    className="rounded-lg px-4 py-2 transition bg-orange-600 hover:bg-orange-500 text-white font-semibold border border-orange-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="rounded-lg px-4 py-2 transition bg-orange-600 hover:bg-orange-500 text-white font-semibold border border-orange-600"
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