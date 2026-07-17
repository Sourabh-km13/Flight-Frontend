import { AirplaneIcon, MoneyIcon, SeatIcon } from './TravelIcons'

function getFlightRoute(flight) {
  const from = flight?.departureAirportId || flight?.DepartureAirport?.code || 'BOM'
  const to = flight?.arrivalAirportId || flight?.ArrivalAirport?.code || 'DEL'

  return `${from} to ${to}`
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function formatCountdown(seconds) {
  const safeSeconds = Math.max(seconds, 0)
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = safeSeconds % 60

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

function BookingPanel({
  flight,
  seats,
  initiatedBooking,
  remainingSeconds,
  isExpired,
  loading,
  paymentLoading,
  error,
  showClose = true,
  closeLabel = 'Close',
  onSeatsChange,
  onCreateBooking,
  onConfirmPayment,
  onClose,
}) {
  if (!flight) {
    return null
  }

  const availableSeats = Number(flight.totalSeats ?? flight.seats ?? 9)
  const pricePerSeat = Number(flight.price || 0)
  const displayTotal = initiatedBooking?.totalCost ?? pricePerSeat * seats
  const canCreateBooking = Boolean(flight.id) && !initiatedBooking && !loading
  const canConfirmPayment = Boolean(initiatedBooking?.id) && !paymentLoading && !isExpired

  return (
    <aside className="glass-panel rounded-[2rem] border border-orange-100/80 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">
            <AirplaneIcon className="h-3.5 w-3.5" />
            Book flight
          </p>
          <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-950">{getFlightRoute(flight)}</h3>
          <p className="mt-2 text-sm text-slate-500">
            {flight.flightNumber ? `Flight ${flight.flightNumber}` : 'Selected route'}
          </p>
        </div>
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:text-slate-950"
          >
            {closeLabel}
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 rounded-[1.75rem] bg-gradient-to-br from-orange-50 via-white to-emerald-50 p-5 shadow-sm shadow-orange-100/70">
        <label className="block">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            <span className="icon-chip icon-chip-emerald h-8 w-8">
              <SeatIcon className="h-4 w-4" />
            </span>
            Seats
          </span>
          <input
            type="number"
            min="1"
            value={seats}
            disabled={Boolean(initiatedBooking) || loading}
            onChange={(event) => onSeatsChange(Number(event.target.value))}
            className="mt-3 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-lg font-black text-slate-950 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p className="mt-2 text-sm font-semibold text-emerald-700">{availableSeats} available</p>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              <MoneyIcon className="h-4 w-4" />
              Fare
            </p>
            <p className="mt-2 text-lg font-black text-slate-950">{formatCurrency(pricePerSeat)}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-orange-700 p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">Total</p>
            <p className="mt-2 text-lg font-black">{formatCurrency(displayTotal)}</p>
          </div>
        </div>
      </div>

      {initiatedBooking ? (
        <div
          className={`mt-5 rounded-[1.75rem] border p-5 ${
            isExpired ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`text-xs font-bold uppercase tracking-[0.22em] ${isExpired ? 'text-rose-700' : 'text-amber-800'}`}>
                {isExpired ? 'Booking expired' : 'Booking initiated'}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {isExpired ? 'Reserve again to continue.' : 'Complete payment before the timer ends.'}
              </p>
            </div>
            <div
              className={`rounded-2xl px-4 py-3 text-right ${
                isExpired ? 'bg-rose-100 text-rose-700' : 'bg-white text-amber-900 shadow-sm'
              }`}
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-slate-400">Timer</p>
              <p className="mt-1 text-2xl font-black">{formatCountdown(remainingSeconds)}</p>
            </div>
          </div>
          <p className="mt-3 text-sm font-bold text-slate-950">Booking ID: {initiatedBooking.id}</p>
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {!initiatedBooking ? (
          <button type="button" onClick={onCreateBooking} disabled={!canCreateBooking} className="btn-reserve px-5 py-4 text-sm font-black">
            <SeatIcon className="h-4 w-4" />
            {loading ? 'Creating booking...' : 'Reserve seats'}
          </button>
        ) : (
          <button type="button" onClick={onConfirmPayment} disabled={!canConfirmPayment} className="btn-pay px-5 py-4 text-sm font-black">
            <MoneyIcon className="h-4 w-4" />
            {isExpired
              ? 'Reservation expired'
              : paymentLoading
                ? 'Confirming payment...'
                : `Pay ${formatCurrency(displayTotal)}`}
          </button>
        )}

        {!flight.id ? (
          <p className="text-center text-sm font-semibold text-rose-600">Missing flight id.</p>
        ) : null}
      </div>
    </aside>
  )
}

export default BookingPanel
