import {
  Heart,
  Star,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useWishlist,
} from "../context/WishlistContext";


const MovieCard = ({ movie }) => {

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading,
  } = useWishlist();


  const saved =
    isInWishlist(movie.id);


  const toggleWishlist = async (event) => {

    event.preventDefault();
    event.stopPropagation();


    if (loading) {
      return;
    }


    if (saved) {

      await removeFromWishlist(
        movie.id
      );

    } else {

      await addToWishlist(movie);

    }
  };


  return (

    <Link
      to={`/movie/${movie.id}`}
      className="group block min-w-0 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-violet-300/20 hover:bg-white/[0.06]"
    >

      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">

        {movie.poster ? (

          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

        ) : (

          <div className="grid h-full place-items-center text-sm text-zinc-600">
            No poster
          </div>

        )}


        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />


        <button
          type="button"
          onClick={toggleWishlist}
          disabled={loading}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition ${
            saved
              ? "border-violet-300/30 bg-violet-500/80 text-white"
              : "border-white/10 bg-black/40 text-white hover:bg-black/70"
          } disabled:cursor-wait disabled:opacity-70`}
          aria-label={
            saved
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >

          <Heart
            className={`h-4 w-4 ${
              saved
                ? "fill-current"
                : ""
            }`}
          />

        </button>


        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-semibold backdrop-blur-md">

          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />

          {Number(
            movie.rating || 0
          ).toFixed(1)}

        </span>

      </div>


      <div className="p-4">

        <h3
          className="truncate font-semibold text-white"
          title={movie.title}
        >
          {movie.title}
        </h3>


        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-zinc-500">

          <span>
            {movie.year || "N/A"}
          </span>


          <span className="truncate">

            {movie.genres?.slice(0, 2).join(" · ") ||
              "Movie"}

          </span>

        </div>

      </div>

    </Link>
  );
};


export default MovieCard;