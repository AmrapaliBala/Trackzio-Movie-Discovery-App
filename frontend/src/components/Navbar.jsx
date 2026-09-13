import {
  Film,
  Heart,
  Menu,
  Search,
  X,
} from 'lucide-react'
import { useState } from 'react'
import {
  NavLink,
  useNavigate,
} from 'react-router-dom'

import { useWishlistStore } from '../store/wishlistStore'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const navigate = useNavigate()

  const wishlistCount = useWishlistStore(
    (state) => state.wishlist.length
  )

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const submitSearch = (event) => {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      return
    }

    navigate(
      `/search?q=${encodeURIComponent(trimmedQuery)}`
    )

    setOpen(false)
  }

  // --------------------------------------------------
  // CLOSE MOBILE MENU
  // --------------------------------------------------

  const closeMenu = () => {
    setOpen(false)
  }

  // --------------------------------------------------
  // NAV LINK CLASS
  // --------------------------------------------------

  const navLinkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? 'text-white'
        : 'text-slate-400 hover:text-white'
    }`

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#08070c]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ==================================================
            MAIN NAVBAR
        ================================================== */}

        <div className="flex h-16 items-center justify-between gap-3">

          {/* ------------------------------------------------
              LOGO
          ------------------------------------------------ */}

          <NavLink
            to="/"
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-lg shadow-fuchsia-500/20">
              <Film className="h-5 w-5 text-white" />
            </div>

            <span className="text-lg font-bold tracking-tight text-white">
              Trackzio
            </span>
          </NavLink>

          {/* ------------------------------------------------
              DESKTOP NAVIGATION
          ------------------------------------------------ */}

          <nav className="hidden items-center gap-8 md:flex">
            <NavLink
              to="/"
              className={navLinkClass}
            >
              Discover
            </NavLink>

            <NavLink
              to="/search"
              className={navLinkClass}
            >
              Search
            </NavLink>

            <NavLink
              to="/wishlist"
              className={navLinkClass}
            >
              Wishlist
            </NavLink>
          </nav>

          {/* ------------------------------------------------
              DESKTOP SEARCH
          ------------------------------------------------ */}

          <form
            onSubmit={submitSearch}
            className="hidden min-w-0 flex-1 justify-center md:flex"
          >
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search movies..."
                className="h-10 w-full rounded-full border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-500/50 focus:bg-white/[0.05]"
              />
            </div>
          </form>

          {/* ------------------------------------------------
              DESKTOP WISHLIST
          ------------------------------------------------ */}

          <NavLink
            to="/wishlist"
            className="relative hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/5 hover:text-white md:flex"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />

            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </NavLink>

          {/* ------------------------------------------------
              MOBILE RIGHT SIDE
          ------------------------------------------------ */}

          <div className="flex items-center gap-2 md:hidden">

            {/* Mobile wishlist */}

            <NavLink
              to="/wishlist"
              onClick={closeMenu}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/5 hover:text-white"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />

              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            {/* Mobile menu button */}

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
              aria-label={
                open
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={open}
            >
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* ==================================================
            MOBILE MENU
        ================================================== */}

        {open && (
          <div className="border-t border-white/10 py-4 md:hidden">

            {/* Mobile search */}

            <form
              onSubmit={submitSearch}
              className="mb-4"
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type="text"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search movies..."
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-500/50 focus:bg-white/[0.05]"
                />
              </div>
            </form>

            {/* Mobile navigation links */}

            <nav className="flex flex-col gap-1">

              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                  }`
                }
              >
                Discover
              </NavLink>

              <NavLink
                to="/search"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                  }`
                }
              >
                Search
              </NavLink>

              <NavLink
                to="/wishlist"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                  }`
                }
              >
                <span>Wishlist</span>

                {wishlistCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-500 px-1.5 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>

            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar