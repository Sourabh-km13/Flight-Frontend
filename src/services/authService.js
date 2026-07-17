import apiClient from '../utils/axiosInstance'
import { getApiData, getApiErrorMessage } from '../utils/apiResponse'
import { getCachedAllFlights } from './flightCache'
export { clearAllFlightsCache, updateCachedAllFlightSeats } from './flightCache'

export async function loginUser(payload) {
  try {
    const response = await apiClient.post('/api/v1/user/signin', payload)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Login failed'), { cause: error })
  }
}

export async function signupUser(payload) {
  try {
    const response = await apiClient.post('/api/v1/user/signup', payload)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Signup failed'), { cause: error })
  }
}

export async function fetchFlights(token, params = {}) {
  try {
    const response = await apiClient.get('/flightservice/api/v1/flight', {
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
  return getCachedAllFlights(token, () => fetchFlights(token), { forceRefresh })
}

export async function fetchFlightById(token, flightId) {
  try {
    const response = await apiClient.get(`/flightservice/api/v1/flight/${flightId}`, {
      headers: {
        'x-access-token': token,
      },
    })
    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to fetch flight details'), { cause: error })
  }
}

export async function fetchCities(token) {
  try {
    const response = await apiClient.get('/flightservice/api/v1/city', {
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
    const response = await apiClient.get('/flightservice/api/v1/airport', {
      headers: {
        'x-access-token': token,
      },
    })
    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to fetch airports'), { cause: error })
  }
}
