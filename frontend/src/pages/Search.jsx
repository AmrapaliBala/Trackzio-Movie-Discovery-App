import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import SearchBar from '../components/SearchBar'
import CategoryMenu from '../components/CategoryMenu'
import SortMenu from '../components/SortMenu'
import MovieGrid from '../components/MovieGrid'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Pagination from '../components/Pagination'

import { useMovies } from '../context/MovieContext'

const Search = () => {
  const [params] = useSearchParams()

  const {
    movies,
    genres,
    searchQuery,
    setSearchQuery,
    genre,
    setGenre,
    sortBy,
    setSortBy,
    page,
    totalPages,
    totalResults,
    loading,
    error,
    genresLoading,
    genresError,
    changePage,
    retry,
  } = useMovies()

  // Keep track of the last URL query that was applied.
  const lastUrlQueryRef = useRef(null)

  // Only update the search state when the URL query actually changes.
  useEffect(() => {
    const queryFromUrl = params.get('q') || ''

    if (queryFromUrl === lastUrlQueryRef.current) {
      return
    }

    lastUrlQueryRef.current = queryFromUrl

    if (queryFromUrl !== searchQuery) {
      setSearchQuery(queryFromUrl)
    }
  }, [params, searchQuery, setSearchQuery])

  const handleSearchChange = (value) => {
    setSearchQuery(value)
  }

  const handleGenreChange = (value) => {
    setGenre(value)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
  }

  const handlePageChange = (nextPage) => {
    changePage(nextPage)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <main className="min-h-screen px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <section className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-fuchsia-400">
            Search
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find your next movie
          </h1>

          <p className="mt-4 max-w-2xl text-base text-slate-400">
            Search the movie catalog through your Node.js
            backend, then refine results by category and sorting.
          </p>
        </section>

        {/* Main Search Bar */}
        <section className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </section>

        {/* Categories + Sort */}
        <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="min-w-0 flex-1 overflow-x-auto">
            {genresLoading ? (
              <div className="text-sm text-slate-500">
                Loading categories...
              </div>
            ) : genresError ? (
              <div className="text-sm text-red-400">
                Unable to load categories.
              </div>
            ) : (
              <CategoryMenu
                genres={genres}
                selectedGenre={genre}
                onSelect={handleGenreChange}
              />
            )}
          </div>

          <div className="shrink-0">
            <SortMenu
              value={sortBy}
              onChange={handleSortChange}
            />
          </div>

        </section>

        {/* Result Count */}
        {!loading && !error && (
          <div className="mb-6 text-sm text-slate-500">
            {totalResults}{' '}
            {totalResults === 1 ? 'result' : 'results'}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <ErrorState
            message={error}
            onRetry={retry}
          />
        )}

        {/* Loading */}
        {loading && <LoadingState />}

        {/* Empty */}
        {!loading && !error && movies.length === 0 && (
          <EmptyState
            title="No movies found"
            message={
              searchQuery
                ? `We couldn't find any movies matching "${searchQuery}".`
                : 'Try searching for a movie title or choose a category.'
            }
          />
        )}

        {/* Movies */}
        {!loading && !error && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

      </div>
    </main>
  )
}

export default Search