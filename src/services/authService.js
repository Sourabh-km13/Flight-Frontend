import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function loginUser(payload) {
  try {
    const response = await authApi.post('api/v1/user/signin', payload)
    console.log(response.data);
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed')
  }
}

export async function signupUser(payload) {
  try {
    const response = await authApi.post('api/v1/user/signup', payload)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed')
  }
}

export async function fetchFlights(token) {
  try {
    const response = await authApi.get('/flightservice/api/v1/flight', {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
    console.log('Flight service response:', response.data)
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Unable to fetch flights')
  }
}
