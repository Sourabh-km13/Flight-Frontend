import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

const bookingApi = axios.create({
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

function getErrorMessage(error, fallback) {
  const data = error.response?.data
  const failResponse = data?.failResponse

  return (
    normalizeMessage(failResponse?.data?.explanation) ||
    normalizeMessage(failResponse?.data?.message) ||
    normalizeMessage(failResponse?.error) ||
    normalizeMessage(data?.error?.message) ||
    normalizeMessage(data?.message) ||
    normalizeMessage(failResponse?.message) ||
    fallback
  )
}

function getResponseData(response) {
  return response.data?.data ?? response.data
}

export async function createBooking({ token, flightId, userId, noOfSeats }) {
  try {
    const response = await bookingApi.post(
      '/bookingservice/api/v1/booking',
      { flightId, userId, noOfSeats },
      {
        headers: {
          'x-access-token': token,
        },
      },
    )

    return getResponseData(response)
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to create booking'), { cause: error })
  }
}

export async function makePayment({ token, bookingId, userId, totalCost }) {
  try {
    const response = await bookingApi.post(
      '/bookingservice/api/v1/booking/payment',
      { bookingId, userId, totalCost },
      {
        headers: {
          'x-access-token': token,
        },
      },
    )

    return getResponseData(response)
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to confirm payment'), { cause: error })
  }
}
