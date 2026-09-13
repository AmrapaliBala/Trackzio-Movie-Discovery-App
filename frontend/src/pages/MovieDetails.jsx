import { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, Clock3, Heart, Star } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getMovieDetails, getMovies } from '../services/api'
import { useWishlist } from '../context/WishlistContext'
import MovieGrid from '../components/MovieGrid'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

const MovieDetails = () => {
  const { movieId } = useParams()

  const [movie, setMovie] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlist()

  useEffect(() => {
    const controller = new AbortController()

    const loadMovie = async () => {
      setLoading(true)
      setError('')
      setMovie(null)

      try {
        const data = await getMovieDetails(movieId, controller.signal)

        // Backend returns the movie fields directly.
        // Example:
        // { success: true, id: "tt0372784", title: "Batman Begins", ... }
        const movieData = data

        setMovie(movieData)

        const firstGenreId = movieData?.genreIds?.[0]

        if (firstGenreId) {
          const relatedData = await getMovies(
            {
              genre: firstGenreId,
              sortBy: 'popular',
              page: 1,
            },
            controller.signal,
          )

          setRelated(
            (relatedData.movies || [])
              .filter(
                (item) => String(item.id) !== String(movieId),
              )
              .slice(0, 4),
          )
        } else {
          setRelated([])
        }
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(
            requestError.message ||
              'Unable to load movie details.',
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadMovie()

    return () => controller.abort()
  }, [movieId])

  if (loading) {
    return (
      <div className="py-10">
        <LoadingState />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-10">
        <ErrorState
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="py-20">
        <EmptyState
          title="Movie not found"
          description="The movie could not be found in the movie catalog."
        />
      </div>
    )
  }

  const saved = isInWishlist(movie.id)

  const directors = movie.directors?.length
    ? movie.directors.join(', ')
    : 'Not available'

  const toggleWishlist = async () => {
    if (wishlistLoading) return

    if (saved) {
      await removeFromWishlist(movie.id)
    } else {
      await addToWishlist(movie)
    }
  }

  return (
    <div className="py-6 sm:py-10">
      <Link
        to="/search"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to browse
      </Link>

      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950">
        {movie.backdrop && (
          <img
            src={movie.backdrop}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#08070d] via-[#08070d]/95 to-[#08070d]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070d] via-transparent to-transparent" />

        <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[260px_1fr] lg:p-14">
          <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl lg:mx-0">
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
                className="aspect-[2/3] w-full object-cover"
              />
            ) : (
              <div className="grid aspect-[2/3] place-items-center bg-white/5 text-sm text-zinc-600">
                No poster
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs text-violet-200"
                >
                  {item}
                </span>
              ))}
            </div>

            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold sm:text-6xl">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="mt-3 text-sm italic text-violet-200">
                {movie.tagline}
              </p>
            )}

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
              {movie.overview}
            </p>

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-zinc-400">
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {Number(movie.rating || 0).toFixed(1)}/10
              </span>

              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {movie.year || 'N/A'}
              </span>

              {movie.runtime && (
                <span className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {movie.runtime}
                </span>
              )}

              <span>{movie.language || 'N/A'}</span>
            </div>

            <p className="mt-4 text-sm text-zinc-500">
              Directed by{' '}
              <span className="text-zinc-300">
                {directors}
              </span>
            </p>

            <div className="mt-7">
              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-70 ${
                  saved
                    ? 'bg-violet-500 text-white hover:bg-violet-400'
                    : 'bg-white text-zinc-950 hover:bg-violet-100'
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    saved ? 'fill-current' : ''
                  }`}
                />

                {saved
                  ? 'Saved to wishlist'
                  : 'Add to wishlist'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold">
            You may also like
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            More popular movies from a similar genre.
          </p>

          <div className="mt-6">
            <MovieGrid movies={related} />
          </div>
        </section>
      )}
    </div>
  )
}

export default MovieDetails