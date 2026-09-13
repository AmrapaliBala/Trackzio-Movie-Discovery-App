import movieApi from "../config/movieApi.js";
import { getCache, setCache } from "../utils/cache.js";
import formatMovie from "../utils/formatMovie.js";

const SORT_OPTIONS = {
  popular: "popular",
  rating: "rating",
  newest: "newest",
  oldest: "oldest",
};

const HOME_MOVIES = [
  "Inception",
  "Interstellar",
  "The Matrix",
  "Gladiator",
  "Oppenheimer",
  "Parasite",
  "Joker",
  "Avatar",
  "The Dark Knight",
  "Forrest Gump",
];

const GENRES = [
  { id: "action", name: "Action" },
  { id: "adventure", name: "Adventure" },
  { id: "animation", name: "Animation" },
  { id: "comedy", name: "Comedy" },
  { id: "crime", name: "Crime" },
  { id: "drama", name: "Drama" },
  { id: "fantasy", name: "Fantasy" },
  { id: "horror", name: "Horror" },
  { id: "mystery", name: "Mystery" },
  { id: "romance", name: "Romance" },
  { id: "science-fiction", name: "Science Fiction" },
  { id: "thriller", name: "Thriller" },
];

// --------------------------------------------------
// OMDb REQUEST HELPER
// --------------------------------------------------

const requestMovieApi = async (params) => {
  if (!process.env.OMDB_API_KEY) {
    throw new Error("OMDB_API_KEY is not configured.");
  }

  try {
    const response = await movieApi.get("/", {
      params: {
        apikey: process.env.OMDB_API_KEY,
        ...params,
      },
    });

    const data = response.data;

    if (data.Response === "False") {
      const error = new Error(
        data.Error || "OMDb request failed."
      );

      error.omdbError = true;
      error.omdbMessage = data.Error;

      throw error;
    }

    return data;
  } catch (error) {
    if (error.omdbError) {
      throw error;
    }

    if (error.response?.status === 401) {
      throw new Error("Invalid OMDb API key.");
    }

    if (error.code === "ECONNABORTED") {
      throw new Error("OMDb request timed out.");
    }

    throw error;
  }
};

// --------------------------------------------------
// DATE HELPER
// --------------------------------------------------

const getReleaseTimestamp = (releaseDate) => {
  if (!releaseDate) {
    return 0;
  }

  /*
   * OMDb normally returns dates like:
   *
   * 31 Mar 1999
   * 19 Jul 2023
   * 18 Dec 2009
   *
   * We explicitly convert the date into a timestamp
   * instead of comparing the strings directly.
   */

  const parsedDate = new Date(releaseDate);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.getTime();
  }

  /*
   * Fallback for unexpected date formats.
   */

  const match = releaseDate.match(
    /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/
  );

  if (!match) {
    return 0;
  }

  const [, day, month, year] = match;

  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  if (months[month] === undefined) {
    return 0;
  }

  return new Date(
    Number(year),
    months[month],
    Number(day)
  ).getTime();
};

// --------------------------------------------------
// SORT
// --------------------------------------------------

const sortMovies = (movies, sortBy) => {
  const sorted = [...movies];

  switch (sortBy) {
    // -----------------------------------------------
    // TOP RATED
    // -----------------------------------------------

    case SORT_OPTIONS.rating:
      sorted.sort(
        (a, b) =>
          (b.rating || 0) - (a.rating || 0)
      );
      break;

    // -----------------------------------------------
    // NEWEST
    // -----------------------------------------------

    case SORT_OPTIONS.newest:
      sorted.sort(
        (a, b) =>
          getReleaseTimestamp(b.releaseDate) -
          getReleaseTimestamp(a.releaseDate)
      );
      break;

    // -----------------------------------------------
    // OLDEST
    // -----------------------------------------------

    case SORT_OPTIONS.oldest:
      sorted.sort(
        (a, b) =>
          getReleaseTimestamp(a.releaseDate) -
          getReleaseTimestamp(b.releaseDate)
      );
      break;

    // -----------------------------------------------
    // POPULAR
    // -----------------------------------------------

    case SORT_OPTIONS.popular:
    default:
      sorted.sort(
        (a, b) =>
          (b.rating || 0) - (a.rating || 0)
      );
      break;
  }

  return sorted;
};

// --------------------------------------------------
// GENRE FILTER
// --------------------------------------------------

const filterByGenre = (movies, genre) => {
  if (!genre) {
    return movies;
  }

  const selectedGenre = genre.toLowerCase();

  return movies.filter((movie) =>
    movie.genres?.some(
      (movieGenre) =>
        movieGenre.toLowerCase() === selectedGenre
    )
  );
};

