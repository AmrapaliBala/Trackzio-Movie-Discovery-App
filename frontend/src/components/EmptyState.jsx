import { Film } from 'lucide-react'

const EmptyState = ({
  title = 'Nothing here yet',
  description = 'There is no content to show right now.',
}) => (

  <div className="glass flex min-h-72 flex-col items-center justify-center rounded-2xl px-6 text-center">

    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/10 text-violet-300">

      <Film className="h-6 w-6" />

    </div>

    <h3 className="mt-5 font-display text-lg font-semibold">
      {title}
    </h3>

    <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
      {description}
    </p>

  </div>
)

export default EmptyState