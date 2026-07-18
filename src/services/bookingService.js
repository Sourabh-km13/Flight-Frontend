import apiClient from '../utils/axiosInstance'
import { getApiData, getApiErrorMessage } from '../utils/apiResponse'

export async function createBooking({ token, flightId, userId, noOfSeats }) {
  try {
    const response = await apiClient.post(
      '/bookingservice/api/v1/booking',
      { flightId, userId, noOfSeats },
      {
        headers: {
          'x-access-token': token,
        },
      },
    )

    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to create booking'), { cause: error })
  }
}

export async function makePayment({ token, bookingId, userId, totalCost,userEmail }) {
  try {
    const response = await apiClient.post(
      '/bookingservice/api/v1/booking/payment',
      { bookingId, userId, totalCost,userEmail },
      {
        headers: {
          'x-access-token': token,
        },
      },
    )

    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to confirm payment'), { cause: error })
  }
}

export async function fetchUserBookings({ token, userId, status }) {
  try {
    const response = await apiClient.get(`/bookingservice/api/v1/booking/user/${userId}`, {
      params: status ? { status } : {},
      headers: {
        'x-access-token': token,
      },
    })

    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to fetch bookings'), { cause: error })
  }
}

export async function fetchBookingById({ token, bookingId }) {
  try {
    const response = await apiClient.get(`/bookingservice/api/v1/booking/${bookingId}`, {
      headers: {
        'x-access-token': token,
      },
    })

    return getApiData(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to fetch booking receipt'), { cause: error })
  }
}
