import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null
  }

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return
    }

    onPageChange(nextPage)
  }

  const getPages = () => {
    const pages = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }

      return pages
    }

    pages.push(1)

    if (page > 3) {
      pages.push('...')
    }

    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (page < totalPages - 2) {
      pages.push('...')
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
        className="flex h-10 items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">
          Previous
        </span>
      </button>

      <div className="flex items-center gap-1">
        {getPages().map((item, index) =>
          item === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-10 w-8 items-center justify-center text-sm text-slate-500"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => goToPage(item)}
              className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition ${
                page === item
                  ? 'border-white bg-white text-black'
                  : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPages}
        className="flex h-10 items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <span className="hidden sm:inline">
          Next
        </span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Pagination