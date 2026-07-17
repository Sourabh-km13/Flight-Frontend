import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import LogoutButton from '../components/LogoutButton'
import Navbar from '../components/Navbar'
import useAuthStore from '../contexts/authStore'
import { fetchUserBookings } from '../services/bookingService'
import { getUserIdFromToken } from '../utils/authToken'

function normalizeBookings(response) {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.rows)) {
    return response.rows
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  return []
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function formatDateTime(value) {
  return value
    ? new Date(value).toLocaleString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'
}

function getRouteCode(value, airport, fallback) {
  return value || airport?.code || fallback
}

function getAirportName(airport, fallback) {
  return typeof airport === 'string' ? airport : airport?.name || airport?.code || fallback
}

function BookingJourneyCard({ booking }) {
  const flight = booking.flight || {}
  const fromCode = getRouteCode(flight.departureAirportId, flight.DepartureAirport, 'From')
  const toCode = getRouteCode(flight.arrivalAirportId, flight.ArrivalAirport, 'To')
  const fromName = getAirportName(flight.DepartureAirport, fromCode)
  const toName = getAirportName(flight.ArrivalAirport, toCode)

  return (
    <article className="soft-card overflow-hidden rounded-[2rem] p-6 transition hover:-translate-y-1 hover:border-sky-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">{booking.status || 'Booking'}</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            {fromCode} to {toCode}
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {fromName} to {toName}
          </p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-950 px-5 py-4 text-right text-white">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Paid</p>
          <p className="mt-2 text-2xl font-black">{formatCurrency(booking.totalCost)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.5rem] bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Departure</p>
          <p className="mt-2 text-lg font-black text-slate-950">{formatDateTime(flight.departureTime)}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Seats</p>
          <p className="mt-2 text-lg font-black text-slate-950">{booking.noOfSeats ?? '-'}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Booking ID</p>
          <p className="mt-2 text-lg font-black text-slate-950">#{booking.id}</p>
        </div>
      </div>

      <div className="mt-5">
        <Link
          to={`/bookings/${booking.id}`}
          className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
        >
          View receipt
        </Link>
      </div>
    </article>
  )
}

function BookingsPage() {
  const token = useAuthStore((state) => state.token)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const stats = useMemo(
    () => [
      { label: 'Booked', value: bookings.length },
      { label: 'Status', value: 'Confirmed' },
      { label: 'Date', value: new Date().toLocaleDateString('en-GB') },
    ],
    [bookings.length],
  )

  useEffect(() => {
    let shouldUpdate = true
    const userId = getUserIdFromToken(token)

    const loadBookings = async () => {
      if (!userId) {
        setError('Could not identify the signed-in user.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await fetchUserBookings({ token, userId, status: 'booked' })

        if (shouldUpdate) {
          setBookings(normalizeBookings(response))
        }
      } catch (err) {
        if (shouldUpdate) {
          setError(err.message || 'Could not fetch bookings')
        }
      } finally {
        if (shouldUpdate) {
          setLoading(false)
        }
      }
    }

    loadBookings()

    return () => {
      shouldUpdate = false
    }
  }, [token])

  return (
    <div className="app-shell relative">
      <Navbar />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_32%)]" />
      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <section className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow">Booked tickets</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Upcoming journeys</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/searchflights"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                Search flights
              </Link>
              <LogoutButton className="px-6 py-3 text-sm" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="soft-card rounded-[1.75rem] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                <p className="mt-3 truncate text-2xl font-black text-slate-950">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-2">
          {loading ? (
            [0, 1].map((item) => (
              <div key={item} className="soft-card h-64 animate-pulse rounded-[2rem] p-6">
                <div className="h-5 w-32 rounded-full bg-slate-200" />
                <div className="mt-6 h-10 w-56 rounded-full bg-slate-200" />
                <div className="mt-10 h-24 rounded-[1.5rem] bg-slate-100" />
              </div>
            ))
          ) : bookings.length === 0 ? (
            <div className="soft-card rounded-[2rem] p-10 text-center xl:col-span-2">
              <h2 className="text-2xl font-black text-slate-950">No booked tickets yet</h2>
              <Link to="/dashboard" className="gradient-button mt-6 inline-flex px-7 py-4 text-sm font-black">
                Book tickets
              </Link>
            </div>
          ) : (
            bookings.map((booking) => <BookingJourneyCard key={booking.id} booking={booking} />)
          )}
        </section>
      </main>
    </div>
  )
}

export default BookingsPage
