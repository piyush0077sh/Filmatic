import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase/firebase';

export default function Navbar() {
  const { user, loading, logOut } = useAuth();
  const firebaseReady = isFirebaseConfigured();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-film-700 bg-film-900/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition hover:opacity-80 shrink-0">
          <img
            src="/logo.png"
            alt="Filmatic"
            className="h-10 w-10 rounded-xl bg-film-950/60 object-contain p-1 sm:h-12 sm:w-12"
          />
          <div className="hidden sm:block">
            <p className="text-base sm:text-lg font-bold tracking-tight text-white">Filmatic</p>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-film-400">
              Cinema
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-film-300">
          <Link
            to="/#trending"
            className="rounded-lg px-3 py-2 transition border border-transparent hover:border-green-600/30 hover:text-green-400"
          >
            Trending
          </Link>
          <Link
            to="/discover"
            className="rounded-lg px-3 py-2 transition border border-transparent hover:border-green-600/30 hover:text-green-400"
          >
            Discover
          </Link>
          {firebaseReady ? (
            <>
              <Link
                to="/feed"
                className="rounded-lg px-3 py-2 transition border border-transparent hover:border-green-600/30 hover:text-green-400"
              >
                Feed
              </Link>
              {loading ? null : user ? (
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    to="/profile"
                    className="rounded-lg px-3 py-2 transition border border-transparent hover:border-green-600/30 hover:text-green-400"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={logOut}
                    className="rounded-lg px-3 py-2 transition bg-orange-600 hover:bg-orange-500 text-white font-semibold border border-orange-600 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="rounded-lg px-3 py-2 transition bg-orange-600 hover:bg-orange-500 text-white font-semibold border border-orange-600 text-sm"
                >
                  Login
                </Link>
              )}
            </>
          ) : null}
        </nav>

        {/* Mobile Menu Button + Auth */}
        <div className="md:hidden flex items-center gap-2">
          {firebaseReady && loading === false && user === null && (
            <Link
              to="/auth"
              className="rounded-lg px-2 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold border border-orange-600 text-xs"
            >
              Login
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-green-400 hover:text-green-300 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-film-700 bg-film-800/50 backdrop-blur">
          <nav className="flex flex-col gap-2 p-4 text-sm font-medium text-film-300">
            <Link
              to="/#trending"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 transition border border-transparent hover:border-green-600/30 hover:text-green-400"
            >
              Trending
            </Link>
            <Link
              to="/discover"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 transition border border-transparent hover:border-green-600/30 hover:text-green-400"
            >
              Discover
            </Link>
            {firebaseReady ? (
              <>
                <Link
                  to="/feed"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 transition border border-transparent hover:border-green-600/30 hover:text-green-400"
                >
                  Feed
                </Link>
                {loading ? null : user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-2 transition border border-transparent hover:border-green-600/30 hover:text-green-400"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left rounded-lg px-3 py-2 transition bg-orange-600 hover:bg-orange-500 text-white font-semibold border border-orange-600 text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : null}
              </>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}