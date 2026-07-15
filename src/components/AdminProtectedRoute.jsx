import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../contexts/authStore'
import { isAdminToken, isExpiredJwt } from '../utils/authToken'

function AdminProtectedRoute({ children }) {
  const location = useLocation()
  const token = useAuthStore((state) => state.token)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const hasExpiredToken = token ? isExpiredJwt(token) : false
  const isAdmin = token ? isAdminToken(token) : false

  useEffect(() => {
    if (hasExpiredToken) {
      clearAuth()
    }
  }, [clearAuth, hasExpiredToken])

  if (!token || hasExpiredToken) {
    return <Navigate to="/admin/signin" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    return <Navigate to="/admin/signin" replace state={{ from: location }} />
  }

  return children
}

export default AdminProtectedRoute
