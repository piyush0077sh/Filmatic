import { useEffect, useState } from 'react';
import FavoriteMoviePicker from './FavoriteMoviePicker';

export default function EditProfileModal({ isOpen, user, onClose, onSave, saving = false }) {
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    if (!isOpen || !user) {
      return;
    }

    setDisplayName(user.displayName || '');
    setPhotoURL(user.photoURL || '');
    setBio(user.bio || '');
    setLocation(user.location || '');
    setFavoriteMovies(Array.isArray(user.favoriteMovies) ? user.favoriteMovies.slice(0, 8) : []);
  }, [isOpen, user]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-film-900 p-6 shadow-2xl shadow-black/40 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-film-400">Edit profile</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Refine your profile</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-2 text-sm text-film-300 transition hover:border-white/20 hover:text-white"
          >
            Close
          </button>
        </div>

        <form
          className="mt-6 grid gap-5"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSave({ displayName, photoURL, bio, location, favoriteMovies });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-film-200">Display name</span>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-green-500/40"
                placeholder="Your public name"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-film-200">Photo URL</span>
              <input
                value={photoURL}
                onChange={(event) => setPhotoURL(event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-green-500/40"
                placeholder="https://..."
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-film-200">Bio</span>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={4}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-green-500/40"
                placeholder="Tell people what you love about film"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-film-200">Location</span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-green-500/40"
                placeholder="City, country"
              />
            </label>
          </div>

          <FavoriteMoviePicker value={favoriteMovies} onChange={setFavoriteMovies} maxSelections={8} />

          <div className="mt-2 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-film-200 transition hover:border-white/20 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-film-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}