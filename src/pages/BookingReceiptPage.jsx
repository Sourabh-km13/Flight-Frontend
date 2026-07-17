import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { AirplaneIcon, AirportIcon, GateIcon, MoneyIcon, SeatIcon } from '../components/TravelIcons'
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

function getCityName(airport) {
  if (!airport || typeof airport === 'string') {
    return ''
  }

  return airport.city?.name || airport.City?.name || airport.cityName || ''
}

function formatPlace(airport, code, fallbackName) {
  const city = getCityName(airport)
  const airportName = getAirportName(airport, fallbackName)

  if (city && airportName && city !== airportName) {
    return `${city} · ${airportName} (${code})`
  }

  if (airportName) {
    return `${airportName} (${code})`
  }

  return code
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
  const fromPlace = formatPlace(flight.DepartureAirport, fromCode, fromCode)
  const toPlace = formatPlace(flight.ArrivalAirport, toCode, toCode)
  const fromCity = getCityName(flight.DepartureAirport)
  const toCity = getCityName(flight.ArrivalAirport)

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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.2),_transparent_42%)] print:hidden" />

      <main className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 px-5 py-8 sm:px-8 lg:px-10">
        <section className="glass-panel rounded-[2.5rem] border border-orange-100/80 p-7 sm:p-9 print:hidden">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow">Booking receipt</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Your ticket</h1>
              <p className="mt-3 text-sm text-slate-600">Save or print this receipt for boarding and records.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/bookings"
                className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-black text-emerald-800"
              >
                All bookings
              </Link>
              <button
                type="button"
                onClick={handlePrint}
                disabled={!booking}
                className="btn-pay w-auto px-5 py-3 text-sm font-black disabled:opacity-50"
              >
                Download / Print
              </button>
              <button type="button" onClick={handleLogout} className="btn-logout px-5 py-3 text-sm">
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
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <Link to="/bookings" className="mt-5 inline-flex btn-reserve w-auto px-5 py-3 text-sm font-black">
              Back to bookings
            </Link>
          </section>
        ) : null}

        {!loading && !error && booking ? (
          <section className="booking-receipt soft-card overflow-hidden rounded-[2rem] bg-white p-0 shadow-xl">
            <div className="border-b border-dashed border-orange-200 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-800 px-7 py-6 text-white sm:px-9">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-200">
                    <AirplaneIcon className="h-4 w-4" />
                    FlySmart
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight">E-Ticket / Receipt</h2>
                  <p className="mt-2 text-sm text-orange-100">Status: {booking.status || 'booked'}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/15 bg-white/10 px-5 py-4 text-right backdrop-blur">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-orange-100">PNR</p>
                  <p className="mt-2 text-3xl font-black tracking-widest text-white">{pnr}</p>
                  <p className="mt-1 text-sm font-semibold text-amber-100">Booking #{booking.id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 px-7 py-7 sm:px-9 sm:py-9">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-orange-50/80 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-700">Passenger</p>
                  <p className="mt-2 text-xl font-black text-slate-950">{user?.email || `User #${booking.userId}`}</p>
                </div>
                <div className="rounded-[1.5rem] bg-emerald-50/80 p-5">
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                    <AirplaneIcon className="h-4 w-4" />
                    Flight
                  </p>
                  <p className="mt-2 text-xl font-black text-slate-950">
                    {flight.flightNumber ? `Flight ${flight.flightNumber}` : `Flight #${booking.flightId}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-emerald-50 p-5">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-700">
                    <AirportIcon className="h-4 w-4" />
                    From
                  </p>
                  <p className="mt-3 text-4xl font-black text-slate-950">{fromCode}</p>
                  {fromCity ? <p className="mt-1 text-base font-black text-orange-800">{fromCity}</p> : null}
                  <p className="mt-1 text-sm font-semibold text-slate-600">{fromPlace}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{formatDateTime(flight.departureTime)}</p>
                </div>
                <div className="flex items-center text-orange-500">
                  <AirplaneIcon className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <p className="inline-flex items-center justify-end gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                    To
                    <AirportIcon className="h-4 w-4" />
                  </p>
                  <p className="mt-3 text-4xl font-black text-slate-950">{toCode}</p>
                  {toCity ? <p className="mt-1 text-base font-black text-emerald-800">{toCity}</p> : null}
                  <p className="mt-1 text-sm font-semibold text-slate-600">{toPlace}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{formatDateTime(flight.arrivalTime)}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 p-5">
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                    <SeatIcon className="h-4 w-4" />
                    Seats
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950">{booking.noOfSeats ?? '-'}</p>
                </div>
                <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50/70 p-5">
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-sky-700">
                    <GateIcon className="h-4 w-4" />
                    Gate
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {flight.boardingGate ?? flight.boardingGage ?? 'TBD'}
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-gradient-to-br from-amber-500 to-rose-500 p-5 text-white">
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-50">
                    <MoneyIcon className="h-4 w-4" />
                    Amount paid
                  </p>
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
