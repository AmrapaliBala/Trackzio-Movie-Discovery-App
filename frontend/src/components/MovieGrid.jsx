import MovieCard from "./MovieCard";
import EmptyState from "./EmptyState";


const MovieGrid = ({ movies }) => {

  if (!movies.length) {

    return (

      <EmptyState
        title="No movies found"
        description="Try a different title, genre, or search term."
      />

    );
  }


  return (

    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

      {movies.map((movie) => (

        <MovieCard
          key={movie.id}
          movie={movie}
        />

      ))}

    </div>
  );
};


export default MovieGrid;