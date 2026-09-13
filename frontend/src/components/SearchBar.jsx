import { Search } from 'lucide-react'

import { useMovies } from '../context/MovieContext'

const SearchBar = () => {

  const {
    searchQuery,
    setSearchQuery,
  } = useMovies()

  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">

      <Search className="h-5 w-5 text-zinc-500" />

      <input
        value={searchQuery}
        onChange={(event) =>
          setSearchQuery(event.target.value)
        }
        placeholder="Search by title or genre..."
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
      />

    </div>
  )
}

export default SearchBar