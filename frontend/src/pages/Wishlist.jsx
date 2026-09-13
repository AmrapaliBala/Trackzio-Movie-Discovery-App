import { Heart } from "lucide-react";

import MovieGrid from "../components/MovieGrid";
import EmptyState from "../components/EmptyState";

import {
  useWishlist,
} from "../context/WishlistContext";


const Wishlist = () => {

  const {
    wishlist,
    loading,
    error,
  } = useWishlist();


  return (

    <div className="py-10">

      <div className="mb-10">

        <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-medium text-violet-200">

          <Heart className="h-3.5 w-3.5 fill-current" />

          Saved collection

        </div>


        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          Your wishlist
        </h1>


        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Your wishlist is persisted locally and synchronized with the Node.js backend.
        </p>

      </div>


      {error && (

        <p className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-200">
          {error}
        </p>

      )}


      {loading && !wishlist.length ? (

        <p className="text-sm text-zinc-500">
          Syncing your wishlist…
        </p>

      ) : wishlist.length ? (

        <MovieGrid
          movies={wishlist}
        />

      ) : (

        <EmptyState
          title="Your wishlist is empty"
          description="Save movies from any movie card or details page and they will appear here."
        />

      )}

    </div>
  );
};


export default Wishlist;