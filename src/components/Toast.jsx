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
      <div className="animate-bounce pointer-events-auto soft-card flex max-w-lg items-start gap-4 rounded-[1.5rem] bg-white px-5 py-4 shadow-xl shadow-rose-900/10">
        <div className="relative z-10 min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-700">Ticket email</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="relative z-10 rounded-full border border-rose-200 px-3 py-1 text-xs font-bold text-rose-600 transition hover:border-rose-300 hover:text-rose-800"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default Toast
