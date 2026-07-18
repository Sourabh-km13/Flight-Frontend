import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const HEALTH_TIMEOUT_MS = 90000
const MAX_ATTEMPTS = 3

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function wakeApiGateway() {
  let lastError

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await axios.get(`${API_BASE_URL}/wake`, {
        timeout: HEALTH_TIMEOUT_MS,
      })

      if (response.status >= 200 && response.status < 300) {
        return response.data
      }

      lastError = new Error(`Gateway wake returned HTTP ${response.status}`)
    } catch (error) {
      lastError = error
      if (attempt < MAX_ATTEMPTS) {
        await delay(1500 * attempt)
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Unable to wake API Gateway')
}
