import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase/firebase';

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading, authError, setAuthError, signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [navigate, user]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isConfigured) {
      setLocalError('Firebase configuration is missing. Add the VITE_FIREBASE_* values first.');
      return;
    }

    try {
      setSubmitting(true);
      setLocalError('');
      setAuthError('');

      if (mode === 'signup') {
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }

      navigate('/', { replace: true });
    } catch (requestError) {
      setLocalError(requestError.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    !firebaseReady ? (
      <Navigate to="/" replace />
    ) : (
    <main className="min-h-screen bg-film-900 text-film-100">
      <Navbar />

      <section className="mx-auto flex max-w-6xl items-center justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/25 backdrop-blur sm:p-8">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-film-300">Account</p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              {mode === 'signup' ? 'Create your Filmatic account' : 'Sign in to Filmatic'}
            </h1>
            <p className="text-sm leading-6 text-slate-300">
              Start with movie discovery now. Reviews, follows, and feeds come next.
            </p>
          </div>

          {!isConfigured ? (
            <div className="mt-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
              Firebase is not configured yet. Add your `VITE_FIREBASE_*` values before using auth.
            </div>
          ) : null}

          {loading ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              Checking authentication state...
            </div>
          ) : user ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              You are signed in as {user.email}.
              <div className="mt-4">
                <Link
                  to="/"
                  className="inline-flex rounded-full border border-film-400/30 bg-film-400/10 px-4 py-2 text-sm font-medium text-film-100 transition hover:border-film-400/60 hover:bg-film-400/20"
                >
                  Go home
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {mode === 'signup' ? (
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Display name</span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-film-400/60"
                    placeholder="Your name"
                    required
                  />
                </label>
              ) : null}

              <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
                    mode === 'login' ? 'bg-white text-slate-950' : 'text-slate-300'
                  }`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
                    mode === 'signup' ? 'bg-white text-slate-950' : 'text-slate-300'
                  }`}
                >
                  Sign up
                </button>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-film-400/60"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-film-400/60"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </label>

              {(localError || authError) ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {localError || authError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-film-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Log in'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
    )
  );
}