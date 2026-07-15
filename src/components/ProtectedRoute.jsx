import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../contexts/authStore'

function isExpiredJwt(token) {
  try {
    const payload = JSON.parse(window.atob(token.split('.')[1]))
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()
  } catch {
    return false
  }
}

function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = useAuthStore((state) => state.token)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const hasExpiredToken = token ? isExpiredJwt(token) : false

  useEffect(() => {
    if (hasExpiredToken) {
      clearAuth()
    }
  }, [clearAuth, hasExpiredToken])

  if (!token || hasExpiredToken) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
