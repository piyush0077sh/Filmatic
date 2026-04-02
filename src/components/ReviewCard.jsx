import { Link } from 'react-router-dom';

function formatCreatedAt(createdAt) {
  if (!createdAt) {
    return 'Recent';
  }

  if (typeof createdAt.toDate === 'function') {
    return createdAt.toDate().toLocaleDateString();
  }

  if (typeof createdAt === 'string' || createdAt instanceof Date) {
    return new Date(createdAt).toLocaleDateString();
  }

  return 'Recent';
}

export default function ReviewCard({ review, showMovieTitle = false }) {
  const authorName = review.userName || review.author || 'Anonymous';
  const rating = review.rating || review.author_details?.rating;
  const authorLink = review.userId ? `/users/${review.userId}` : null;

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          {authorLink ? (
            <Link to={authorLink} className="font-semibold text-white transition hover:text-film-200">
              {authorName}
            </Link>
          ) : (
            <h3 className="font-semibold text-white">{authorName}</h3>
          )}
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
            {formatCreatedAt(review.createdAt || review.created_at)}
          </p>
        </div>
        {rating ? (
          <div className="rounded-full border border-film-400/30 bg-film-400/10 px-2.5 py-1 text-xs font-medium text-film-200">
            {rating}/10
          </div>
        ) : null}
      </div>

      {showMovieTitle && review.movieTitle ? (
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-film-300">
          {review.movieId ? (
            <Link to={`/movie/${review.movieId}`} className="transition hover:text-white">
              {review.movieTitle}
            </Link>
          ) : (
            review.movieTitle
          )}
        </p>
      ) : null}

      <p className="mt-4 line-clamp-6 text-sm leading-6 text-slate-300">
        {review.content?.trim() || 'No review content available.'}
      </p>
    </article>
  );
}