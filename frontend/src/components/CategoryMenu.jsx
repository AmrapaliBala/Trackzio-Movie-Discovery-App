import {
  useMovies,
} from "../context/MovieContext";


const CategoryMenu = () => {

  const {
    genres,
    genre,
    setGenre,
    genresLoading,
    genresError,
  } = useMovies();


  if (genresLoading) {

    return (
      <div className="h-9 animate-pulse rounded-full bg-white/5" />
    );
  }


  if (genresError) {

    return (
      <p className="text-sm text-zinc-500">
        Categories are unavailable right now.
      </p>
    );
  }


  const items = [
    {
      id: "",
      name: "All",
    },

    ...genres,
  ];


  return (

    <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">

      {items.map((item) => (

        <button
          key={item.id || "all"}
          onClick={() =>
            setGenre(String(item.id))
          }
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${
            genre === String(item.id)
              ? "bg-white text-zinc-950"
              : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white"
          }`}
        >

          {item.name}

        </button>

      ))}

    </div>
  );
};


export default CategoryMenu;