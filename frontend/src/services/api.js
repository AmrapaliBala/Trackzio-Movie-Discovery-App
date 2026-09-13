const API_BASE_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
).replace(/\/$/, "");

// Creates an anonymous ID for this browser.
// It allows the backend to know which wishlist belongs to this browser.
const getClientId = () => {
  const key = "trackzio-client-id";

  let clientId = localStorage.getItem(key);

  if (!clientId) {
    clientId =
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(key, clientId);
  }

  return clientId;
};


// Common function used by all API requests.
const request = async (path, options = {}) => {
  const { headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,

    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
};


// --------------------------------------------------
// MOVIES
// --------------------------------------------------

export const getMovies = (
  {
    query = "",
    genre = "",
    sortBy = "popular",
    page = 1,
    year = "",
  } = {},
  signal
) => {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set("query", query.trim());
  }

  if (genre) {
    params.set("genre", genre);
  }

  if (sortBy) {
    params.set("sortBy", sortBy);
  }

  params.set("page", String(page));

  if (year) {
    params.set("year", String(year));
  }

  return request(`/api/movies?${params.toString()}`, {
    signal,
  });
};


// --------------------------------------------------
// MOVIE DETAILS
// --------------------------------------------------

export const getMovieDetails = (movieId, signal) => {
  return request(`/api/movies/${movieId}`, {
    signal,
  });
};


// --------------------------------------------------
// GENRES / CATEGORIES
// --------------------------------------------------

export const getGenres = (signal) => {
  return request("/api/movies/categories", {
    signal,
  });
};


// --------------------------------------------------
// WISHLIST
// --------------------------------------------------

export const getWishlist = () => {
  return request("/api/wishlist", {
    headers: {
      "x-client-id": getClientId(),
    },
  });
};


export const addWishlistMovie = (movie) => {
  return request("/api/wishlist", {
    method: "POST",

    headers: {
      "x-client-id": getClientId(),
    },

    body: JSON.stringify({
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster || "",
      year: movie.year || "",
      rating: movie.rating || 0,
    }),
  });
};


export const removeWishlistMovie = (movieId) => {
  return request(`/api/wishlist/${movieId}`, {
    method: "DELETE",

    headers: {
      "x-client-id": getClientId(),
    },
  });
};


export {
  API_BASE_URL,
  getClientId,
};