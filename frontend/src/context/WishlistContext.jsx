import {
  createContext,
  useContext,
  useEffect,
} from "react";

import {
  useWishlistStore,
} from "../store/wishlistStore";


const WishlistContext =
  createContext(null);


export const WishlistContextProvider = ({
  children,
}) => {

  const wishlist =
    useWishlistStore(
      (state) => state.wishlist
    );

  const loading =
    useWishlistStore(
      (state) => state.loading
    );

  const error =
    useWishlistStore(
      (state) => state.error
    );

  const addToWishlist =
    useWishlistStore(
      (state) => state.addToWishlist
    );

  const removeFromWishlist =
    useWishlistStore(
      (state) => state.removeFromWishlist
    );

  const isInWishlist =
    useWishlistStore(
      (state) => state.isInWishlist
    );

  const hydrateWishlist =
    useWishlistStore(
      (state) => state.hydrateWishlist
    );


  useEffect(() => {

    hydrateWishlist();

  }, [hydrateWishlist]);


  return (
    <WishlistContext.Provider
      value={{
        wishlist,

        loading,

        error,

        addToWishlist,

        removeFromWishlist,

        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};


export const useWishlist = () => {

  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistContextProvider"
    );
  }

  return context;
};