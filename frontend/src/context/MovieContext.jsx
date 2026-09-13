import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { getGenres, getMovies } from '../services/api'

const MovieContext = createContext(null)

export const MovieContextProvider = ({ children }) => {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])

  const [searchQuery, setSearchQueryState] = useState('')
  const [genre, setGenreState] = useState('')
  const [sortBy, setSortByState] = useState('popular')

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  const [loading, setLoading] = useState(true)
  const [genresLoading, setGenresLoading] = useState(true)

  const [error, setError] = useState('')
  const [genresError, setGenresError] = useState('')

  const [retryCount, setRetryCount] = useState(0)

  const requestIdRef = useRef(0)
  const controllerRef = useRef(null)

  // Load movie categories once
  useEffect(() => {
    const controller = new AbortController()

    const loadGenres = async () => {
      try {
        setGenresLoading(true)
        setGenresError('')

        const data = await getGenres(controller.signal)

        if (!controller.signal.aborted) {
          setGenres(data.genres || [])
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setGenresError(
            error.message || 'Unable to load categories.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setGenresLoading(false)
        }
      }
    }

    loadGenres()

    return () => {
      controller.abort()
    }
  }, [])

  // Fetch movies whenever search, filter, sorting, page or retry changes
  useEffect(() => {
    const controller = new AbortController()

    // Cancel the previous request
    controllerRef.current?.abort()
    controllerRef.current = controller

    const requestId = ++requestIdRef.current

    const delay = searchQuery.trim() ? 500 : 0

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getMovies(
          {
            query: searchQuery,
            genre,
            sortBy,
            page,
          },
          controller.signal
        )

        // Ignore stale or cancelled requests
        if (
          controller.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return
        }

        setMovies(data.movies || [])
        setTotalPages(data.totalPages || 0)
        setTotalResults(data.totalResults || 0)
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        if (requestId !== requestIdRef.current) {
          return
        }

        setError(
          error.message || 'Unable to load movies.'
        )

        setMovies([])
      } finally {
        if (
          !controller.signal.aborted &&
          requestId === requestIdRef.current
        ) {
          setLoading(false)
        }
      }
    }, delay)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [
    searchQuery,
    genre,
    sortBy,
    page,
    retryCount,
  ])

  // Search
  const setSearchQuery = (value) => {
    setSearchQueryState(value)
    setPage(1)
  }

  // Genre filter
  const setGenre = (value) => {
    setGenreState(value)
    setPage(1)
  }

  // Sorting
  const setSortBy = (value) => {
    setSortByState(value)
    setPage(1)
  }

  // Pagination
  const changePage = (nextPage) => {
    setPage(Math.max(1, nextPage))

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Retry current request
  const retry = () => {
    setError('')
    setRetryCount((count) => count + 1)
  }

  return (
    <MovieContext.Provider
      value={{
        movies,
        genres,

        genresLoading,
        genresError,

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

        changePage,
        retry,
      }}
    >
      {children}
    </MovieContext.Provider>
  )
}

export const useMovies = () => {
  const context = useContext(MovieContext)

  if (!context) {
    throw new Error(
      'useMovies must be used inside MovieContextProvider'
    )
  }

  return context
}