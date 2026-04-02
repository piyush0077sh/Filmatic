import MovieCard from './MovieCard';

export default function MovieRow({ title, subtitle, movies }) {
  return (
    <section id="trending" className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-film-300">{subtitle}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
        </div>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="grid grid-flow-col auto-cols-[minmax(180px,220px)] gap-4 sm:auto-cols-[minmax(200px,1fr)] sm:grid-flow-row sm:grid-cols-2 lg:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}