import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  addWishlistMovie,
  getWishlist,
  removeWishlistMovie,
} from "../services/api";


export const useWishlistStore = create(
  persist(
    (set, get) => ({

      wishlist: [],

      loading: false,

      error: "",


      // -----------------------------------------
      // LOAD WISHLIST FROM BACKEND
      // -----------------------------------------

      hydrateWishlist: async () => {

        set({
          loading: true,
          error: "",
        });

        try {

          const data = await getWishlist();

          const serverMovies =
            (data.wishlist || []).map((item) => ({
              id: item.movieId,

              title: item.title,

              poster: item.poster || "",

              year: item.year || "",

              rating: Number(item.rating || 0),

              genres: [],
            }));


          // Keep locally persisted items too.
          const currentMovies = get().wishlist;

          const merged = [
            ...serverMovies,
          ];


          currentMovies.forEach((movie) => {

            const alreadyExists =
              merged.some(
                (item) => item.id === movie.id
              );

            if (!alreadyExists) {
              merged.push(movie);
            }
          });


          set({
            wishlist: merged,
            loading: false,
          });

        } catch (error) {

          set({
            loading: false,

            error:
              error.message ||
              "Unable to sync wishlist.",
          });
        }
      },


      // -----------------------------------------
      // ADD
      // -----------------------------------------

      addToWishlist: async (movie) => {

        const current = get().wishlist;

        const alreadyExists =
          current.some(
            (item) => item.id === movie.id
          );

        if (alreadyExists) {
          return true;
        }


        set({
          loading: true,
          error: "",
        });


        try {

          await addWishlistMovie(movie);


          set((state) => ({

            wishlist:
              state.wishlist.some(
                (item) => item.id === movie.id
              )
                ? state.wishlist
                : [
                    ...state.wishlist,
                    movie,
                  ],

            loading: false,
          }));


          return true;

        } catch (error) {

          set({
            loading: false,

            error:
              error.message ||
              "Unable to add movie to wishlist.",
          });

          return false;
        }
      },


      // -----------------------------------------
      // REMOVE
      // -----------------------------------------

      removeFromWishlist: async (movieId) => {

        set({
          loading: true,
          error: "",
        });


        try {

          await removeWishlistMovie(
            movieId
          );


          set((state) => ({

            wishlist:
              state.wishlist.filter(
                (movie) =>
                  movie.id !== movieId
              ),

            loading: false,
          }));


          return true;

        } catch (error) {

          set({
            loading: false,

            error:
              error.message ||
              "Unable to remove movie from wishlist.",
          });

          return false;
        }
      },


      // -----------------------------------------
      // CHECK WISHLIST
      // -----------------------------------------

      isInWishlist: (movieId) => {

        return get().wishlist.some(
          (movie) =>
            movie.id === movieId
        );
      },


      clearError: () => {
        set({
          error: "",
        });
      },

    }),

    {
      name: "trackzio-wishlist",

      partialize: (state) => ({
        wishlist: state.wishlist,
      }),
    }
  )
);