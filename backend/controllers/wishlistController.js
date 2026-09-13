import wishlistModel from "../models/wishlistModel.js";

const getClientId = (req) => req.header("x-client-id");

const validateClientId = (req, res) => {
  const clientId = getClientId(req);

  if (!clientId) {
    res.status(400).json({
      success: false,
      message: "x-client-id header is required.",
    });

    return null;
  }

  return clientId;
};

// ---------------------------------------
// GET /api/wishlist
// ---------------------------------------

export const listWishlist = async (req, res, next) => {
  try {
    const clientId = validateClientId(req, res);

    if (!clientId) return;

    const wishlist = await wishlistModel
      .find({ clientId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------
// POST /api/wishlist
// ---------------------------------------

export const addToWishlist = async (req, res, next) => {
  try {
    const clientId = validateClientId(req, res);

    if (!clientId) return;

    const {
      movieId,
      title,
      poster,
      year,
      rating,
    } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({
        success: false,
        message: "movieId and title are required.",
      });
    }

    const movie = await wishlistModel.findOneAndUpdate(
      {
        clientId,
        movieId: String(movieId),
      },
      {
        clientId,
        movieId: String(movieId),
        title,
        poster: poster || "",
        year: year || "",
        rating: Number(rating || 0),
      },
      {
        // Mongoose recommends this instead of new: true
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      success: true,
      message: "Movie added to wishlist.",
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------
// DELETE /api/wishlist/:movieId
// ---------------------------------------

export const removeFromWishlist = async (req, res, next) => {
  try {
    const clientId = validateClientId(req, res);

    if (!clientId) return;

    await wishlistModel.deleteOne({
      clientId,
      movieId: String(req.params.movieId),
    });

    res.json({
      success: true,
      message: "Movie removed from wishlist.",
    });
  } catch (error) {
    next(error);
  }
};