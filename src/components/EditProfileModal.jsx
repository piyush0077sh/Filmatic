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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-4 backdrop-blur-sm sm:py-6">
      <div className="w-full max-w-[1180px] overflow-hidden rounded-[2rem] border border-white/10 bg-film-900 shadow-2xl shadow-black/50">
        <form
          className="flex max-h-[calc(100vh-2rem)] min-h-0 flex-col gap-5 p-5 sm:p-6 lg:p-8"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSave({ displayName, photoURL, bio, location, favoriteMovies });
          }}
        >
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

          <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="grid content-start gap-4">
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

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-film-400">Preview</p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-film-300">Selected films are saved to your profile and can be reordered here.</p>
                  <p className="text-sm text-film-300">Use the search panel to add movies, then drag or arrow them into place.</p>
                </div>
              </div>
            </div>

            <div className="min-h-0 overflow-y-auto pr-1">
              <FavoriteMoviePicker value={favoriteMovies} onChange={setFavoriteMovies} maxSelections={8} />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-4">
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