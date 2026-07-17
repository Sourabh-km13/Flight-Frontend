import { useNavigate } from 'react-router-dom'
import useAuthStore from '../contexts/authStore'

function LogoutButton({ className = '', redirectTo = '/login', children = 'Logout', ...props }) {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const handleLogout = () => {
    clearAuth()
    navigate(redirectTo)
  }

  return (
    <button type="button" onClick={handleLogout} className={`btn-logout ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

export default LogoutButton
