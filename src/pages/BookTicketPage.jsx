import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CitySearchInput from '../components/CitySearchInput'
import FlightCard from '../components/FlightCard'
import LogoutButton from '../components/LogoutButton'
import Navbar from '../components/Navbar'
import useAuthStore from '../contexts/authStore'
import { useLocationOptions } from '../hooks/useLocationOptions'
import { fetchAllFlights, fetchFlights } from '../services/authService'
import { normalizeFlights } from '../utils/flightData'

function BookTicketPage() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const [flights, setFlights] = useState([])
  const [search, setSearch] = useState({
    from: '',
    to: '',
    tripDate: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
    fromOption: null,
    toOption: null,
  })
  const { locationOptions, locationsLoading, locationsError } = useLocationOptions(token)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLocationInputChange = (field, value) => {
    setSearch((prev) => ({ ...prev, [field]: value, [`${field}Option`]: null }))
  }

  const handleLocationSelect = (field, option) => {
    setSearch((prev) => ({ ...prev, [field]: option.label, [`${field}Option`]: option }))
  }

  const handleSearchFieldChange = (event) => {
    const { name, value } = event.target
    setSearch((prev) => ({ ...prev, [name]: value }))
  }

  const getFlightSearchParams = () => {
    const params = {}

    if (search.fromOption && search.toOption) {
      params.trips = `${search.fromOption.code}-${search.toOption.code}`
    }

    if (search.tripDate) {
      params.tripDate = search.tripDate
    }

    const minPrice = search.minPrice.trim()
    const maxPrice = search.maxPrice.trim()
    if (minPrice || maxPrice) {
      params.price = `${minPrice || 0}-${maxPrice || 999999}`
    }

    if (search.sort) {
      params.sort = search.sort
    }

    return params
  }

  const fetchFlightResults = async (params = {}) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetchFlights(token, params)
      setFlights(normalizeFlights(response))
    } catch (err) {
      setError(err.message || 'Could not fetch flights')
    } finally {
      setLoading(false)
    }
  }

  const handleFetchFlights = async (event) => {
    event?.preventDefault()
    const from = search.from.trim()
    const to = search.to.trim()
    const minPrice = search.minPrice.trim()
    const maxPrice = search.maxPrice.trim()

    if ((from && !to) || (!from && to)) {
      setError('Enter both From and To.')
      return
    }

    if ((from || to) && (!search.fromOption || !search.toOption)) {
      setError('Select From and To from the city list.')
      return
    }

    if ((minPrice && Number.isNaN(Number(minPrice))) || (maxPrice && Number.isNaN(Number(maxPrice)))) {
      setError('Price filters must be numbers.')
      return
    }

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      setError('Min price cannot be greater than max price.')
      return
    }

    await fetchFlightResults(getFlightSearchParams())
  }

  const handleFetchAllFlights = async () => {
    setSearch({
      from: '',
      to: '',
      tripDate: '',
      minPrice: '',
      maxPrice: '',
      sort: '',
      fromOption: null,
      toOption: null,
    })
    setLoading(true)
    setError('')

    try {
      const response = await fetchAllFlights(token)
      setFlights(normalizeFlights(response))
    } catch (err) {
      setError(err.message || 'Could not fetch flights')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectFlight = (flight) => {
    if (!flight?.id) {
      setError('This flight cannot be booked because it is missing a flight id.')
      return
    }

    navigate(`/searchflights/${flight.id}`, { state: { flight } })
  }

  return (
    <div className="app-shell relative">
      <Navbar />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_32%)]" />
      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <section className="glass-panel overflow-hidden rounded-[2.5rem]">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-slate-950 p-7 text-white sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-200">Book tickets</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Find your next route</h1>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/dashboard"
                  className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Dashboard
                </Link>
                <LogoutButton className="px-5 py-3 text-sm" />
              </div>
            </div>

            <div className="bg-slate-950 p-7 text-white sm:p-9">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Search</p>
                {locationsError ? <p className="text-sm font-semibold text-red-200">{locationsError}</p> : null}
              </div>
              <form onSubmit={handleFetchFlights} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <CitySearchInput
                    label="From"
                    value={search.from}
                    selectedOption={search.fromOption}
                    options={locationOptions}
                    placeholder={locationsLoading ? 'Loading cities...' : 'Mumbai'}
                    onChange={(value) => handleLocationInputChange('from', value)}
                    onSelect={(option) => handleLocationSelect('from', option)}
                  />
                  <CitySearchInput
                    label="To"
                    value={search.to}
                    selectedOption={search.toOption}
                    options={locationOptions}
                    placeholder={locationsLoading ? 'Loading cities...' : 'Delhi'}
                    onChange={(value) => handleLocationInputChange('to', value)}
                    onSelect={(option) => handleLocationSelect('to', option)}
                  />
                </div>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Date</span>
                  <input
                    name="tripDate"
                    type="date"
                    value={search.tripDate}
                    onChange={handleSearchFieldChange}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-lg font-black text-white outline-none focus:border-sky-300"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Min price</span>
                    <input
                      name="minPrice"
                      type="number"
                      min="0"
                      value={search.minPrice}
                      onChange={handleSearchFieldChange}
                      placeholder="e.g. 2000"
                      className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-lg font-black text-white outline-none placeholder:text-slate-500 focus:border-sky-300"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Max price</span>
                    <input
                      name="maxPrice"
                      type="number"
                      min="0"
                      value={search.maxPrice}
                      onChange={handleSearchFieldChange}
                      placeholder="e.g. 8000"
                      className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-lg font-black text-white outline-none placeholder:text-slate-500 focus:border-sky-300"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Sort by</span>
                  <select
                    name="sort"
                    value={search.sort}
                    onChange={handleSearchFieldChange}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-lg font-black text-white outline-none focus:border-sky-300"
                  >
                    <option value="" className="text-slate-950">
                      Default
                    </option>
                    <option value="price-ASC" className="text-slate-950">
                      Price: low to high
                    </option>
                    <option value="price-DESC" className="text-slate-950">
                      Price: high to low
                    </option>
                    <option value="departureTime-ASC" className="text-slate-950">
                      Departure: earliest
                    </option>
                    <option value="departureTime-DESC" className="text-slate-950">
                      Departure: latest
                    </option>
                  </select>
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="submit" disabled={loading} className="gradient-button px-5 py-4 text-sm font-black">
                    {loading ? 'Searching...' : 'Search flights'}
                  </button>
                  <button
                    type="button"
                    onClick={handleFetchAllFlights}
                    disabled={loading}
                    className="rounded-full border border-white/15 bg-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/15 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Fetch all flights'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2.5rem] p-7 sm:p-9">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Flights</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Available flights</h2>
            </div>
            <button onClick={handleFetchAllFlights} disabled={loading} className="gradient-button px-7 py-4 text-sm font-black">
              {loading ? 'Loading flights...' : 'Fetch all flights'}
            </button>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
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
                  locationOptions={locationOptions}
                  onBook={handleSelectFlight}
                  bookingDisabled={!flight.id || loading}
                  bookingLabel="Book now"
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default BookTicketPage
