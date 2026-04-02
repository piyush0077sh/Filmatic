export default function ReviewForm({
  content,
  rating,
  onContentChange,
  onRatingChange,
  onSubmit,
  submitting,
}) {
  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Write a review</h3>
          <p className="mt-1 text-sm text-slate-300">
            Share your take on the movie. This review will be saved to Firestore.
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Rating</span>
          <select
            value={rating}
            onChange={(event) => onRatingChange(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-film-400/60"
          >
            <option value="">No rating</option>
            {Array.from({ length: 10 }).map((_, index) => {
              const score = index + 1;

              return (
                <option key={score} value={score}>
                  {score}/10
                </option>
              );
            })}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Review</span>
          <textarea
            value={content}
            onChange={(event) => onContentChange(event.target.value)}
            rows={5}
            placeholder="What worked, what didn’t, and why it matters..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-film-400/60"
            required
            minLength={10}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-film-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Publishing...' : 'Post review'}
        </button>
      </div>
    </form>
  );
}