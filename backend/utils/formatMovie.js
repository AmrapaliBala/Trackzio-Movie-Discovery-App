const formatMovie = (movie) => {
  const releaseDate =
    movie.Released && movie.Released !== "N/A"
      ? movie.Released
      : "";

  const year =
    movie.Year && movie.Year !== "N/A"
      ? movie.Year.substring(0, 4)
      : "";

  const rating =
    movie.imdbRating && movie.imdbRating !== "N/A"
      ? Number(movie.imdbRating)
      : 0;

  const genres =
    movie.Genre && movie.Genre !== "N/A"
      ? movie.Genre.split(",").map((genre) => genre.trim())
      : [];

  const genreIds = genres.map((genre) =>
    genre.toLowerCase().replace(/\s+/g, "-")
  );

  const actors =
    movie.Actors && movie.Actors !== "N/A"
      ? movie.Actors.split(",").map((actor) => actor.trim())
      : [];

  const directors =
    movie.Director && movie.Director !== "N/A"
      ? movie.Director.split(",").map((director) => director.trim())
      : [];

  const voteCount =
    movie.imdbVotes && movie.imdbVotes !== "N/A"
      ? Number(movie.imdbVotes.replace(/,/g, ""))
      : 0;

  return {
    id: movie.imdbID,

    title:
      movie.Title && movie.Title !== "N/A"
        ? movie.Title
        : "",

    originalTitle:
      movie.Title && movie.Title !== "N/A"
        ? movie.Title
        : "",

    overview:
      movie.Plot && movie.Plot !== "N/A"
        ? movie.Plot
        : "No description available.",

    poster:
      movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : "",

    backdrop:
      movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : "",

    releaseDate,

    year,

    rating,

    voteCount,

    popularity: rating,

    language:
      movie.Language && movie.Language !== "N/A"
        ? movie.Language
        : "",

    genreIds,

    genres,

    runtime:
      movie.Runtime && movie.Runtime !== "N/A"
        ? movie.Runtime
        : "",

    tagline: "",

    status: "Released",

    actors,

    directors,

    imdbId: movie.imdbID,

    imdbUrl: movie.imdbID
      ? `https://www.imdb.com/title/${movie.imdbID}/`
      : "",

    rated:
      movie.Rated && movie.Rated !== "N/A"
        ? movie.Rated
        : "",

    awards:
      movie.Awards && movie.Awards !== "N/A"
        ? movie.Awards
        : "",
  };
};

export default formatMovie;