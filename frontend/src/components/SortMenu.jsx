import {
  ArrowDownUp,
} from "lucide-react";

import {
  useMovies,
} from "../context/MovieContext";


const SortMenu = () => {

  const {
    sortBy,
    setSortBy,
  } = useMovies();


  return (

    <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-400">

      <ArrowDownUp className="h-4 w-4" />

      <span>
        Sort
      </span>


      <select
        value={sortBy}
        onChange={(event) =>
          setSortBy(event.target.value)
        }
        className="bg-transparent font-medium text-white outline-none"
      >

        <option
          value="popular"
          className="bg-zinc-900"
        >
          Popular
        </option>


        <option
          value="rating"
          className="bg-zinc-900"
        >
          Top rated
        </option>


        <option
          value="newest"
          className="bg-zinc-900"
        >
          Newest
        </option>


        <option
          value="oldest"
          className="bg-zinc-900"
        >
          Oldest
        </option>

      </select>

    </label>
  );
};


export default SortMenu;