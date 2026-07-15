function normalizeMessage(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ')
  }

  if (typeof value === 'string') {
    return value
  }

  return ''
}

export function getApiErrorMessage(error, fallback) {
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

export function getApiData(response) {
  return response.data?.data ?? response.data?.successResponse?.data ?? response.data
}
