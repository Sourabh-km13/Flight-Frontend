import { useEffect, useState } from 'react'
import { fetchAirports, fetchCities } from '../services/authService'
import { buildLocationOptions } from '../utils/flightData'

export function useLocationOptions(token) {
  const [locationOptions, setLocationOptions] = useState([])
  const [locationsLoading, setLocationsLoading] = useState(false)
  const [locationsError, setLocationsError] = useState('')

  useEffect(() => {
    let shouldUpdate = true

    const loadLocationOptions = async () => {
      setLocationsLoading(true)
      setLocationsError('')

      try {
        const [citiesResponse, airportsResponse] = await Promise.all([fetchCities(token), fetchAirports(token)])

        if (shouldUpdate) {
          setLocationOptions(buildLocationOptions(citiesResponse, airportsResponse))
        }
      } catch (err) {
        if (shouldUpdate) {
          setLocationsError(err.message || 'Could not load city list')
        }
      } finally {
        if (shouldUpdate) {
          setLocationsLoading(false)
        }
      }
    }

    loadLocationOptions()

    return () => {
      shouldUpdate = false
    }
  }, [token])

  return { locationOptions, locationsLoading, locationsError }
}
