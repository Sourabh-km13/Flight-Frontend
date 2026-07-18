import { useEffect, useState } from 'react'
import { fetchAirports, fetchCities } from '../services/authService'
import { getCachedLocationData } from '../services/locationCache'
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
        const { cities, airports } = await getCachedLocationData(token, async () => {
          const [citiesResponse, airportsResponse] = await Promise.all([fetchCities(token), fetchAirports(token)])
          return { cities: citiesResponse, airports: airportsResponse }
        })

        if (shouldUpdate) {
          setLocationOptions(buildLocationOptions(cities, airports))
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
