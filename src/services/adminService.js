import axios from 'axios'
import { getApiData, getApiErrorMessage } from '../utils/apiResponse'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

function authHeaders(token) {
  return { 'x-access-token': token }
}

export async function adminLogin(payload) {
  try {
    const response = await adminApi.post('/admin/signin', payload)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Admin login failed'), { cause: error })
  }
}

async function adminGet(path, token, params) {
  try {
    const response = await adminApi.get(`/admin/flightservice${path}`, {
      params,
      headers: authHeaders(token),
    })
    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to load data'), { cause: error })
  }
}

async function adminPost(path, token, body) {
  try {
    const response = await adminApi.post(`/admin/flightservice${path}`, body, {
      headers: authHeaders(token),
    })
    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to create record'), { cause: error })
  }
}

async function adminPatch(path, token, body) {
  try {
    const response = await adminApi.patch(`/admin/flightservice${path}`, body, {
      headers: authHeaders(token),
    })
    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to update record'), { cause: error })
  }
}

async function adminPut(path, token, body) {
  try {
    const response = await adminApi.put(`/admin/flightservice${path}`, body, {
      headers: authHeaders(token),
    })
    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to update record'), { cause: error })
  }
}

async function adminDelete(path, token) {
  try {
    const response = await adminApi.delete(`/admin/flightservice${path}`, {
      headers: authHeaders(token),
    })
    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to delete record'), { cause: error })
  }
}

export function fetchAdminCities(token) {
  return adminGet('/api/v1/city', token)
}

export function createAdminCity(token, body) {
  return adminPost('/api/v1/city', token, body)
}

export function updateAdminCity(token, id, body) {
  return adminPatch(`/api/v1/city/${id}`, token, body)
}

export function deleteAdminCity(token, id) {
  return adminDelete(`/api/v1/city/${id}`, token)
}

export function fetchAdminAirports(token) {
  return adminGet('/api/v1/airport', token)
}

export function createAdminAirport(token, body) {
  return adminPost('/api/v1/airport', token, body)
}

export function updateAdminAirport(token, id, body) {
  return adminPatch(`/api/v1/airport/${id}`, token, body)
}

export function deleteAdminAirport(token, id) {
  return adminDelete(`/api/v1/airport/${id}`, token)
}

export function fetchAdminAirplanes(token) {
  return adminGet('/api/v1/airplane', token)
}

export function createAdminAirplane(token, body) {
  return adminPost('/api/v1/airplane', token, body)
}

export function updateAdminAirplane(token, id, body) {
  return adminPatch(`/api/v1/airplane/${id}`, token, body)
}

export function deleteAdminAirplane(token, id) {
  return adminDelete(`/api/v1/airplane/${id}`, token)
}

export function fetchAdminFlights(token) {
  return adminGet('/api/v1/flight', token)
}

export function createAdminFlight(token, body) {
  return adminPost('/api/v1/flight', token, body)
}

export function updateAdminFlight(token, id, body) {
  return adminPut(`/api/v1/flight/${id}`, token, body)
}

export function deleteAdminFlight(token, id) {
  return adminDelete(`/api/v1/flight/${id}`, token)
}