// --------------------------------------------------
// GET MOVIES
// --------------------------------------------------

export const getMovies = async ({
  query = "",
  genre = "",
  sortBy = "popular",
  page = 1,
  year = "",
} = {}) => {
  const cleanQuery = query.trim();

  const currentPage = Math.max(
    1,
    Number(page) || 1
  );

  // ================================================
  // HOME / DISCOVERY
  // ================================================

  if (!cleanQuery) {
    const cacheKey = `home-movies-${year || "all"}`;

    const cachedMovies = getCache(cacheKey);

    if (cachedMovies) {
      let movies = [...cachedMovies];

      movies = filterByGenre(movies, genre);

      movies = sortMovies(movies, sortBy);

      return {
        movies,
        page: 1,
        totalPages: 1,
        totalResults: movies.length,
      };
    }

    const movieRequests = HOME_MOVIES.map(
      async (title) => {
        try {
          const params = {
            t: title,
            plot: "full",
          };

          if (year) {
            params.y = year;
          }

          const data = await requestMovieApi(params);

          return formatMovie(data);
        } catch (error) {
          console.error(
            `Could not load "${title}":`,
            error.message
          );

          return null;
        }
      }
    );

    const results = await Promise.all(
      movieRequests
    );

    let movies = results.filter(Boolean);

    setCache(cacheKey, movies);

    movies = filterByGenre(movies, genre);

    movies = sortMovies(movies, sortBy);

    return {
      movies,
      page: 1,
      totalPages: 1,
      totalResults: movies.length,
    };
  }

  // ================================================
  // SEARCH
  // ================================================

  const cacheKey = [
    "search",
    cleanQuery.toLowerCase(),
    currentPage,
    year || "all",
  ].join("-");

  let searchData = getCache(cacheKey);

  if (!searchData) {
    try {
      searchData = await requestMovieApi({
        s: cleanQuery,
        type: "movie",
        page: currentPage,
        ...(year ? { y: year } : {}),
      });

      setCache(cacheKey, searchData);
    } catch (error) {
      // ---------------------------------------------
      // TOO MANY RESULTS
      // ---------------------------------------------

      if (
        error.omdbMessage ===
        "Too many results."
      ) {
        return {
          movies: [],
          page: currentPage,
          totalPages: 0,
          totalResults: 0,
          message:
            "Your search is too broad. Try a more specific movie title.",
        };
      }

      // ---------------------------------------------
      // NO RESULTS
      // ---------------------------------------------

      if (
        error.omdbMessage ===
        "Movie not found!"
      ) {
        return {
          movies: [],
          page: currentPage,
          totalPages: 0,
          totalResults: 0,
          message:
            "No movies were found for this search.",
        };
      }

      throw error;
    }
  }

  const searchResults = Array.isArray(
    searchData.Search
  )
    ? searchData.Search
    : [];

  // ================================================
  // GET DETAILS FOR SEARCH RESULTS
  // ================================================

  const detailedMovies = await Promise.all(
    searchResults.map(async (movie) => {
      // Prevent invalid IMDb requests
      if (!movie?.imdbID) {
        return null;
      }

      try {
        return await getMovieDetails(
          movie.imdbID
        );
      } catch (error) {
        console.warn(
          `Skipping "${movie.Title}" (${movie.imdbID}):`,
          error.message
        );

        return null;
      }
    })
  );

  let movies = detailedMovies.filter(Boolean);

  // ================================================
  // GENRE FILTER
  // ================================================

  movies = filterByGenre(movies, genre);

  // ================================================
  // SORT
  // ================================================

  movies = sortMovies(movies, sortBy);

  // ================================================
  // PAGINATION
  // ================================================

  const totalResults = Number(
    searchData.totalResults || 0
  );

  const totalPages = Math.min(
    Math.ceil(totalResults / 10),
    100
  );

  return {
    movies,
    page: currentPage,
    totalPages,
    totalResults,
  };
};

// --------------------------------------------------
// GET MOVIE DETAILS
// --------------------------------------------------

export const getMovieDetails = async (
  movieId
) => {
  if (!movieId) {
    throw new Error("Movie ID is required.");
  }

  const cacheKey =
    `movie-detail-${movieId}`;

  const cachedMovie =
    getCache(cacheKey);

  if (cachedMovie) {
    return cachedMovie;
  }

  const data = await requestMovieApi({
    i: String(movieId),
    plot: "full",
  });

  const movie = formatMovie(data);

  setCache(cacheKey, movie);

  return movie;
};

// --------------------------------------------------
// GET GENRES
// --------------------------------------------------

export const getGenres = async () => {
  return {
    genres: GENRES,
  };
};