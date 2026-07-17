export function normalizeList(response) {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.rows)) {
    return response.rows
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  return []
}

export function normalizeFlights(response) {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.flights)) {
    return response.flights
  }

  return normalizeList(response)
}

export function buildLocationOptions(citiesResponse, airportsResponse) {
  const cities = normalizeList(citiesResponse)
  const airports = normalizeList(airportsResponse)
  const cityById = new Map(cities.map((city) => [String(city.id), city.name]))

  return airports
    .filter((airport) => airport?.code)
    .map((airport) => {
      const code = String(airport.code).toUpperCase()
      const cityName = cityById.get(String(airport.cityId)) || airport.cityName || airport.city?.name || airport.name || code

      return {
        label: `${cityName} (${code})`,
        cityName,
        airportName: airport.name || '',
        code,
      }
    })
    .sort((first, second) => first.label.localeCompare(second.label))
}

function getLocationOption(locationOptions, airportCode, airport) {
  const code = String(airportCode || airport?.code || '')
    .trim()
    .toUpperCase()
  if (!code || !Array.isArray(locationOptions)) {
    return null
  }

  return locationOptions.find((option) => option.code === code) || null
}

/** Resolve city display name from search location options (cities + airports already loaded). */
export function getCityNameForAirport(locationOptions, airportCode, airport) {
  const nested = airport?.city?.name || airport?.City?.name || airport?.cityName
  if (nested) {
    return nested
  }

  return getLocationOption(locationOptions, airportCode, airport)?.cityName || ''
}

/** Resolve airport display name from search location options. */
export function getAirportNameForCode(locationOptions, airportCode, airport) {
  if (typeof airport === 'string' && airport.trim()) {
    return airport.trim()
  }

  const nested = airport?.name
  if (nested) {
    return nested
  }

  return getLocationOption(locationOptions, airportCode, airport)?.airportName || ''
}

export function updateFlightSeatsInList(flights, flightId, seatsDelta) {
  return flights.map((flight) =>
    flight.id === flightId ? { ...flight, totalSeats: Math.max(Number(flight.totalSeats ?? 0) + seatsDelta, 0) } : flight,
  )
}

export function updateFlightSeatsInResponse(response, flightId, seatsDelta) {
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
