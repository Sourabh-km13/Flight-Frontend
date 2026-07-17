import { getCityNameForAirport } from '../utils/flightData'
import { AirplaneIcon, AirportIcon, GateIcon, MoneyIcon, SeatIcon } from './TravelIcons'

function FlightCard({
  flight,
  locationOptions = [],
  onBook,
  bookingLabel = 'Book now',
  bookingDisabled = false,
  isSelected = false,
}) {
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

  const fromCode = routeCode(departureAirportId, DepartureAirport, 'BOM')
  const toCode = routeCode(arrivalAirportId, ArrivalAirport, 'DEL')
  const fromCity = getCityNameForAirport(locationOptions, fromCode, DepartureAirport)
  const toCity = getCityNameForAirport(locationOptions, toCode, ArrivalAirport)
  const fromAirport = airportName(DepartureAirport, fromCode)
  const toAirport = airportName(ArrivalAirport, toCode)

  return (
    <article
      className={`soft-card overflow-hidden rounded-[2rem] border border-orange-100/70 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_28px_70px_-40px_rgba(249,115,22,0.45)] ${
        isSelected ? 'ring-4 ring-orange-400/20' : ''
      }`}
    >
      <div className="p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-700">
              <AirplaneIcon className="h-4 w-4" />
              {flightNumber ? `Flight ${flightNumber}` : 'Flight'}
            </p>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              {fromCode} to {toCode}
            </h3>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {fromCity || fromAirport} to {toCity || toAirport}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-400">
              {fromAirport} ({fromCode}) → {toAirport} ({toCode})
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-gradient-to-br from-amber-500 to-rose-500 px-5 py-4 text-right text-sm font-bold text-white shadow-xl shadow-orange-500/25">
            <span className="block text-[0.65rem] uppercase tracking-[0.24em] text-amber-50">Starting from</span>
            <span className="mt-3 block text-3xl font-black">₹{price ?? 0}</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[1.75rem] bg-gradient-to-br from-orange-50 via-white to-emerald-50 p-5">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-700">
              <AirportIcon className="h-4 w-4" />
              From
            </p>
            <p className="mt-3 text-3xl font-black text-slate-950">{fromCode}</p>
            {fromCity ? <p className="text-sm font-black text-orange-800">{fromCity}</p> : null}
            <p className="text-sm text-slate-500">{fromAirport}</p>
            <p className="mt-1 text-sm text-slate-500">{formatDate(departureTime)}</p>
          </div>
          <div className="flex items-center text-orange-500">
            <AirplaneIcon className="h-7 w-7" />
          </div>
          <div className="text-right">
            <p className="inline-flex items-center justify-end gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
              To
              <AirportIcon className="h-4 w-4" />
            </p>
            <p className="mt-3 text-3xl font-black text-slate-950">{toCode}</p>
            {toCity ? <p className="text-sm font-black text-emerald-800">{toCity}</p> : null}
            <p className="text-sm text-slate-500">{toAirport}</p>
            <p className="mt-1 text-sm text-slate-500">{formatDate(arrivalTime)}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.5rem] border border-teal-100 bg-teal-50/50 p-5 text-sm text-slate-600">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
              <AirplaneIcon className="h-4 w-4" />
              Airplane
            </p>
            <p className="mt-2 text-lg font-black text-slate-950">{airplaneName}</p>
            <p className="mt-1 text-sm text-slate-500">ID: {airplaneId ?? '-'}</p>
          </div>
          <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50/60 p-5 text-sm text-slate-600">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-sky-700">
              <GateIcon className="h-4 w-4" />
              Boarding gate
            </p>
            <p className="mt-2 text-lg font-black text-slate-950">{boardingGate ?? boardingGage ?? 'TBD'}</p>
            <p className="mt-1 text-sm text-slate-500">Gate</p>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 p-5 text-sm text-slate-600">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
              <SeatIcon className="h-4 w-4" />
              Seats
            </p>
            <p className="mt-2 text-lg font-black text-slate-950">{totalSeats ?? '-'}</p>
            <p className="mt-1 text-sm text-slate-500">{createdAt ? formatDate(createdAt) : 'Available'}</p>
          </div>
        </div>

        {onBook ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
              <MoneyIcon className="h-4 w-4 text-amber-600" />
              Pay within 5 minutes.
            </p>
            <button
              type="button"
              onClick={() => onBook(flight)}
              disabled={bookingDisabled}
              className="btn-reserve w-auto px-6 py-3 text-sm font-black disabled:opacity-50"
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
