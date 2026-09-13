import {
  createContext,
  useCallback,
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

  const requestIdRef = useRef(0)
  const controllerRef = useRef(null)

  // --------------------------------------------------
  // LOAD GENRES
  // --------------------------------------------------

  useEffect(() => {
    const controller = new AbortController()

    const loadGenres = async () => {
      setGenresLoading(true)
      setGenresError('')

      try {
        const data = await getGenres(controller.signal)

        setGenres(data.genres || [])
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setGenresError(
            requestError.message || 'Unable to load categories.'
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

  // --------------------------------------------------
  // FETCH MOVIES
  // --------------------------------------------------

  const fetchMovieResults = useCallback(
    async ({
      nextPage,
      nextQuery,
      nextGenre,
      nextSortBy,
    }) => {
      const requestId = ++requestIdRef.current

      // Cancel previous request
      controllerRef.current?.abort()

      const controller = new AbortController()

      controllerRef.current = controller

      setLoading(true)
      setError('')

      try {
        const data = await getMovies(
          {
            query: nextQuery,
            genre: nextGenre,
            sortBy: nextSortBy,
            page: nextPage,
          },
          controller.signal
        )

        // Ignore an older request if a newer request
        // has already started.
        if (requestId !== requestIdRef.current) {
          return
        }

        setMovies(data.movies || [])

        setTotalPages(data.totalPages || 0)

        setTotalResults(data.totalResults || 0)

        setPage(data.page || nextPage)
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return
        }

        if (requestId !== requestIdRef.current) {
          return
        }

        setError(
          requestError.message || 'Unable to load movies.'
        )

        setMovies([])
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false)
        }
      }
    },
    []
  )

  // --------------------------------------------------
  // FETCH WHEN FILTERS / SEARCH / SORT / PAGE CHANGE
  // --------------------------------------------------

  useEffect(() => {
    const delay = searchQuery.trim() ? 400 : 0

    const timer = window.setTimeout(() => {
      fetchMovieResults({
        nextPage: page,
        nextQuery: searchQuery,
        nextGenre: genre,
        nextSortBy: sortBy,
      })
    }, delay)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    searchQuery,
    genre,
    sortBy,
    page,
    fetchMovieResults,
  ])

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const setSearchQuery = (value) => {
    setSearchQueryState(value)

    // Start from first page for a new search
    setPage(1)
  }

  // --------------------------------------------------
  // GENRE
  // --------------------------------------------------

  const setGenre = (value) => {
    setGenreState(value)

    // Start from first page when genre changes
    setPage(1)
  }

  // --------------------------------------------------
  // SORT
  // --------------------------------------------------

  const setSortBy = (value) => {
    setSortByState(value)

    // Start from first page when sorting changes
    setPage(1)
  }

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const changePage = (nextPage) => {
    setPage(Math.max(1, nextPage))

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // --------------------------------------------------
  // RETRY
  // --------------------------------------------------

  const retry = () => {
    fetchMovieResults({
      nextPage: page,
      nextQuery: searchQuery,
      nextGenre: genre,
      nextSortBy: sortBy,
    })
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