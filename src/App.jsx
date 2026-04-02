import { Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Feed from './pages/Feed';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/users/:userId" element={<PublicProfile />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/movie/:movieId" element={<MovieDetail />} />
      <Route
        path="*"
        element={
          <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
            <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
              <p className="text-sm uppercase tracking-[0.35em] text-film-300">
                Filmatic
              </p>
              <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
            </div>
          </main>
        }
      />
    </Routes>
  );
}