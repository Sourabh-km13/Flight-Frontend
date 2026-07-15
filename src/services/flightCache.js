import { updateFlightSeatsInResponse } from '../utils/flightData'

const ALL_FLIGHTS_CACHE_TTL_MS = 60 * 1000

let allFlightsCache = {
  data: null,
  fetchedAt: 0,
  token: '',
}

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

export function updateCachedAllFlightSeats(flightId, seatsDelta) {
  if (!allFlightsCache.data) {
    return
  }

  allFlightsCache = {
    ...allFlightsCache,
    data: updateFlightSeatsInResponse(allFlightsCache.data, flightId, seatsDelta),
  }
}

export function clearAllFlightsCache() {
  allFlightsCache = {
    data: null,
    fetchedAt: 0,
    token: '',
  }
}
