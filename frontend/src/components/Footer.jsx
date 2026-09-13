import { Film } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {

  const columns = [
    {
      title: 'Explore',

      items: [
        {
          label: 'Discover',
          to: '/',
        },
        {
          label: 'Search',
          to: '/search',
        },
        {
          label: 'Wishlist',
          to: '/wishlist',
        },
      ],
    },

    {
      title: 'Categories',

      items: [
        'Action',
        'Drama',
        'Sci-Fi',
        'Comedy',
      ],
    },
  ]

  return (
    <footer className="mx-auto mt-24 max-w-7xl border-t border-white/5 px-4 py-10 sm:px-6 lg:px-8">

      <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">

        <div>

          <div className="flex items-center gap-2.5">

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">

              <Film className="h-4 w-4" />

            </span>

            <span className="font-display text-lg font-bold">
              Trackzio
            </span>

          </div>

          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500">
            Discover movies, save the ones you love,
            and keep exploring your next favorite story.
          </p>

        </div>

        {columns.map((column) => (

          <div key={column.title}>

            <p className="text-sm font-semibold text-white">
              {column.title}
            </p>

            <ul className="mt-4 space-y-3">

              {column.items.map((item) =>

                typeof item === 'string' ? (

                  <li
                    key={item}
                    className="text-sm text-zinc-500"
                  >
                    {item}
                  </li>

                ) : (

                  <li key={item.label}>

                    <Link
                      to={item.to}
                      className="text-sm text-zinc-500 transition hover:text-white"
                    >
                      {item.label}
                    </Link>

                  </li>

                )
              )}

            </ul>

          </div>

        ))}

      </div>

      <div className="mt-10 border-t border-white/5 pt-5 text-center text-xs text-zinc-600">
        © 2026 Trackzio. Built for movie discovery.
      </div>

    </footer>
  )
}

export default Footer