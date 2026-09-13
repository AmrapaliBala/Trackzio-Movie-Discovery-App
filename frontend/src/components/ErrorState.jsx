import {
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'

const ErrorState = ({ onRetry }) => (

  <div className="glass flex min-h-72 flex-col items-center justify-center rounded-2xl px-6 text-center">

    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10 text-red-300">

      <AlertTriangle className="h-6 w-6" />

    </div>

    <h3 className="mt-5 font-display text-lg font-semibold">
      Something went wrong
    </h3>

    <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
      We could not load the movies. Please try again.
    </p>

    {onRetry && (

      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>

    )}

  </div>
)

export default ErrorState