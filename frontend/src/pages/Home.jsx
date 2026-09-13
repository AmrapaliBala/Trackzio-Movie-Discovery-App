import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import MovieGrid from "../components/MovieGrid";
import CategoryMenu from "../components/CategoryMenu";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

import { useMovies } from "../context/MovieContext";


const Home = () => {

  const {
    movies,
    loading,
    error,
    retry,
  } = useMovies();


  return (

    <div className="space-y-16 py-6 sm:py-8">

      {/* HERO */}

      {loading && !movies.length ? (

        <LoadingState />

      ) : error && !movies.length ? (

        <ErrorState
          onRetry={retry}
          message={error}
        />

      ) : (

        <Hero />

      )}


      {/* CATEGORY */}

      <section>

        <div className="mb-6 flex items-end justify-between gap-4">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
              Browse
            </p>

            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
              Find your next favorite
            </h2>

          </div>


          <Link
            to="/search"
            className="hidden items-center gap-2 text-sm text-zinc-400 hover:text-white sm:flex"
          >
            Search everything

            <ArrowRight className="h-4 w-4" />

          </Link>

        </div>


        <CategoryMenu />

      </section>


      {/* MOVIES */}

      <section>

        <div className="mb-6">

          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Popular right now
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Movies loaded from TMDB through your Node.js backend.
          </p>

        </div>


        {loading && movies.length ? (

          <LoadingState />

        ) : error ? (

          <ErrorState
            onRetry={retry}
            message={error}
          />

        ) : (

          <MovieGrid
            movies={movies}
          />

        )}

      </section>

    </div>
  );
};


export default Home;