function getFlightRoute(flight) {
  const from = flight?.departureAirportId || 'BOM'
  const to = flight?.arrivalAirportId || 'DEL'

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
    <aside className="glass-panel rounded-[2rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Book flight</p>
          <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-950">{getFlightRoute(flight)}</h3>
          <p className="mt-2 text-sm text-slate-500">
            {flight.flightNumber ? `Flight ${flight.flightNumber}` : 'Selected route'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:text-slate-950"
        >
          {closeLabel}
        </button>
      </div>

      <div className="mt-6 grid gap-4 rounded-[1.75rem] bg-white p-5 shadow-sm shadow-slate-200/70">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Seats</span>
          <input
            type="number"
            min="1"
            value={seats}
            disabled={Boolean(initiatedBooking) || loading}
            onChange={(event) => onSeatsChange(Number(event.target.value))}
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-black text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p className="mt-2 text-sm font-semibold text-slate-500">{availableSeats} available</p>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Fare</p>
            <p className="mt-2 text-lg font-black text-slate-950">{formatCurrency(pricePerSeat)}</p>
          </div>
          <div className="rounded-2xl bg-slate-950 p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Total</p>
            <p className="mt-2 text-lg font-black">{formatCurrency(displayTotal)}</p>
          </div>
        </div>
      </div>

      {initiatedBooking ? (
        <div
          className={`mt-5 rounded-[1.75rem] border p-5 ${
            isExpired ? 'border-red-200 bg-red-50' : 'border-sky-100 bg-sky-50'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`text-xs font-bold uppercase tracking-[0.22em] ${isExpired ? 'text-red-700' : 'text-sky-700'}`}>
                {isExpired ? 'Booking expired' : 'Booking initiated'}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {isExpired ? 'Reserve again to continue.' : 'Complete payment before the timer ends.'}
              </p>
            </div>
            <div className={`rounded-2xl px-4 py-3 text-right ${isExpired ? 'bg-red-100 text-red-700' : 'bg-white text-slate-950'}`}>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-slate-400">Timer</p>
              <p className="mt-1 text-2xl font-black">{formatCountdown(remainingSeconds)}</p>
            </div>
          </div>
          <p className="mt-3 text-sm font-bold text-slate-950">Booking ID: {initiatedBooking.id}</p>
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {!initiatedBooking ? (
          <button
            type="button"
            onClick={onCreateBooking}
            disabled={!canCreateBooking}
            className="gradient-button px-5 py-4 text-sm font-black"
          >
            {loading ? 'Creating booking...' : 'Reserve seats'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onConfirmPayment}
            disabled={!canConfirmPayment}
            className="gradient-button px-5 py-4 text-sm font-black"
          >
            {isExpired
              ? 'Reservation expired'
              : paymentLoading
                ? 'Confirming payment...'
                : `Pay ${formatCurrency(displayTotal)}`}
          </button>
        )}

        {!flight.id ? (
          <p className="text-center text-sm font-semibold text-red-600">
            Missing flight id.
          </p>
        ) : null}
      </div>
    </aside>
  )
}

export default BookingPanel
