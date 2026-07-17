import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import BookingPanel from '../components/BookingPanel'
import BookingSummaryCard from '../components/BookingSummaryCard'
import FlightCard from '../components/FlightCard'
import Navbar from '../components/Navbar'
import useAuthStore from '../contexts/authStore'
import { createBooking, makePayment } from '../services/bookingService'
import { fetchFlightById, updateCachedAllFlightSeats } from '../services/authService'
import { getUserIdFromToken } from '../utils/authToken'

const BOOKING_EXPIRY_SECONDS = 5 * 60

function FlightBookingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { flightId } = useParams()
  const token = useAuthStore((state) => state.token)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const stateFlight = location.state?.flight
  const initialFlight =
    stateFlight && String(stateFlight.id) === String(flightId) ? stateFlight : null

  const [flight, setFlight] = useState(initialFlight)
  const [loadingFlight, setLoadingFlight] = useState(!initialFlight)
  const [flightError, setFlightError] = useState('')
  const [seatCount, setSeatCount] = useState(1)
  const [activeBooking, setActiveBooking] = useState(null)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [bookingError, setBookingError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [bookingExpiresAt, setBookingExpiresAt] = useState(null)
  const [remainingSeconds, setRemainingSeconds] = useState(BOOKING_EXPIRY_SECONDS)

  const bookingExpired = Boolean(activeBooking && bookingExpiresAt && remainingSeconds <= 0)
  const visibleBookingError = bookingExpired
    ? 'This booking reservation expired. Reserve seats again to continue.'
    : bookingError

  const loadFlight = useCallback(async () => {
    if (!token || !flightId) {
      return
    }

    setLoadingFlight(true)
    setFlightError('')

    try {
      const response = await fetchFlightById(token, flightId)
      setFlight(response)
    } catch (err) {
      setFlight(null)
      setFlightError(err.message || 'Could not load flight details')
    } finally {
      setLoadingFlight(false)
    }
  }, [flightId, token])

  useEffect(() => {
    if (initialFlight) {
      setFlight(initialFlight)
      setLoadingFlight(false)
      setFlightError('')
      return
    }

    loadFlight()
  }, [initialFlight, loadFlight])

  useEffect(() => {
    if (!activeBooking || !bookingExpiresAt) {
      return undefined
    }

    const updateRemainingSeconds = () => {
      setRemainingSeconds(Math.max(Math.ceil((bookingExpiresAt - Date.now()) / 1000), 0))
    }

    updateRemainingSeconds()
    const intervalId = window.setInterval(updateRemainingSeconds, 1000)

    return () => window.clearInterval(intervalId)
  }, [activeBooking, bookingExpiresAt])

  useEffect(() => {
    if (!activeBooking || bookingExpired) {
      return undefined
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [activeBooking, bookingExpired])

  const updateFlightSeats = (seatsDelta) => {
    setFlight((prev) =>
      prev
        ? { ...prev, totalSeats: Math.max(Number(prev.totalSeats ?? 0) + seatsDelta, 0) }
        : prev,
    )
    if (flight?.id) {
      updateCachedAllFlightSeats(flight.id, seatsDelta)
    }
  }

  const handleSeatChange = (value) => {
    const nextValue = Number.isFinite(value) ? value : 1
    setSeatCount(Math.max(nextValue, 1))
  }

  const handleCreateBooking = async () => {
    const userId = getUserIdFromToken(token)

    if (!flight?.id) {
      setBookingError('This flight cannot be booked because it is missing a flight id.')
      return
    }

    if (!userId) {
      setBookingError('Could not identify the signed-in user from the current session.')
      return
    }

    setBookingLoading(true)
    setBookingError('')

    try {
      const booking = await createBooking({
        token,
        flightId: flight.id,
        userId,
        noOfSeats: seatCount,
      })

      setActiveBooking(booking)
      setBookingExpiresAt(new Date(booking.createdAt || Date.now()).getTime() + BOOKING_EXPIRY_SECONDS * 1000)
      updateFlightSeats(-seatCount)
    } catch (err) {
      setBookingError(err.message || 'Could not create booking')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleConfirmPayment = async () => {
    const userId = getUserIdFromToken(token)

    if (!activeBooking?.id) {
      setBookingError('Create a booking before confirming payment.')
      return
    }

    if (bookingExpired) {
      setBookingError('This booking reservation expired. Reserve seats again to continue.')
      return
    }

    if (!userId) {
      setBookingError('Could not identify the signed-in user from the current session.')
      return
    }

    setPaymentLoading(true)
    setBookingError('')

    try {
      const payment = await makePayment({
        token,
        bookingId: activeBooking.id,
        userId,
        totalCost: activeBooking.totalCost,
      })
      const confirmed = Array.isArray(payment) ? { ...activeBooking, status: 'booked' } : payment

      setConfirmedBooking(confirmed)
      setActiveBooking(null)
      setBookingExpiresAt(null)
      setRemainingSeconds(BOOKING_EXPIRY_SECONDS)
      setSeatCount(1)
    } catch (err) {
      setBookingError(err.message || 'Could not confirm payment')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleBackToSearch = () => {
    navigate('/bookticket')
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="app-shell relative">
      <Navbar />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_32%)]" />
      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <section className="glass-panel overflow-hidden rounded-[2.5rem] p-7 sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow">Flight details</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Review and book
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Confirm the itinerary, reserve seats, and complete payment within 5 minutes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/bookticket"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-slate-300"
              >
                Back to search
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-slate-300"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        {loadingFlight ? (
          <section className="soft-card h-72 animate-pulse rounded-[2rem] p-6">
            <div className="h-5 w-32 rounded-full bg-slate-200" />
            <div className="mt-6 h-10 w-56 rounded-full bg-slate-200" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="h-28 rounded-[1.5rem] bg-slate-100" />
              <div className="h-28 rounded-[1.5rem] bg-slate-100" />
            </div>
          </section>
        ) : null}

        {flightError ? (
          <section className="soft-card rounded-[2rem] p-8">
            <p className="text-sm font-semibold text-red-600">{flightError}</p>
            <Link to="/bookticket" className="mt-5 inline-flex gradient-button px-5 py-3 text-sm font-black">
              Back to search
            </Link>
          </section>
        ) : null}

        {confirmedBooking ? (
          <section className="space-y-6">
            <BookingSummaryCard booking={confirmedBooking} onDismiss={() => setConfirmedBooking(null)} />
            <div className="flex flex-wrap gap-3">
              <Link to="/bookings" className="gradient-button px-5 py-3 text-sm font-black">
                View booked tickets
              </Link>
              <Link
                to="/bookticket"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
              >
                Search more flights
              </Link>
            </div>
          </section>
        ) : null}

        {!loadingFlight && !flightError && flight && !confirmedBooking ? (
          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <FlightCard flight={flight} />
            <BookingPanel
              flight={flight}
              seats={seatCount}
              initiatedBooking={activeBooking}
              remainingSeconds={remainingSeconds}
              isExpired={bookingExpired}
              loading={bookingLoading}
              paymentLoading={paymentLoading}
              error={visibleBookingError}
              closeLabel="Back to search"
              onSeatsChange={handleSeatChange}
              onCreateBooking={handleCreateBooking}
              onConfirmPayment={handleConfirmPayment}
              onClose={handleBackToSearch}
            />
          </section>
        ) : null}
      </main>
    </div>
  )
}

export default FlightBookingPage
