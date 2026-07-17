import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import useAuthStore from '../contexts/authStore'
import { fetchBookingById } from '../services/bookingService'
import { getUserIdFromToken } from '../utils/authToken'

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
        year: 'numeric',
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

function buildPnr(bookingId) {
  return `FS${String(bookingId ?? '').padStart(6, '0')}`
}

function BookingReceiptPage() {
  const navigate = useNavigate()
  const { bookingId } = useParams()
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const userId = getUserIdFromToken(token)

  useEffect(() => {
    let shouldUpdate = true

    const loadReceipt = async () => {
      if (!bookingId) {
        setError('Missing booking id.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await fetchBookingById({ token, bookingId })
        if (!shouldUpdate) {
          return
        }

        if (userId && response?.userId != null && String(response.userId) !== String(userId)) {
          setError('This receipt does not belong to the signed-in user.')
          setBooking(null)
          return
        }

        setBooking(response)
      } catch (err) {
        if (shouldUpdate) {
          setError(err.message || 'Could not load booking receipt')
          setBooking(null)
        }
      } finally {
        if (shouldUpdate) {
          setLoading(false)
        }
      }
    }

    loadReceipt()

    return () => {
      shouldUpdate = false
    }
  }, [bookingId, token, userId])

  const flight = booking?.flight || {}
  const pnr = useMemo(() => buildPnr(booking?.id), [booking?.id])
  const fromCode = getRouteCode(flight.departureAirportId, flight.DepartureAirport, 'FROM')
  const toCode = getRouteCode(flight.arrivalAirportId, flight.ArrivalAirport, 'TO')
  const fromName = getAirportName(flight.DepartureAirport, fromCode)
  const toName = getAirportName(flight.ArrivalAirport, toCode)

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="app-shell relative">
      <div className="print:hidden">
        <Navbar />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_32%)] print:hidden" />

      <main className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 px-5 py-8 sm:px-8 lg:px-10">
        <section className="glass-panel rounded-[2.5rem] p-7 sm:p-9 print:hidden">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow">Booking receipt</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Your ticket</h1>
              <p className="mt-3 text-sm text-slate-600">
                Save or print this receipt for boarding and records.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/bookings"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
              >
                All bookings
              </Link>
              <button
                type="button"
                onClick={handlePrint}
                disabled={!booking}
                className="gradient-button px-5 py-3 text-sm font-black disabled:opacity-50"
              >
                Download / Print
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="soft-card h-80 animate-pulse rounded-[2rem] p-8 print:hidden">
            <div className="h-5 w-40 rounded-full bg-slate-200" />
            <div className="mt-6 h-10 w-64 rounded-full bg-slate-200" />
            <div className="mt-10 h-40 rounded-[1.5rem] bg-slate-100" />
          </section>
        ) : null}

        {error ? (
          <section className="soft-card rounded-[2rem] p-8 print:hidden">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <Link to="/bookings" className="mt-5 inline-flex gradient-button px-5 py-3 text-sm font-black">
              Back to bookings
            </Link>
          </section>
        ) : null}

        {!loading && !error && booking ? (
          <section className="booking-receipt soft-card overflow-hidden rounded-[2rem] bg-white p-0 shadow-xl">
            <div className="border-b border-dashed border-slate-200 bg-slate-950 px-7 py-6 text-white sm:px-9">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-200">FlySmart</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight">E-Ticket / Receipt</h2>
                  <p className="mt-2 text-sm text-slate-300">Status: {booking.status || 'booked'}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-4 text-right">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-slate-300">PNR</p>
                  <p className="mt-2 text-3xl font-black tracking-widest text-white">{pnr}</p>
                  <p className="mt-1 text-sm font-semibold text-sky-100">Booking #{booking.id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 px-7 py-7 sm:px-9 sm:py-9">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Passenger</p>
                  <p className="mt-2 text-xl font-black text-slate-950">{user?.email || `User #${booking.userId}`}</p>
                </div>
                <div className="rounded-[1.5rem] bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Flight</p>
                  <p className="mt-2 text-xl font-black text-slate-950">
                    {flight.flightNumber ? `Flight ${flight.flightNumber}` : `Flight #${booking.flightId}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[1.75rem] border border-slate-100 bg-slate-50 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">From</p>
                  <p className="mt-3 text-4xl font-black text-slate-950">{fromCode}</p>
                  <p className="mt-1 text-sm text-slate-500">{fromName}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{formatDateTime(flight.departureTime)}</p>
                </div>
                <div className="flex items-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                  <span className="h-px w-14 bg-gradient-to-r from-sky-500 to-orange-300 sm:w-24" />
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-300" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">To</p>
                  <p className="mt-3 text-4xl font-black text-slate-950">{toCode}</p>
                  <p className="mt-1 text-sm text-slate-500">{toName}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{formatDateTime(flight.arrivalTime)}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-slate-100 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Seats</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">{booking.noOfSeats ?? '-'}</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-100 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Gate</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {flight.boardingGate ?? flight.boardingGage ?? 'TBD'}
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Amount paid</p>
                  <p className="mt-2 text-2xl font-black">{formatCurrency(booking.totalCost)}</p>
                </div>
              </div>

              <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Present this receipt with a valid ID at boarding
              </p>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}

export default BookingReceiptPage
