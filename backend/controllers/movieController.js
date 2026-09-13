import {
  getMovies,
  getMovieDetails,
  getGenres,
} from "../services/movieService.js";

export const listMovies = async (req, res, next) => {
  try {
    const data = await getMovies({
      query: req.query.query || "",
      genre: req.query.genre || "",
      sortBy: req.query.sortBy || "popular",
      page: Number(req.query.page) || 1,
      year: req.query.year || "",
    });

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    // OMDb uses IMDb IDs such as tt0468569.
    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "A valid movie ID is required.",
      });
    }

    const data = await getMovieDetails(movieId);

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const listGenres = async (req, res, next) => {
  try {
    const data = await getGenres();

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};