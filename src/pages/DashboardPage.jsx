import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import useAuthStore from '../contexts/authStore'
import { fetchFlights } from '../services/authService'
import FlightCard from '../components/FlightCard'

function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const stats = useMemo(
    () => [
      { label: 'Saved trips', value: flights.length },
      { label: 'Last login', value: new Date().toLocaleDateString('en-GB') },
      { label: 'Current user', value: user?.name || user?.email || 'Guest' },
    ],
    [flights.length, user],
  )

  const handleFetchFlights = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetchFlights(token)
      setFlights(Array.isArray(response) ? response : response.flights || [])
    } catch (err) {
      setError(err.message || 'Could not fetch flights')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuth()
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <Navbar />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_28%)]" />
        <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/50">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">Dashboard</p>
                <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                  Welcome back, {user?.name || 'traveler'}
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-400">
                  Your travel workspace now has better clarity, polished cards, and quick access to your latest flight data.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex rounded-[1.75rem] border border-slate-700 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-slate-100"
              >
                Logout
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{stat.label}</p>
                  <p className="mt-4 text-xl font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/50">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Flight explorer</h2>
                <p className="mt-2 text-sm text-slate-400">Fetch available routes and preview flight details with your current session.</p>
              </div>
              <button
                onClick={handleFetchFlights}
                disabled={loading}
                className="inline-flex rounded-[1.75rem] bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Loading...' : 'Fetch flights'}
              </button>
            </div>

            {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              {flights.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-950/80 p-10 text-center text-sm text-slate-500">
                  No flights yet. Click the button above to load the latest data.
                </div>
              ) : (
                flights.map((flight, index) => (
                  <FlightCard key={flight.id || `${flight.flightNumber || 'flight'}-${index}`} flight={flight} />
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
