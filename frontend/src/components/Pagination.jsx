const getPageItems = (
  page,
  totalPages
) => {

  const items = [];

  const add = (value) =>
    items.push(value);


  if (totalPages <= 7) {

    for (
      let i = 1;
      i <= totalPages;
      i += 1
    ) {

      add(i);

    }

    return items;
  }


  add(1);


  if (page > 4) {

    add("left-ellipsis");

  }


  const start =
    Math.max(2, page - 1);

  const end =
    Math.min(
      totalPages - 1,
      page + 1
    );


  for (
    let i = start;
    i <= end;
    i += 1
  ) {

    add(i);

  }


  if (page < totalPages - 3) {

    add("right-ellipsis");

  }


  add(totalPages);


  return items;
};


const Pagination = ({
  page,
  totalPages,
  onChange,
}) => {

  if (totalPages <= 1) {
    return null;
  }


  return (

    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">

      <button
        disabled={page === 1}
        onClick={() =>
          onChange(page - 1)
        }
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Previous
      </button>


      {getPageItems(
        page,
        totalPages
      ).map((item) =>

        typeof item === "string" ? (

          <span
            key={item}
            className="px-1 text-zinc-600"
          >
            …
          </span>

        ) : (

          <button
            key={item}
            onClick={() =>
              onChange(item)
            }
            className={`grid h-9 w-9 place-items-center rounded-lg text-sm ${
              page === item
                ? "bg-white text-zinc-950"
                : "border border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            {item}
          </button>

        )
      )}


      <button
        disabled={
          page === totalPages
        }
        onClick={() =>
          onChange(page + 1)
        }
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Next
      </button>

    </div>
  );
};


export default Pagination;