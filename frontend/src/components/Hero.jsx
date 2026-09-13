import {
  ArrowRight,
  Play,
  Sparkles,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import { useMovies } from '../context/MovieContext'

const Hero = () => {

  const { movies } = useMovies()

  const featured = movies[0]

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-glow">

      <img
        src={featured.backdrop}
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#08070d] via-[#08070d]/80 to-[#08070d]/25" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#08070d] via-transparent to-transparent" />

      <div className="grid min-h-[540px] items-end p-6 sm:p-10 lg:grid-cols-[1.15fr_.85fr] lg:p-14">

        <div className="max-w-2xl">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-medium text-violet-200">

            <Sparkles className="h-3.5 w-3.5" />

            Featured tonight

          </div>

          <p className="text-sm font-medium text-violet-300">
            2024 · {featured.genres[0]} · {featured.runtime}
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {featured.title}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
            {featured.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">

            <Link
              to={`/movie/${featured.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-violet-100"
            >
              <Play className="h-4 w-4 fill-current" />
              View details
            </Link>

            <Link
              to="/wishlist"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              My wishlist
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </div>

    </section>
  )
}

export default Hero