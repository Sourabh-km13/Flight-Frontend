function FlightCard({ flight, onBook, bookingLabel = 'Book now', bookingDisabled = false, isSelected = false }) {
  const {
    flightNumber,
    price,
    departureAirportId,
    arrivalAirportId,
    departureTime,
    arrivalTime,
    boardingGage,
    airplaneId,
    AirplaneDetail,
    DepartureAirport,
    ArrivalAirport,
    createdAt,
    boardingGate,
    totalSeats,
  } = flight

  const routeCode = (value, airport, fallback) => value || airport?.code || fallback
  const airportName = (value, fallback) => (typeof value === 'string' ? value : value?.name || value?.code || fallback)
  const airplaneName = typeof AirplaneDetail === 'string' ? AirplaneDetail : AirplaneDetail?.modelNumber || `Plane #${airplaneId ?? '-'}`
  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-'

  return (
    <article
      className={`soft-card overflow-hidden rounded-[2rem] transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_28px_70px_-40px_rgba(3,105,161,0.75)] ${
        isSelected ? 'ring-4 ring-sky-500/20' : ''
      }`}
    >
      <div className="p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-700">{flightNumber ? `Flight ${flightNumber}` : 'Flight'}</p>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              {routeCode(departureAirportId, DepartureAirport, 'BOM')} to {routeCode(arrivalAirportId, ArrivalAirport, 'DEL')}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {airportName(DepartureAirport, 'Mumbai')} to {airportName(ArrivalAirport, 'Delhi')}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-950 px-5 py-4 text-right text-sm font-bold text-sky-100 shadow-xl shadow-slate-900/15">
            <span className="block text-[0.65rem] uppercase tracking-[0.24em] text-slate-400">Starting from</span>
            <span className="mt-3 block text-3xl font-black text-white">₹{price ?? 0}</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[1.75rem] bg-slate-50 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">From</p>
            <p className="mt-3 text-3xl font-black text-slate-950">{routeCode(departureAirportId, DepartureAirport, 'BOM')}</p>
            <p className="text-sm text-slate-500">{formatDate(departureTime)}</p>
          </div>
          <div className="flex items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            <span className="h-px w-14 bg-gradient-to-r from-sky-500 to-orange-300 sm:w-24" />
            <span className="h-2.5 w-2.5 rounded-full bg-orange-300" />
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">To</p>
            <p className="mt-3 text-3xl font-black text-slate-950">{routeCode(arrivalAirportId, ArrivalAirport, 'DEL')}</p>
            <p className="text-sm text-slate-500">{formatDate(arrivalTime)}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 text-sm text-slate-600">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Airplane</p>
            <p className="mt-2 text-lg font-black text-slate-950">{airplaneName}</p>
            <p className="mt-1 text-sm text-slate-500">ID: {airplaneId ?? '-'}</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 text-sm text-slate-600">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Boarding gate</p>
            <p className="mt-2 text-lg font-black text-slate-950">{boardingGate ?? boardingGage ?? 'TBD'}</p>
            <p className="mt-1 text-sm text-slate-500">Gate</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 text-sm text-slate-600">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Seats</p>
            <p className="mt-2 text-lg font-black text-slate-950">{totalSeats ?? '-'}</p>
            <p className="mt-1 text-sm text-slate-500">{createdAt ? formatDate(createdAt) : 'Available'}</p>
          </div>
        </div>

        {onBook ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-500">Pay within 5 minutes.</p>
            <button
              type="button"
              onClick={() => onBook(flight)}
              disabled={bookingDisabled}
              className="gradient-button px-6 py-3 text-sm font-black disabled:opacity-50"
            >
              {bookingLabel}
            </button>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default FlightCard
