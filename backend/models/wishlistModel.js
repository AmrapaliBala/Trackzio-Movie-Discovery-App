import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
      index: true,
    },

    movieId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    poster: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index(
  { clientId: 1, movieId: 1 },
  { unique: true }
);

const wishlistModel =
  mongoose.models.Wishlist ||
  mongoose.model("Wishlist", wishlistSchema);

export default wishlistModel;