import { useEffect, useState } from 'react'
import { wakeApiGateway } from '../services/healthService'

const SESSION_KEY = 'flysmart_gateway_awake'

function hasAwakeSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markAwakeSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    // Ignore storage failures; wake gate will simply re-check next load.
  }
}

function ServerWakeGate({ children }) {
  const [ready, setReady] = useState(() => hasAwakeSession())
  const [loading, setLoading] = useState(() => !hasAwakeSession())
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (hasAwakeSession()) {
      setReady(true)
      setLoading(false)
      return undefined
    }

    let cancelled = false

    const wake = async () => {
      setLoading(true)
      setError('')

      try {
        await wakeApiGateway()
        if (cancelled) {
          return
        }
        markAwakeSession()
        setReady(true)
      } catch (err) {
        if (cancelled) {
          return
        }
        setError(err?.message || 'Servers are taking longer than expected to wake up.')
        setReady(false)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    wake()

    return () => {
      cancelled = true
    }
  }, [attempt])

  if (ready) {
    return children
  }

  return (
    <div className="app-shell relative flex min-h-screen items-center justify-center px-5 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.22),_transparent_48%)]" />
      <section className="glass-panel relative w-full max-w-lg overflow-hidden rounded-[2.5rem] p-8 sm:p-10">
        <div className="absolute -right-10 -top-10 h-36 w-36 animate-pulse rounded-full bg-orange-300/30 blur-2xl" />
        <div className="absolute -bottom-12 -left-8 h-40 w-40 animate-pulse rounded-full bg-emerald-300/25 blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-xl shadow-orange-900/20">
              FS
            </span>
            <div>
              <p className="text-lg font-black tracking-tight text-slate-950">FlySmart</p>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Travel desk</p>
            </div>
          </div>

          <p className="eyebrow mt-8">Cold start</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {error ? 'Could not reach servers' : 'Waking servers…'}
          </h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
            {error
              ? 'The API gateway is still starting or unreachable. Retry in a moment.'
              : 'Free-tier hosts sleep when idle. We are warming the gateway so booking can continue.'}
          </p>

          {loading ? (
            <div className="mt-8 space-y-4">
              <div className="h-2 overflow-hidden rounded-full bg-orange-100">
                <div className="wake-progress h-full w-1/3 rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-700">Please wait</p>
            </div>
          ) : null}

          {error ? (
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
              <button
                type="button"
                onClick={() => {
                  setReady(false)
                  setAttempt((value) => value + 1)
                }}
                className="gradient-button px-6 py-3 text-sm font-black"
              >
                Retry wake up
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}

export default ServerWakeGate
