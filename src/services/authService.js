import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

const ALL_FLIGHTS_CACHE_TTL_MS = 60 * 1000
let allFlightsCache = {
  data: null,
  fetchedAt: 0,
  token: '',
}

function normalizeMessage(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ')
  }

  if (typeof value === 'string') {
    return value
  }

  return ''
}

function getApiErrorMessage(error, fallback) {
  const data = error.response?.data
  const failResponse = data?.failResponse

  return (
    normalizeMessage(failResponse?.data?.explanation) ||
    normalizeMessage(failResponse?.data?.message) ||
    normalizeMessage(failResponse?.error) ||
    normalizeMessage(data?.error) ||
    normalizeMessage(data?.explanation) ||
    normalizeMessage(data?.message) ||
    normalizeMessage(failResponse?.message) ||
    fallback
  )
}

function getApiData(response) {
  return response.data?.data ?? response.data?.successResponse?.data ?? response.data
}

function updateFlightSeatsInList(flights, flightId, seatsDelta) {
  return flights.map((flight) =>
    flight.id === flightId ? { ...flight, totalSeats: Math.max(Number(flight.totalSeats ?? 0) + seatsDelta, 0) } : flight,
  )
}

function updateFlightSeatsInResponse(response, flightId, seatsDelta) {
  if (Array.isArray(response)) {
    return updateFlightSeatsInList(response, flightId, seatsDelta)
  }

  if (Array.isArray(response?.flights)) {
    return { ...response, flights: updateFlightSeatsInList(response.flights, flightId, seatsDelta) }
  }

  if (Array.isArray(response?.rows)) {
    return { ...response, rows: updateFlightSeatsInList(response.rows, flightId, seatsDelta) }
  }

  if (Array.isArray(response?.data)) {
    return { ...response, data: updateFlightSeatsInList(response.data, flightId, seatsDelta) }
  }

  return response
}

export async function loginUser(payload) {
  try {
    const response = await authApi.post('/api/v1/user/signin', payload)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Login failed'), { cause: error })
  }
}

export async function signupUser(payload) {
  try {
    const response = await authApi.post('/api/v1/user/signup', payload)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Signup failed'), { cause: error })
  }
}

export async function fetchFlights(token, params = {}) {
  try {
    const response = await authApi.get('/flightservice/api/v1/flight', {
      params,
      headers: {
        'x-access-token': token,
      },
    })
    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to fetch flights'), { cause: error })
  }
}

export async function fetchAllFlights(token, { forceRefresh = false } = {}) {
  const cacheIsFresh = Date.now() - allFlightsCache.fetchedAt < ALL_FLIGHTS_CACHE_TTL_MS
  const cacheMatchesSession = allFlightsCache.token === token

  if (!forceRefresh && cacheMatchesSession && cacheIsFresh && allFlightsCache.data) {
    return allFlightsCache.data
  }

  const data = await fetchFlights(token)
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

export async function fetchCities(token) {
  try {
    const response = await authApi.get('/flightservice/api/v1/city', {
      headers: {
        'x-access-token': token,
      },
    })
    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to fetch cities'), { cause: error })
  }
}

export async function fetchAirports(token) {
  try {
    const response = await authApi.get('/flightservice/api/v1/airport', {
      headers: {
        'x-access-token': token,
      },
    })
    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to fetch airports'), { cause: error })
  }
}
