function FlightCard({ flight }) {
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
  } = flight

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
    <article className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.85)] transition duration-300 hover:-translate-y-1 hover:border-sky-400">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">{flightNumber ? `Flight ${flightNumber}` : 'Flight details'}</p>
            <h3 className="mt-3 text-3xl font-semibold text-white">{departureAirportId || 'MUM'} → {arrivalAirportId || 'DEL'}</h3>
            <p className="mt-2 text-sm text-slate-400">{DepartureAirport || 'Mumbai'} · {ArrivalAirport || 'Delhi'}</p>
          </div>
          <div className="rounded-[1.75rem] bg-slate-900/90 px-5 py-4 text-right text-sm font-semibold text-sky-300">
            <span className="block text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">Starting from</span>
            <span className="mt-3 block text-3xl">₹{price ?? 0}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.75rem] bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Departure</p>
            <p className="mt-3 text-xl font-semibold text-white">{departureAirportId || 'MUM'}</p>
            <p className="text-sm text-slate-400">{DepartureAirport || 'Mumbai International'}</p>
            <p className="mt-4 text-sm text-slate-300">{formatDate(departureTime)}</p>
          </div>
          <div className="rounded-[1.75rem] bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Arrival</p>
            <p className="mt-3 text-xl font-semibold text-white">{arrivalAirportId || 'DEL'}</p>
            <p className="text-sm text-slate-400">{ArrivalAirport || 'Indira Gandhi'}</p>
            <p className="mt-4 text-sm text-slate-300">{formatDate(arrivalTime)}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.75rem] bg-slate-900/80 p-5 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Airplane</p>
            <p className="mt-2 text-lg font-semibold text-white">{AirplaneDetail ?? `Plane #${airplaneId ?? 1}`}</p>
            <p className="mt-2 text-sm text-slate-400">ID: {airplaneId ?? '1'}</p>
          </div>
          <div className="rounded-[1.75rem] bg-slate-900/80 p-5 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Boarding gate</p>
            <p className="mt-2 text-lg font-semibold text-white">{boardingGage ?? 'TBD'}</p>
            <p className="mt-2 text-sm text-slate-400">Gate details at check-in</p>
          </div>
          <div className="rounded-[1.75rem] bg-slate-900/80 p-5 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Created</p>
            <p className="mt-2 text-lg font-semibold text-white">{formatDate(createdAt)}</p>
            <p className="mt-2 text-sm text-slate-400">Booking record created</p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default FlightCard
