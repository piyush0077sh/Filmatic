import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-film-800 bg-film-950 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Filmatic"
                className="h-11 w-11 rounded-xl bg-film-900/70 object-contain p-1"
              />
              <p className="text-lg font-bold text-white">Filmatic</p>
            </div>
            <p className="mt-2 text-sm text-film-400">
              Made with passion for cinema
            </p>
          </div>

          {/* Feedback & Credits */}
          <div>
            <p className="text-sm font-semibold text-film-300 uppercase tracking-[0.2em]">
              Feedback
            </p>
            <Link
              to="/feedback"
              className="mt-4 inline-block text-sm text-green-400 transition hover:text-green-300"
            >
              Share your feedback →
            </Link>
          </div>

          {/* Credits */}
          <div>
            <p className="text-sm font-semibold text-film-300 uppercase tracking-[0.2em]">
              Built by
            </p>
            <p className="mt-4 text-sm text-film-400">
              Piyush Singh
            </p>
            <p className="mt-2 text-xs text-film-600">
              Powered by TMDb API • © 2026 Filmatic
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
