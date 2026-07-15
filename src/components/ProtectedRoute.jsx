import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../contexts/authStore'
import { isExpiredJwt } from '../utils/authToken'

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
