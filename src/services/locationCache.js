const LOCATION_CACHE_TTL_MS = 10 * 60 * 1000

let locationCache = {
  data: null,
  fetchedAt: 0,
  token: '',
}

let inFlight = null
let inFlightToken = ''

/**
 * Returns cached { cities, airports } for the session, sharing a single request
 * across near-simultaneous callers. `fetcher` must resolve to { cities, airports }.
 */
export async function getCachedLocationData(token, fetcher, { forceRefresh = false } = {}) {
  const cacheIsFresh = Date.now() - locationCache.fetchedAt < LOCATION_CACHE_TTL_MS
  const cacheMatchesSession = locationCache.token === token

  if (!forceRefresh && cacheMatchesSession && cacheIsFresh && locationCache.data) {
    return locationCache.data
  }

  if (inFlight && inFlightToken === token && !forceRefresh) {
    return inFlight
  }

  inFlightToken = token
  inFlight = (async () => {
    try {
      const data = await fetcher()
      locationCache = {
        data,
        fetchedAt: Date.now(),
        token,
      }
      return data
    } finally {
      inFlight = null
      inFlightToken = ''
    }
  })()

  return inFlight
}

export function clearLocationCache() {
  locationCache = {
    data: null,
    fetchedAt: 0,
    token: '',
  }
  inFlight = null
  inFlightToken = ''
}
