const LoadingState = () => (

  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

    {Array.from(
      { length: 8 },
      (_, index) => (

        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]"
        >

          <div className="aspect-[2/3] bg-white/5" />

          <div className="space-y-2 p-4">

            <div className="h-4 w-4/5 rounded bg-white/5" />

            <div className="h-3 w-2/5 rounded bg-white/5" />

          </div>

        </div>

      )
    )}

  </div>
)

export default LoadingState