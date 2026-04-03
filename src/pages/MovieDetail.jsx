import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import { useAuth } from '../context/AuthContext';
import { createMovieReview, subscribeToMovieReviews } from '../services/reviews';
import { isFirebaseConfigured } from '../firebase/firebase';
import { getImageUrl, getMovieDetails } from '../services/tmdbApi';

function formatRuntime(runtime) {
  if (!runtime) {
    return 'Runtime unavailable';
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return `${hours}h ${minutes}m`;
}

export default function MovieDetail() {
  const { movieId } = useParams();
  const location = useLocation();
  const initialMovie = location.state?.movie || null;
  const { user } = useAuth();

  const [movie, setMovie] = useState(initialMovie);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(!initialMovie);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewsError, setReviewsError] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadMovie() {
      try {
        setLoading(true);
        setError('');

        const data = await getMovieDetails(movieId);

        if (!active) {
          return;
        }

        setMovie(data);
      } catch (requestError) {
        if (!active) {
          return;
        }

        if (initialMovie) {
          setMovie(initialMovie);
        } else {
          setError('Unable to load this movie right now. Please try again later.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMovie();

    return () => {
      active = false;
    };
  }, [movieId, initialMovie]);

  useEffect(() => {
    let active = true;

    setReviewsLoading(true);
    setReviewsError('');

    if (!isFirebaseConfigured()) {
      setReviewsLoading(false);
      return undefined;
    }

    const unsubscribe = subscribeToMovieReviews(
      movieId,
      (nextReviews) => {
        if (!active) {
          return;
        }

        setReviews(nextReviews);
        setReviewsLoading(false);
      },
      () => {
        if (!active) {
          return;
        }

        setReviewsError('Unable to load reviews right now.');
        setReviews([]);
        setReviewsLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [movieId]);

  async function handleReviewSubmit(event) {
    event.preventDefault();

    if (!user) {
      setReviewSubmitError('Sign in to post a review.');
      return;
    }

    if (!movie) {
      setReviewSubmitError('Movie data is still loading.');
      return;
    }

    const trimmedContent = reviewContent.trim();

    if (trimmedContent.length < 10) {
      setReviewSubmitError('Write at least 10 characters for your review.');
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewSubmitError('');

      await createMovieReview({
        movieId,
        movieTitle: movie.title,
        moviePosterPath: movie.poster_path,
        user,
        content: trimmedContent,
        rating: reviewRating ? Number(reviewRating) : null,
      });

      setReviewContent('');
      setReviewRating('');
    } catch (requestError) {
      setReviewSubmitError(requestError.message || 'Unable to post review right now.');
    } finally {
      setReviewSubmitting(false);
    }
  }

  const posterUrl = movie?.poster_path ? getImageUrl(movie.poster_path, 'w780') : '';
  const backdropUrl = movie?.backdrop_path ? getImageUrl(movie.backdrop_path, 'w1280') : '';

  return (
    <main className="min-h-screen bg-film-900 text-film-100">
      <Navbar />

      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-0"
          style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link to="/" className="inline-flex items-center text-sm text-slate-300 transition hover:text-white">
            ← Back to home
          </Link>

          {loading ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
              <div className="h-[480px] animate-pulse rounded-3xl border border-white/10 bg-white/5" />
              <div className="space-y-4">
                <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-white/5" />
                <div className="h-5 w-1/3 animate-pulse rounded-2xl bg-white/5" />
                <div className="h-32 w-full animate-pulse rounded-3xl bg-white/5" />
              </div>
            </div>
          ) : error ? (
            <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
              {error}
            </div>
          ) : movie ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/25">
                {posterUrl ? (
                  <img src={posterUrl} alt={movie.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-[480px] items-center justify-center px-6 text-center text-sm text-slate-400">
                    Poster unavailable
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.35em] text-film-300">
                    Movie detail
                  </p>
                  <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    {movie.title}
                  </h1>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                    <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}</span>
                    <span>•</span>
                    <span>{formatRuntime(movie.runtime)}</span>
                    <span>•</span>
                    <span>{movie.vote_average ? `${Number(movie.vote_average).toFixed(1)}/10` : 'No rating'}</span>
                  </div>
                </div>

                {movie.genres?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-lg font-semibold text-white">Overview</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {movie.overview || 'No overview available for this title.'}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {isFirebaseConfigured() ? (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-film-300">Reviews</p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Filmatic reviews</h2>
            </div>
          </div>

          {user ? (
            <div className="mt-6 space-y-4">
              <ReviewForm
                content={reviewContent}
                rating={reviewRating}
                onContentChange={setReviewContent}
                onRatingChange={setReviewRating}
                onSubmit={handleReviewSubmit}
                submitting={reviewSubmitting}
              />
              {reviewSubmitError ? (
                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {reviewSubmitError}
                </div>
              ) : null}
            </div>
          ) : null}

          {reviewsLoading ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-3xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : reviewsError ? (
            <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
              {reviewsError}
            </div>
          ) : reviews.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : user ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              No Filmatic reviews yet. Be the first to post one.
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}