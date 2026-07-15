import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookingPanel from '../components/BookingPanel'
import BookingSummaryCard from '../components/BookingSummaryCard'
import FlightCard from '../components/FlightCard'
import Navbar from '../components/Navbar'
import useAuthStore from '../contexts/authStore'
import { createBooking, makePayment } from '../services/bookingService'
import { fetchFlights } from '../services/authService'
import { getUserIdFromToken } from '../utils/authToken'

const BOOKING_EXPIRY_SECONDS = 5 * 60

function normalizeFlights(response) {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.flights)) {
    return response.flights
  }

  if (Array.isArray(response?.rows)) {
    return response.rows
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  return []
}

function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFlight, setSelectedFlight] = useState(null)
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

  const stats = useMemo(
    () => [
      { label: 'Available flights', value: flights.length, detail: 'Loaded from flight service' },
      { label: 'Last visit', value: new Date().toLocaleDateString('en-GB'), detail: 'Local session' },
      { label: 'Traveler', value: user?.name || user?.email || 'Guest', detail: 'Signed-in profile' },
    ],
    [flights.length, user],
  )

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

  const handleFetchFlights = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetchFlights(token)
      setFlights(normalizeFlights(response))
    } catch (err) {
      setError(err.message || 'Could not fetch flights')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight)
    setSeatCount(1)
    setActiveBooking(null)
    setBookingExpiresAt(null)
    setRemainingSeconds(BOOKING_EXPIRY_SECONDS)
    setBookingError('')
  }

  const handleSeatChange = (value) => {
    const nextValue = Number.isFinite(value) ? value : 1
    const availableSeats = Number(selectedFlight?.totalSeats ?? selectedFlight?.seats ?? 9)
    const maxSeats = Number.isFinite(availableSeats) && availableSeats > 0 ? availableSeats : 9

    setSeatCount(Math.min(Math.max(nextValue, 1), maxSeats))
  }

  const handleCreateBooking = async () => {
    const userId = getUserIdFromToken(token)

    if (!selectedFlight?.id) {
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
        flightId: selectedFlight.id,
        userId,
        noOfSeats: seatCount,
      })

      setActiveBooking(booking)
      setBookingExpiresAt(new Date(booking.createdAt || Date.now()).getTime() + BOOKING_EXPIRY_SECONDS * 1000)
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
      setSelectedFlight(null)
      setBookingExpiresAt(null)
      setRemainingSeconds(BOOKING_EXPIRY_SECONDS)
      setSeatCount(1)
    } catch (err) {
      setBookingError(err.message || 'Could not confirm payment')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleCloseBookingPanel = () => {
    setSelectedFlight(null)
    setActiveBooking(null)
    setBookingExpiresAt(null)
    setRemainingSeconds(BOOKING_EXPIRY_SECONDS)
    setBookingError('')
    setSeatCount(1)
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
        <section className="glass-panel overflow-hidden rounded-[2.5rem]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-7 sm:p-9">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-2xl">
                  <p className="eyebrow">Dashboard</p>
                  <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Dashboard</h1>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
                >
                  Logout
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="soft-card rounded-[1.75rem] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                    <p className="mt-3 truncate text-2xl font-black text-slate-950">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-7 text-white sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Trip</p>
              <div className="mt-6 space-y-4">
                {[
                  { label: 'Origin', value: 'Mumbai', code: 'BOM' },
                  { label: 'Destination', value: 'Delhi', code: 'DEL' },
                  { label: 'Type', value: 'Non-stop', code: 'Best value' },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <p className="text-2xl font-black">{item.value}</p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950">{item.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Flights</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Available flights</h2>
            </div>
            <button
              onClick={handleFetchFlights}
              disabled={loading}
              className="gradient-button px-7 py-4 text-sm font-black"
            >
              {loading ? 'Loading flights...' : 'Fetch flights'}
            </button>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          {confirmedBooking ? (
            <div className="mt-8">
              <BookingSummaryCard booking={confirmedBooking} onDismiss={() => setConfirmedBooking(null)} />
            </div>
          ) : null}

          <div className={`mt-8 grid gap-6 ${selectedFlight ? 'xl:grid-cols-[minmax(0,1fr)_380px]' : ''}`}>
            <div className={`grid gap-6 ${selectedFlight ? '' : 'xl:grid-cols-2'}`}>
            {loading ? (
              [0, 1].map((item) => (
                <div key={item} className="soft-card h-72 animate-pulse rounded-[2rem] p-6">
                  <div className="h-5 w-32 rounded-full bg-slate-200" />
                  <div className="mt-6 h-10 w-56 rounded-full bg-slate-200" />
                  <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    <div className="h-28 rounded-[1.5rem] bg-slate-100" />
                    <div className="h-28 rounded-[1.5rem] bg-slate-100" />
                  </div>
                </div>
              ))
            ) : flights.length === 0 ? (
              <div className="soft-card rounded-[2rem] p-10 xl:col-span-2">
                <div className="mx-auto max-w-md text-center">
                  <p className="text-5xl">FS</p>
                  <h3 className="mt-5 text-2xl font-black text-slate-950">No flights loaded</h3>
                </div>
              </div>
            ) : (
              flights.map((flight, index) => (
                <FlightCard
                  key={flight.id || `${flight.flightNumber || 'flight'}-${index}`}
                  flight={flight}
                  onBook={handleSelectFlight}
                  bookingDisabled={!flight.id || bookingLoading || paymentLoading}
                  bookingLabel={selectedFlight?.id === flight.id ? 'Selected' : 'Book now'}
                  isSelected={selectedFlight?.id === flight.id}
                />
              ))
            )}
            </div>

            {selectedFlight ? (
              <BookingPanel
                flight={selectedFlight}
                seats={seatCount}
                initiatedBooking={activeBooking}
                remainingSeconds={remainingSeconds}
                isExpired={bookingExpired}
                loading={bookingLoading}
                paymentLoading={paymentLoading}
                error={visibleBookingError}
                onSeatsChange={handleSeatChange}
                onCreateBooking={handleCreateBooking}
                onConfirmPayment={handleConfirmPayment}
                onClose={handleCloseBookingPanel}
              />
            ) : null}
          </div>
        </section>
      </main>
    </div>
  )
}

export default DashboardPage
