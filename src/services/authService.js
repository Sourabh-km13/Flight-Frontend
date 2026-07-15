import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

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
