import { normalizeFlights, updateFlightSeatsInResponse } from '../utils/flightData'

const ALL_FLIGHTS_CACHE_TTL_MS = 60 * 1000
const FLIGHT_DETAIL_CACHE_TTL_MS = 60 * 1000

let allFlightsCache = {
  data: null,
  fetchedAt: 0,
  token: '',
}

// Per-id flight detail cache: Map<flightId, { flight, fetchedAt, token }>
let flightDetailCache = new Map()

export async function getCachedAllFlights(token, fetcher, { forceRefresh = false } = {}) {
  const cacheIsFresh = Date.now() - allFlightsCache.fetchedAt < ALL_FLIGHTS_CACHE_TTL_MS
  const cacheMatchesSession = allFlightsCache.token === token

  if (!forceRefresh && cacheMatchesSession && cacheIsFresh && allFlightsCache.data) {
    return allFlightsCache.data
  }

  const data = await fetcher()
  allFlightsCache = {
    data,
    fetchedAt: Date.now(),
    token,
  }

  return data
}

/** Returns a flight from the cached all-flights list, if present and same session. */
export function getFlightFromAllCache(token, flightId) {
  if (!allFlightsCache.data || allFlightsCache.token !== token) {
    return null
  }

  const flights = normalizeFlights(allFlightsCache.data)
  return flights.find((flight) => String(flight?.id) === String(flightId)) || null
}

/** Returns a fresh, session-matched flight from the per-id detail cache. */
export function getCachedFlightDetail(token, flightId) {
  const entry = flightDetailCache.get(String(flightId))
  if (!entry || entry.token !== token) {
    return null
  }

  if (Date.now() - entry.fetchedAt >= FLIGHT_DETAIL_CACHE_TTL_MS) {
    return null
  }

  return entry.flight
}

export function setCachedFlightDetail(token, flightId, flight) {
  if (!flight) {
    return
  }

  flightDetailCache.set(String(flightId), {
    flight,
    fetchedAt: Date.now(),
    token,
  })
}

export function updateCachedAllFlightSeats(flightId, seatsDelta) {
  if (!allFlightsCache.data) {
    return
  }

  allFlightsCache = {
    ...allFlightsCache,
    data: updateFlightSeatsInResponse(allFlightsCache.data, flightId, seatsDelta),
  }

  flightDetailCache.delete(String(flightId))
}

export function clearAllFlightsCache() {
  allFlightsCache = {
    data: null,
    fetchedAt: 0,
    token: '',
  }
  flightDetailCache = new Map()
}
