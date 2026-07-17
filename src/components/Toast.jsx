import { useEffect } from 'react'

function Toast({ message, onClose, durationMs = 4000 }) {
  useEffect(() => {
    if (!message) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      onClose?.()
    }, durationMs)

    return () => window.clearTimeout(timeoutId)
  }, [durationMs, message, onClose])

  if (!message) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <div className="pointer-events-auto soft-card flex max-w-lg items-start gap-4 rounded-[1.5rem] border border-sky-100 bg-white px-5 py-4 shadow-xl shadow-sky-900/10">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">Ticket email</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500 transition hover:text-slate-950"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default Toast
